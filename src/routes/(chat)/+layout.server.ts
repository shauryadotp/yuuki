import { chatModels, DEFAULT_CHAT_MODEL } from '$lib/ai/models';
import { SelectedModel } from '$lib/hooks/selected-model.svelte.js';
import { getOpencodeChatModels } from '$lib/server/ai/opencode-models';

function dedupeById<T extends { id: string }>(items: T[]) {
	return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

export async function load({ cookies, locals }) {
	const { user } = locals;
	const sidebarCollapsed = cookies.get('sidebar:state') !== 'true';
	const availableChatModels = dedupeById([...chatModels, ...(await getOpencodeChatModels())]);

	let modelId = cookies.get('selected-model');
	if (!modelId || !availableChatModels.find((model) => model.id === modelId)) {
		modelId =
			availableChatModels.find((model) => model.id === DEFAULT_CHAT_MODEL)?.id ??
			availableChatModels[0]?.id ??
			DEFAULT_CHAT_MODEL;
		cookies.set('selected-model', modelId, {
			path: '/',
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			httpOnly: true,
			sameSite: 'lax'
		});
	}

	return {
		user,
		sidebarCollapsed,
		availableChatModels,
		selectedChatModel: new SelectedModel(modelId)
	};
}
