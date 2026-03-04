import { createOpencodeClient } from '@opencode-ai/sdk/v2';
import { env } from '$env/dynamic/private';
import type { ChatModel } from '$lib/ai/models';

type ProviderListResponse = {
	data?: {
		all?: Array<{
			id: string;
			name: string;
			models: Record<
				string,
				{
					id: string;
					name: string;
					reasoning: boolean;
					status?: 'alpha' | 'beta' | 'deprecated';
				}
			>;
		}>;
		connected?: string[];
	};
};

const CACHE_TTL_MS = 60_000;

let cachedModels: ChatModel[] = [];
let cachedAt = 0;

function toModelId(providerId: string, modelId: string) {
	return `opencode:${providerId}/${modelId}`;
}

export async function getOpencodeChatModels(): Promise<ChatModel[]> {
	if (Date.now() - cachedAt < CACHE_TTL_MS && cachedModels.length > 0) {
		return cachedModels;
	}

	try {
		const client = createOpencodeClient({
			baseUrl: env.OPENCODE_API_BASE ?? 'http://127.0.0.1:4096'
		});
		const response = (await client.provider.list({})) as ProviderListResponse;
		const payload = response.data;

		if (!payload?.all?.length) {
			return [];
		}

		const connectedProviders = new Set(payload.connected ?? []);
		const models: ChatModel[] = [];

		for (const provider of payload.all) {
			if (!connectedProviders.has(provider.id)) continue;

			for (const model of Object.values(provider.models ?? {})) {
				if (model.status === 'deprecated') continue;

				models.push({
					id: toModelId(provider.id, model.id),
					name: model.name,
					description: `${provider.name} via OpenCode`,
					provider: 'opencode',
					modelId: `${provider.id}/${model.id}`,
					reasoning: model.reasoning
				});
			}
		}

		cachedModels = models;
		cachedAt = Date.now();
		return models;
	} catch (error) {
		console.error('Failed to fetch OpenCode models', error);
		return [];
	}
}
