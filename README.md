# HealthSync

A health and wellness tracking dashboard with AI-powered insights and personalized recommendations.

## Setup Instructions

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your API keys to `.env.local`

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Required environment variables:

- `VITE_OPENAI_API_KEY`: Your OpenAI API key
- `VITE_EIGHTSLEEP_PARTNER_ID`: Your Eight Sleep referral code

## Security Notes

- Never commit `.env.local` to version control
- Keep your API keys secure and private
- Rotate API keys if they're ever exposed
- Monitor API usage to prevent unexpected charges