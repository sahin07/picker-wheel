# Ollama Setup (Open-Source AI)

Use free, local open-source models instead of Gemini.

## 1. Install Ollama

Download from [https://ollama.com](https://ollama.com) and install for Windows.

## 2. Pull a model

```bash
ollama pull llama3.2
```

Other good options:

```bash
ollama pull mistral
ollama pull phi3
ollama pull qwen2.5
```

## 3. Configure `.env.local`

```bash
AI_PROVIDER=ollama
AI_API_URL=http://localhost:11434/v1/chat/completions
AI_MODEL=llama3.2
```

## 4. Restart the dev server

```bash
npm run dev
```

## 5. Test

Visit `http://localhost:3000/api/ai` — you should see `"provider": "ollama"`.

Then use **AI-Powered** on the home page to generate wheel options.

## Switch back to Gemini

```bash
AI_PROVIDER=gemini
AI_API_KEY=your_google_ai_api_key
AI_MODEL=gemini-2.0-flash
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Connection refused | Start Ollama app or run `ollama serve` |
| Model not found | Run `ollama pull llama3.2` |
| Slow responses | Use a smaller model like `phi3` |
| Still using Gemini | Remove old `NEXT_PUBLIC_AI_*` vars from `.env.local` |
