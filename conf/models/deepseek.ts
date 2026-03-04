export interface ModelCard {
	name: string;
	id: string;
	description: string;
	base_modelId: string;
	provider_modelId: string;
	provider: 'custom-nv';
	prompt: string[];
	latency: 'balanced';
	reasoning?: boolean;
	file_comprehension?: boolean;
	tools?: boolean;
	vision?: boolean;
	ctx?: number;
}

export const modelCards: ModelCard[] = [
	{
		name: 'DeepSeek v3.1 Chat',
		id: 'deepseek-v3.1-terminus-chat',
		description: 'WIP',
		base_modelId: 'deepseek-v3.1-terminus-chat',
		provider_modelId: 'deepseek-ai/deepseek-v3.1-terminus',
		provider: 'custom-nv',
		prompt: [],
		latency: 'balanced',
		reasoning: false,
		file_comprehension: true,
		tools: true,
		vision: false,
		ctx: 128000
	},
	{
		name: 'Yuuki Fast',
		id: 'yuuki-ai-reasoning',
		description: 'Yuuki but bigbrain',
		base_modelId: 'deepseek-v3.1-terminus-reasoning',
		provider_modelId: 'deepseek-ai/deepseek-v3.1-terminus',
		provider: 'custom-nv',
		prompt: ['@/conf/prompts/yuuki.md'],
		latency: 'balanced',
		reasoning: true,
		file_comprehension: true,
		tools: true,
		vision: false,
		ctx: 128000
	}
];

export default modelCards;
