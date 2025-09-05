# TurboTags - Free AI Tag & Hashtag Generator

![TurboTags Hero](https://turbotags.app/screenshots/desktop.png)

**TurboTags** is a free, AI-powered tool designed for content creators to generate SEO-optimized tags, trending hashtags, and click-worthy titles for YouTube, Instagram, TikTok, and Facebook.

**Live Site: [turbotags.app](https://turbotags.app)**

---

## ✨ Key Features

- **Multi-Platform Support**: Optimized suggestions for YouTube, Instagram, TikTok, and Facebook.
- **AI Title Generation**: Creates 5 engaging, SEO-friendly titles for your content.
- **Global Reach**: Supports over 30 regions and 20 languages for hyper-targeted content.
- **Trend Analysis**: Every suggestion includes a "Trend Percentage" to prioritize viral keywords.
- **Content-Format Aware**: Tailors suggestions for Reels, Shorts, Stories, or long-form videos.
- **Privacy First**: No sign-up required. Your prompts are not stored.
- **100% Free**: All core features are available at no cost.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Vercel Serverless Functions (Node.js)
- **AI Provider**: [OpenRouter.ai](https://openrouter.ai/)
- **Hosting**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Yarn](https://yarnpkg.com/) (Classic or Berry)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/turbotags-react.git
    cd turbotags-react
    ```

2.  **Install dependencies:**
    ```sh
    yarn install
    ```

3.  **Set up environment variables:**
    -   Create a new file named `.env` in the root of the project.
    -   Copy the contents from `.env.example`.
    -   Add your OpenRouter API key:
        ```env
        OPENROUTER_API_KEY="YOUR_API_KEY"
        ```
    -   You can get a free API key from [OpenRouter.ai](https://openrouter.ai/keys).

4.  **Run the development server:**
    ```sh
    yarn dev
    ```
    The application will be available at `http://localhost:5000`. The Vite server includes a proxy that forwards requests from `/api/*` to the serverless functions in the `api/` directory, emulating the Vercel environment.

---

## 部署 (Deployment)

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the project into Vercel. Vercel will automatically detect that it's a Vite project.
3.  Add your `OPENROUTER_API_KEY` as an environment variable in the Vercel project settings.
4.  Deploy! Vercel will handle the rest, building the frontend and deploying the serverless functions.

The `vercel.json` file in this repository is pre-configured for optimal performance and routing.
