import { createXai } from '@ai-sdk/xai';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createOpencode } from 'ai-sdk-provider-opencode-sdk';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { env } from '$env/dynamic/private';
import { chatModels, DEFAULT_CHAT_MODEL, type ChatModelProvider } from '$lib/ai/models';

const API_KEY = env.CF_AIG_TOKEN;
const GTW = 'https://gateway.ai.cloudflare.com/v1/777c4da72d65e3f7672fcdcac50f0eec/yuuki-ai';
const xai = createXai({ apiKey: env.XAI_API_KEY! });

const groq = createGroq({
	baseURL: `${GTW}/groq`,
	apiKey: API_KEY!
});

const nim = createOpenAICompatible({
	name: 'NVIDIA NIM',
	apiKey: API_KEY,
	baseURL: `${GTW}/custom-nv/v1`
});

const oc = createOpenAICompatible({
	name: 'Ollama Cloud',
	apiKey: API_KEY,
	baseURL: `${GTW}/custom-oc/v1`
});

const cerebras = createOpenAICompatible({
	name: 'Cerebras',
	apiKey: API_KEY,
	baseURL: `${GTW}/cerebras/v1`
});

const mimo = createOpenAICompatible({
	name: 'Xiaomi MiMo',
	apiKey: API_KEY,
	baseURL: `${GTW}/custom-mimo/v1`
});

const opencode = createOpencode();

const providers: Record<ChatModelProvider, (modelId: string) => ReturnType<typeof groq>> = {
	groq,
	nim,
	'custom-oc': oc,
	mimo,
	cerebras,
	opencode
};

const languageModels = Object.fromEntries(
	chatModels.map((chatModel) => {
		const providerModel = providers[chatModel.provider](chatModel.modelId);
		const model = chatModel.reasoning
			? wrapLanguageModel({
					model: providerModel,
					middleware: extractReasoningMiddleware({ tagName: 'think' })
				})
			: providerModel;

		return [chatModel.id, model];
	})
);

const defaultTitleModel =
	chatModels.find((model) => model.id === DEFAULT_CHAT_MODEL) ?? chatModels[0];

export const myProvider = customProvider({
	languageModels: {
		...languageModels,
		'title-model': providers[defaultTitleModel.provider](defaultTitleModel.modelId),
		'artifact-model': providers['custom-oc']('gpt-oss:120b')
	},
	imageModels: {
		'small-model': xai.image('grok-2-image')
	}
});

export function resolveLanguageModel(selectedChatModel: string) {
	if (selectedChatModel.startsWith('opencode:')) {
		return opencode(selectedChatModel.slice('opencode:'.length));
	}

	return myProvider.languageModel(selectedChatModel);
}
