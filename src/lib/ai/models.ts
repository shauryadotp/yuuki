export type ChatModelProvider = 'groq' | 'nim' | 'custom-oc' | 'mimo' | 'cerebras';

export interface ChatModel {
	id: string;
	name: string;
	description: string;
	provider: ChatModelProvider;
	modelId: string;
	reasoning?: boolean;
}

export const chatModels: ChatModel[] = [
	{
		id: 'mimo-flash',
		name: 'MiMo Flash',
		description: 'Xiaomi MiMo fast model',
		provider: 'mimo',
		modelId: 'mimo-v2-flash'
	},
	{
		id: 'groq-llama-3.3-70b',
		name: 'Llama 3.3 70B',
		description: 'Groq versatile model',
		provider: 'groq',
		modelId: 'llama-3.3-70b-versatile'
	},
	{
		id: 'groq-llama-4-maverick',
		name: 'Llama 4 Maverick',
		description: 'Groq large multimodal-capable model',
		provider: 'groq',
		modelId: 'meta-llama/llama-4-maverick-17b-128e-instruct'
	},
	{
		id: 'nim-deepseek-v3.1-terminus',
		name: 'DeepSeek V3.1 Terminus',
		description: 'NIM route for DeepSeek V3.1 Terminus',
		provider: 'nim',
		modelId: 'deepseek-ai/deepseek-v3.1-terminus'
	},
	{
		id: 'nim-deepseek-v3.2',
		name: 'DeepSeek V3.2',
		description: 'NIM route for DeepSeek V3.2',
		provider: 'nim',
		modelId: 'deepseek-ai/deepseek-v3.2'
	},
	{
		id: 'nim-minimax-m2.5',
		name: 'MiniMax M2.5',
		description: 'NIM route for MiniMax M2.5',
		provider: 'nim',
		modelId: 'minimaxai/minimax-m2.5'
	},
	{
		id: 'nim-kimi-k2.5',
		name: 'Kimi K2.5',
		description: 'NIM route for Kimi K2.5',
		provider: 'nim',
		modelId: 'moonshotai/kimi-k2.5'
	},
	{
		id: 'nim-nemotron-ultra-253b',
		name: 'Nemotron Ultra 253B',
		description: 'NIM route for Nemotron Ultra',
		provider: 'nim',
		modelId: 'nvidia/llama-3.1-nemotron-ultra-253b-v1'
	},
	{
		id: 'nim-nemotron-super-49b',
		name: 'Nemotron Super 49B',
		description: 'NIM route for Nemotron Super',
		provider: 'nim',
		modelId: 'nvidia/llama-3.3-nemotron-super-49b-v1.5'
	},
	{
		id: 'nim-qwen3-235b',
		name: 'Qwen3 235B',
		description: 'NIM route for Qwen3 235B',
		provider: 'nim',
		modelId: 'qwen/qwen3-235b-a22b'
	},
	{
		id: 'nim-qwen3-next-80b',
		name: 'Qwen3 Next 80B Instruct',
		description: 'NIM route for Qwen3 Next Instruct',
		provider: 'nim',
		modelId: 'qwen/qwen3-next-80b-a3b-instruct'
	},
	{
		id: 'nim-qwen3-next-80b-thinking',
		name: 'Qwen3 Next 80B Thinking',
		description: 'NIM route for Qwen3 Next Thinking',
		provider: 'nim',
		modelId: 'qwen/qwen3-next-80b-a3b-thinking',
		reasoning: true
	},
	{
		id: 'nim-qwen3.5-397b',
		name: 'Qwen3.5 397B',
		description: 'NIM route for Qwen3.5',
		provider: 'nim',
		modelId: 'qwen/qwen3.5-397b-a17b'
	},
	{
		id: 'nim-palmyra-creative-122b',
		name: 'Palmyra Creative 122B',
		description: 'NIM route for Writer Palmyra Creative',
		provider: 'nim',
		modelId: 'writer/palmyra-creative-122b'
	},
	{
		id: 'nim-glm4.7',
		name: 'GLM 4.7',
		description: 'NIM route for GLM 4.7',
		provider: 'nim',
		modelId: 'z-ai/glm4.7'
	},
	{
		id: 'nim-glm5',
		name: 'GLM 5',
		description: 'NIM route for GLM 5',
		provider: 'nim',
		modelId: 'z-ai/glm5'
	},
	{
		id: 'oc-deepseek-v3.1-671b',
		name: 'DeepSeek V3.1 671B',
		description: 'Ollama Cloud route for DeepSeek V3.1',
		provider: 'custom-oc',
		modelId: 'deepseek-v3.1:671b'
	},
	{
		id: 'oc-deepseek-v3.2',
		name: 'DeepSeek V3.2 (OC)',
		description: 'Ollama Cloud route for DeepSeek V3.2',
		provider: 'custom-oc',
		modelId: 'deepseek-v3.2'
	},
	{
		id: 'oc-glm-4.7',
		name: 'GLM 4.7 (OC)',
		description: 'Ollama Cloud route for GLM 4.7',
		provider: 'custom-oc',
		modelId: 'glm-4.7'
	},
	{
		id: 'oc-glm-5',
		name: 'GLM 5 (OC)',
		description: 'Ollama Cloud route for GLM 5',
		provider: 'custom-oc',
		modelId: 'glm-5'
	},
	{
		id: 'oc-kimi-k2-thinking',
		name: 'Kimi K2 Thinking',
		description: 'Ollama Cloud route for Kimi thinking mode',
		provider: 'custom-oc',
		modelId: 'kimi-k2-thinking',
		reasoning: true
	},
	{
		id: 'oc-kimi-k2.5',
		name: 'Kimi K2.5 (OC)',
		description: 'Ollama Cloud route for Kimi K2.5',
		provider: 'custom-oc',
		modelId: 'kimi-k2.5'
	},
	{
		id: 'oc-kimi-k2-1t',
		name: 'Kimi K2 1T',
		description: 'Ollama Cloud route for Kimi K2 1T',
		provider: 'custom-oc',
		modelId: 'kimi-k2:1t'
	},
	{
		id: 'oc-minimax-m2.5',
		name: 'MiniMax M2.5 (OC)',
		description: 'Ollama Cloud route for MiniMax M2.5',
		provider: 'custom-oc',
		modelId: 'minimax-m2.5'
	},
	{
		id: 'oc-qwen3-vl-235b-instruct',
		name: 'Qwen3 VL 235B Instruct',
		description: 'Ollama Cloud route for Qwen3 VL Instruct',
		provider: 'custom-oc',
		modelId: 'qwen3-vl:235b-instruct'
	},
	{
		id: 'oc-qwen3.5-397b',
		name: 'Qwen3.5 397B (OC)',
		description: 'Ollama Cloud route for Qwen3.5 397B',
		provider: 'custom-oc',
		modelId: 'qwen3.5:397b'
	},
	{
		id: 'cerebras-gpt-oss-120b',
		name: 'GPT OSS 120B',
		description: 'Cerebras route for GPT OSS 120B',
		provider: 'cerebras',
		modelId: 'gpt-oss-120b',
		reasoning: true
	},
	{
		id: 'cerebras-alphasense-gpt-oss-120b',
		name: 'AlphaSense GPT OSS 120B',
		description: 'Cerebras route for AlphaSense GPT OSS 120B',
		provider: 'cerebras',
		modelId: 'alphasense-gpt-oss-120b'
	}
];

export const DEFAULT_CHAT_MODEL = 'mimo-flash';
