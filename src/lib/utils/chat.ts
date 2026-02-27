import type { Message as DBMessage, Document } from '$lib/server/db/schema';
import type { FileUIPart, UIMessage } from 'ai';

export function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
	return messages.map((message) => {
		const parts = (message.parts as UIMessage['parts']) ?? [];
		const attachments = (message.attachments as Array<unknown>) ?? [];

		const filePartsFromAttachments: FileUIPart[] = attachments
			.map((attachment) => {
				if (!attachment || typeof attachment !== 'object') return null;

				// v6 FileUIPart persisted directly.
				if ('type' in attachment && (attachment as any).type === 'file') {
					return attachment as FileUIPart;
				}

				// Legacy attachment shape: { url, name, contentType }
				if ('url' in attachment) {
					const url = (attachment as any).url;
					const filename = (attachment as any).name;
					const mediaType = (attachment as any).contentType;
					if (typeof url !== 'string' || typeof mediaType !== 'string') return null;
					return {
						type: 'file',
						url,
						mediaType,
						filename: typeof filename === 'string' ? filename : undefined
					};
				}

				return null;
			})
			.filter((part): part is FileUIPart => part !== null);

		const mergedParts = [...parts, ...filePartsFromAttachments];

		return {
			id: message.id,
			parts: mergedParts,
			role: message.role as UIMessage['role']
		};
	});
}

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
	const userMessages = messages.filter((message) => message.role === 'user');
	return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(documents: Array<Document>, index: number) {
	if (!documents) return new Date();
	if (index > documents.length) return new Date();

	return documents[index].createdAt;
}
