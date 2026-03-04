# custom-nv test

- generated_at_utc: 2026-03-04T04:33:31.589Z
- base_url: https://gateway.ai.cloudflare.com/v1/777c4da72d65e3f7672fcdcac50f0eec/yuuki-ai/custom-nv/v1
- models_status: 200
- models_count: 185
- selected_model: deepseek-ai/deepseek-v3.1-terminus
- basic_chat_status: 200
- reasoning_chat_status: 200

## basic request body

```json
{
  "model": "deepseek-ai/deepseek-v3.1-terminus",
  "stream": false,
  "messages": [
    {
      "role": "user",
      "content": "Reply with only: OK"
    }
  ]
}
```

## basic response

```text
OK
```

## reasoning + provider_options request body

```json
{
  "model": "deepseek-ai/deepseek-v3.1-terminus",
  "stream": false,
  "messages": [
    {
      "role": "user",
      "content": "Think briefly and then reply with only: OK"
    }
  ],
  "reasoning_effort": "low",
  "provider_options": {
    "custom_nv": {
      "reasoning": true
    }
  }
}
```

## reasoning + provider_options response

```text
OK
```

## reasoning trace (if returned)

```text
(none returned)
```

## sample models

- 01-ai/yi-large
- abacusai/dracarys-llama-3.1-70b-instruct
- adept/fuyu-8b
- ai21labs/jamba-1.5-large-instruct
- ai21labs/jamba-1.5-mini-instruct
- aisingapore/sea-lion-7b-instruct
- baai/bge-m3
- baichuan-inc/baichuan2-13b-chat
- bigcode/starcoder2-15b
- bigcode/starcoder2-7b
- bytedance/seed-oss-36b-instruct
- databricks/dbrx-instruct
- deepseek-ai/deepseek-coder-6.7b-instruct
- deepseek-ai/deepseek-r1-distill-llama-8b
- deepseek-ai/deepseek-r1-distill-qwen-14b
- deepseek-ai/deepseek-r1-distill-qwen-32b
- deepseek-ai/deepseek-r1-distill-qwen-7b
- deepseek-ai/deepseek-v3.1
- deepseek-ai/deepseek-v3.1-terminus
- deepseek-ai/deepseek-v3.2