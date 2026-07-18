# 🚀 Google AI Gemini Setup for MLB Wheel

## Overview
This guide will help you set up Google AI Gemini API for the MLB Picker Wheel application to enable real AI-powered features.

## 🔧 Quick Setup

### 1. Get Your Google AI API Key

1. **Visit Google AI Studio**: Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. **Sign In**: Use your Google account to sign in
3. **Create API Key**: Click "Create API Key" to generate your key
4. **Copy the Key**: Save your API key securely

### 2. Configure Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Google AI Gemini Configuration
NEXT_PUBLIC_AI_API_KEY=your_google_ai_api_key_here
NEXT_PUBLIC_AI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
NEXT_PUBLIC_AI_MODEL=gemini-1.5-flash

# AI Service Settings
NEXT_PUBLIC_AI_MAX_TOKENS=500
NEXT_PUBLIC_AI_TEMPERATURE=0.7
```

### 3. Restart Your Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 🎯 Features Enabled

With Gemini AI, you'll get:

### **AI Creative Hub** ✨
- **Story Mode**: AI-generated team stories
- **Poetry**: Baseball-themed poems
- **Rap Battle**: Team anthems
- **Comedy**: Baseball jokes and humor

### **AI Prediction Engine** 🔮
- **Game Predictions**: Analyze matchups and scenarios
- **Team Analysis**: Historical data and statistics
- **Performance Insights**: Detailed baseball analytics

### **AI Advanced Analysis** 📊
- **Fantasy Draft**: Team value and draft advice
- **Historical Analysis**: Era classification and cultural impact
- **Team Chemistry**: Locker room dynamics
- **Weather Impact**: Environmental factors
- **Fan Perspective**: Community insights

## 💰 Cost Information

- **Free Tier**: Available with generous limits
- **Pay-per-use**: After free tier (very affordable)
- **No Credit Card Required**: For free tier usage

## 🛡️ Security Notes

- API keys are stored in environment variables
- Never commit API keys to version control
- Keys are only used server-side for security

## 🐛 Troubleshooting

### Common Issues:

1. **"API Key Not Working"**
   - Verify the key format
   - Check if you've enabled the Gemini API
   - Ensure you're using the correct endpoint

2. **"Rate Limiting"**
   - Free tier has rate limits
   - Upgrade to paid tier for higher limits
   - App includes fallback responses

3. **"Network Errors"**
   - Check your internet connection
   - Verify the API endpoint is accessible
   - Check browser console for errors

### Debug Mode:

Enable debug logging by checking the browser console for:
- API request/response logs
- Error messages
- Fallback response triggers

## 🎉 Benefits

### For Users:
- **Real AI Responses**: Dynamic, contextual content
- **Baseball Expertise**: Deep knowledge of MLB
- **Creative Content**: Unique stories, poems, and analysis
- **Smart Predictions**: Data-driven insights

### For Developers:
- **Scalable**: Easy to switch AI providers
- **Maintainable**: Clean, modular code
- **Extensible**: Easy to add new features
- **Reliable**: Fallback system ensures uptime

## 🔮 Future Enhancements

### Planned Features:
- **Voice Integration**: Voice-to-text for queries
- **Image Recognition**: Analyze team logos and stadiums
- **Personalization**: Learn user preferences over time
- **Multi-language**: Support for different languages

### Advanced AI Features:
- **Predictive Analysis**: Predict future team performance
- **Market Analysis**: Track team popularity trends
- **Trading Recommendations**: Suggest team trades
- **Collection Optimization**: Optimize team selections

---

**Ready to experience real AI-powered MLB analysis? Follow the setup instructions above and enjoy the enhanced features!** 🚀⚾
