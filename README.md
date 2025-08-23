# TurboTags v2.0 - React Edition

<div align="center">

⚡ **Smarter Tags. Better Reach. Faster Growth.** ⚡

</div>

This project is a complete rewrite of the original TurboTags website, upgraded to a modern, high-performance React Single-Page Application using Vite and Tailwind CSS.

## Core Technology

- **Framework**: React 18 with Hooks
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: Served via a custom Vite plugin emulating Vercel serverless functions for development.
- **Analytics**: Firebase (Google Analytics)

## Key Features

This version enhances all original features with a superior architecture:

- **Advanced AI Generation**: Utilizes a cascading system of models via OpenRouter (Mistral, Llama 3, Gemini, Claude) for intelligent, context-aware tag and hashtag suggestions, with a robust JSON fallback.
- **Multi-Platform Support**: Optimized generation for YouTube, Instagram, TikTok, and Facebook.
- **Blazing-Fast SPA**: Near-instant navigation with lazy-loaded components for optimal performance.
- **PWA Ready**: Includes a fully configured web manifest for a native app-like installation experience.
- **Responsive & Accessible**: Mobile-first design with support for `prefers-reduced-motion`.
- **SEO Optimized**: Retains all original SEO meta tags, JSON-LD schema, and adds server-side redirects for old URLs.
- **Privacy-Focused**: No user accounts or logging of user prompts.

## Development Setup

### Prerequisites

- Node.js (v18 or newer recommended)
- Yarn (or npm/pnpm)

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/turbotags.git
    cd turbotags
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your OpenRouter API key:
    ```
    OPENROUTER_API_KEY="your_openrouter_api_key_here"
    ```

4.  **Start the development server:**
    ```bash
    yarn dev
    ```
    The application will be available at `http://localhost:5173`.

## Build for Production

To create a production-ready build:

```bash
yarn build
```

This will generate a `dist` folder with optimized static assets, ready for deployment.

## Deployment

This Vite project is optimized for deployment on platforms like Vercel or Netlify. When deploying to Vercel, the `api/generate.js` file will be automatically detected as a serverless function. No extra configuration is needed.
