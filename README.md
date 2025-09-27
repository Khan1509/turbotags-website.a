# TurboTags - AI Hashtag & Tag Generator

![TurboTags Logo](public/turbotags_header_logo_500x160_thick.svg)

A modern React/Vite web application for generating hashtags and tags for various social media platforms including YouTube, Instagram, TikTok, and Facebook.

## 🚀 Features

- **Multi-Platform Support**: Generate optimized hashtags for YouTube, Instagram, TikTok, and Facebook
- **AI-Powered Generation**: Advanced AI models with 4-tier fallback system for reliable results
- **Multilingual Support**: Generate hashtags in multiple languages and regions (30+ regions supported)
- **SEO-Optimized Titles**: Create engaging, viral titles for your content
- **Trending Topics**: Stay updated with current trending hashtags
- **Performance Optimized**: A/A+ performance scores with optimized bundle size
- **Mobile-First Design**: Fully responsive with beautiful animations
- **Analytics Integration**: Firebase Analytics and Vercel Analytics

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Analytics**: Firebase, Vercel Analytics
- **AI Integration**: OpenRouter API with fallback models
- **Deployment**: Vercel-ready with autoscale configuration

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layouts/        # Layout components
│   ├── sections/       # Page sections
│   ├── selectors/      # Form selectors
│   ├── ui/            # UI primitives
│   └── utils/         # Utility components
├── pages/             # Page components
│   ├── legal/         # Legal pages
│   └── tools/         # Tool pages
├── services/          # API services
├── utils/             # Utility functions
├── data/              # Static data and blog posts
└── hooks/             # Custom React hooks
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd turbotags-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   # Create .env file for API keys (optional - app works with fallback data)
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run sitemap` - Generate sitemap

## 🌐 API Integration

TurboTags uses a sophisticated AI generation system:

- **Primary Models**: gemini-2.0-flash-001, gemma-2-27b-it, claude-3-haiku
- **Fallback System**: 4-tier fallback ensures users always get results
- **Dynamic Tokens**: Optimized token allocation (400 for titles, 800 for tags)
- **Multilingual**: Lenient validation for global content generation

The app works perfectly without API keys using comprehensive fallback data.

## 🎨 Design System

- **Primary Colors**: Slate gray gradient (`#475569` to `#334155`)
- **Typography**: Inter font family with optimized loading
- **Animations**: Performance-optimized with reduced motion support
- **Icons**: Consistent Lucide React icon set

## 🔧 Configuration

### Vite Configuration

The app is optimized for the Replit environment:

- **Host**: `0.0.0.0:5000` for proper proxy support
- **Hot Reload**: WebSocket configuration for development
- **Build Optimization**: Code splitting, tree shaking, esbuild minification

### Bundle Optimization

- **Code Splitting**: Vendor chunks for better caching
- **Tree Shaking**: Aggressive optimization for smaller bundles
- **Asset Optimization**: Optimized images and font loading

## 📱 PWA Support

TurboTags includes Progressive Web App features:

- **Manifest**: Complete web app manifest
- **Icons**: Multiple icon sizes for various devices
- **Offline Ready**: Service worker support
- **Installable**: Can be installed on mobile devices

## 🚀 Deployment

### Vercel (Recommended)

The app is optimized for Vercel deployment:

```bash
npm run build
```

### Manual Deployment

1. Build the project: `npm run build`
2. Serve the `dist` folder with any static file server
3. Ensure SPA routing is properly configured

## 📊 Performance

- **Lighthouse Scores**: A/A+ ratings (90-100/100)
- **Bundle Size**: Main bundle ~17KB gzipped
- **Core Web Vitals**: Optimized FCP, LCP, CLS metrics
- **Loading Strategy**: Critical path optimization with lazy loading

## 🔐 Privacy & Security

- **GDPR Compliant**: Cookie consent and privacy controls
- **CSP Headers**: Content Security Policy implementation
- **Analytics**: Privacy-focused analytics integration
- **API Security**: Secure API key management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, email support@turbotags.app or visit our [Ko-fi page](https://ko-fi.com/turbotags1509).

## 🙏 Acknowledgments

- OpenRouter for AI model access
- Vercel for hosting and analytics
- React community for excellent tooling
- Contributors and users for feedback

---

Made with ❤️ by the TurboTags team