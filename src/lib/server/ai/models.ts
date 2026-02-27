import { createXai } from '@ai-sdk/xai';
import { createGroq } from '@ai-sdk/groq';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { env } from '$env/dynamic/private';

const xai = createXai({ apiKey: env.XAI_API_KEY! });
const groq = createGroq({ apiKey: env.GROQ_API_KEY! });

export const myProvider = customProvider({
	languageModels: {
		'chat-model': xai('grok-2-1212'),
		'chat-model-reasoning': wrapLanguageModel({
			model: groq('deepseek-r1-distill-llama-70b'),
			middleware: extractReasoningMiddleware({ tagName: 'think' })
		}),
		'title-model': xai('grok-2-1212'),
		'artifact-model': xai('grok-2-1212')
	},
	imageModels: {
		'small-model': xai.image('grok-2-image')
	}
});
