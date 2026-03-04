import { writeFile } from 'node:fs/promises';

const ACCOUNT = '777c4da72d65e3f7672fcdcac50f0eec';
const GATEWAY = 'yuuki-ai';
const BASE = `https://gateway.ai.cloudflare.com/v1/${ACCOUNT}/${GATEWAY}/custom-nv/v1`;

type ChatRun = {
	status: number;
	text: string;
	reasoning?: string;
	bodyPreview: string;
};

async function runChatCompletion({
	token,
	model,
	body
}: {
	token: string;
	model: string;
	body: Record<string, unknown>;
}): Promise<ChatRun> {
	const res = await fetch(`${BASE}/chat/completions`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			model,
			stream: false,
			...body
		})
	});

	const json = await res.json();
	const message = json?.choices?.[0]?.message;

	return {
		status: res.status,
		text:
			typeof message?.content === 'string' ? message.content : JSON.stringify(json).slice(0, 500),
		reasoning:
			typeof message?.reasoning_content === 'string'
				? message.reasoning_content
				: typeof message?.reasoning === 'string'
					? message.reasoning
					: undefined,
		bodyPreview: JSON.stringify({ model, stream: false, ...body }, null, 2)
	};
}

async function main() {
	const token = process.env.CF_AIG_TOKEN;

	if (!token) {
		throw new Error('Missing CF_AIG_TOKEN');
	}

	const modelsRes = await fetch(`${BASE}/models`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	const modelsJson = await modelsRes.json();
	const modelIds = Array.isArray(modelsJson?.data)
		? modelsJson.data.map((entry: { id: string }) => entry.id)
		: [];

	const selectedModel = modelIds.includes('moonshotai/kimi-k2.5')
		? 'moonshotai/kimi-k2.5'
		: modelIds[0];

	const basicRun = await runChatCompletion({
		token,
		model: selectedModel,
		body: {
			messages: [{ role: 'user', content: 'Reply with only: OK' }]
		}
	});

	const reasoningRun = await runChatCompletion({
		token,
		model: selectedModel,
		body: {
			messages: [{ role: 'user', content: 'Think briefly and then reply with only: OK' }],
			reasoning_effort: 'low',
			provider_options: {
				custom_nv: {
					reasoning: true
				}
			}
		}
	});

	const report = [
		'# custom-nv test',
		'',
		`- generated_at_utc: ${new Date().toISOString()}`,
		`- base_url: ${BASE}`,
		`- models_status: ${modelsRes.status}`,
		`- models_count: ${modelIds.length}`,
		`- selected_model: ${selectedModel ?? 'none'}`,
		`- basic_chat_status: ${basicRun.status}`,
		`- reasoning_chat_status: ${reasoningRun.status}`,
		'',
		'## basic request body',
		'',
		'```json',
		basicRun.bodyPreview,
		'```',
		'',
		'## basic response',
		'',
		'```text',
		basicRun.text,
		'```',
		'',
		'## reasoning + provider_options request body',
		'',
		'```json',
		reasoningRun.bodyPreview,
		'```',
		'',
		'## reasoning + provider_options response',
		'',
		'```text',
		reasoningRun.text,
		'```',
		'',
		'## reasoning trace (if returned)',
		'',
		'```text',
		reasoningRun.reasoning ?? '(none returned)',
		'```',
		'',
		'## sample models',
		'',
		...modelIds.slice(0, 20).map((id: string) => `- ${id}`)
	].join('\n');

	await writeFile(new URL('./test.md', import.meta.url), report, 'utf8');
	console.log('Wrote conf/models/test.md');
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
