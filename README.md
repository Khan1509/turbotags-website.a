# TurboTags v2.0 - React Edition

<div align="center">

⚡ Smarter Tags. Better Reach. Faster Growth. ⚡

</div>

This project is a complete rewrite of the original TurboTags website, upgraded to a modern React Single-Page Application using Vite.

## Core Technology

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: Served via a custom Vite plugin during development, compatible with Vercel serverless functions for production.

## Features

This version retains all the features of the original, including:

- **AI-Powered Generation**: Uses OpenRouter for intelligent tag and hashtag suggestions.
- **Multi-Platform Support**: Optimized for YouTube, Instagram, TikTok, and Facebook.
- **Dynamic UI**: Fully interactive interface built with React components.
- **PWA Ready**: Includes a web manifest for app-like installation.
- **Responsive Design**: Mobile-first approach for all devices.
- **SEO Optimized**: Retains all original SEO meta tags and JSON-LD schema.

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

This Vite project is optimized for deployment on platforms like Vercel or Netlify.

When deploying to Vercel, the `api/generate.js` file will be automatically detected as a serverless function. No extra configuration is needed.
