# OpenRouter Setup (Free Open Models)

Use OpenRouter for production (Vercel) AI features.

## 1. Create an API key

1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign in and create a key
3. Copy the key

## 2. Configure `.env.local`

```bash
AI_PROVIDER=openrouter
AI_API_URL=https://openrouter.ai/api/v1/chat/completions
AI_API_KEY=sk-or-v1-your_key_here
AI_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
AI_MAX_TOKENS=500
AI_TEMPERATURE=0.7
```

**Recommended free model (best overall):** `nvidia/nemotron-3-ultra-550b-a55b:free`  
([Nemotron 3 Ultra free](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free))

Other free options:
- Auto-route: `openrouter/free`
- Fast/coding: check Laguna XS / gpt-oss on [free models](https://openrouter.ai/models?q=free)

Do **not** use `openai/gpt-4o` — that is paid.

## 3. Vercel env vars

In Vercel → Project → Settings → Environment Variables, add the same keys for **Production**.

## 4. Restart / redeploy

```bash
npm run dev
```

Or redeploy on Vercel after saving env vars.

## 5. Test

Open `http://localhost:3000/api/ai` — you should see `"provider": "openrouter"`.
