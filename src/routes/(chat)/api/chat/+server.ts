import { myProvider } from '$lib/server/ai/models';
import { systemPrompt } from '$lib/server/ai/prompts.js';
import { generateTitleFromUserMessage } from '$lib/server/ai/utils';
import { deleteChatById, getChatById, saveChat, saveMessages } from '$lib/server/db/queries.js';
import type { Chat } from '$lib/server/db/schema';
import { getMostRecentUserMessage } from '$lib/utils/chat.js';
import { allowAnonymousChats } from '$lib/utils/constants.js';
import { error } from '@sveltejs/kit';
import {
	convertToModelMessages,
	smoothStream,
	streamText,
	type UIMessage
} from 'ai';
import { ok, safeTry } from 'neverthrow';

export async function POST({ request, locals: { user }, cookies }) {
	// TODO: zod?
	const {
		id,
		messages,
		trigger
	}: { id: string; messages: UIMessage[]; trigger?: 'submit-message' | 'regenerate-message' } =
		await request.json();
	const selectedChatModel = cookies.get('selected-model');

	if (!user && !allowAnonymousChats) {
		error(401, 'Unauthorized');
	}

	if (!selectedChatModel) {
		error(400, 'No chat model selected');
	}

	const userMessage = getMostRecentUserMessage(messages);

	if (!userMessage) {
		error(400, 'No user message found');
	}

	if (user && trigger !== 'regenerate-message') {
		await safeTry(async function* () {
			let chat: Chat;
			const chatResult = await getChatById({ id });
			if (chatResult.isErr()) {
				if (chatResult.error._tag !== 'DbEntityNotFoundError') {
					return chatResult;
				}
				const title = yield* generateTitleFromUserMessage({ message: userMessage });
				chat = yield* saveChat({ id, userId: user.id, title });
			} else {
				chat = chatResult.value;
			}

			if (chat.userId !== user.id) {
				error(403, 'Forbidden');
			}

			const attachments = userMessage.parts.filter((part) => part.type === 'file');
			yield* saveMessages({
				messages: [
					{
						chatId: id,
						id: userMessage.id,
						role: 'user',
						parts: userMessage.parts,
						attachments,
						createdAt: new Date()
					}
				]
			});

			return ok(undefined);
		}).orElse(() => error(500, 'An error occurred while processing your request'));
	}

	const modelMessages = await convertToModelMessages(
		messages.map(({ id: _id, ...rest }) => rest),
		{ ignoreIncompleteToolCalls: true }
	);

	const result = streamText({
		model: myProvider.languageModel(selectedChatModel),
		system: systemPrompt({ selectedChatModel }),
		messages: modelMessages,
		experimental_activeTools: [],
		experimental_transform: smoothStream({ chunking: 'word' }),
		experimental_telemetry: {
			isEnabled: true,
			functionId: 'stream-text'
		}
	});

	return result.toUIMessageStreamResponse({
		originalMessages: messages,
		generateMessageId: crypto.randomUUID.bind(crypto),
		sendReasoning: true,
		onFinish: async ({ responseMessage }) => {
			if (!user || trigger === 'regenerate-message') return;
			const attachments = responseMessage.parts.filter((part) => part.type === 'file');

			await saveMessages({
				messages: [
					{
						id: responseMessage.id,
						chatId: id,
						role: responseMessage.role,
						parts: responseMessage.parts,
						attachments,
						createdAt: new Date()
					}
				]
			});
		},
		onError: (e) => {
			console.error(e);
			return 'Oops!';
		}
	});
}

export async function DELETE({ locals: { user }, request }) {
	// TODO: zod
	const { id }: { id: string } = await request.json();
	if (!user) {
		error(401, 'Unauthorized');
	}

	return await getChatById({ id })
		.andTee((chat) => {
			if (chat.userId !== user.id) {
				error(403, 'Forbidden');
			}
		})
		.andThen(deleteChatById)
		.match(
			() => new Response('Chat deleted', { status: 200 }),
			() => error(500, 'An error occurred while processing your request')
		);
}
