// vite.config.js
import { defineConfig } from "file:///app/code/node_modules/vite/dist/node/index.js";
import react from "file:///app/code/node_modules/@vitejs/plugin-react/dist/index.js";
import dotenv from "file:///app/code/node_modules/dotenv/lib/main.js";

// api/generate.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
var __vite_injected_original_import_meta_url = "file:///app/code/api/generate.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed",
      message: "Only POST requests are supported"
    });
  }
  try {
    const { prompt, platform = "youtube", language = "english", region = "global" } = req.body;
    if (!prompt) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing prompt in request body"
      });
    }
    console.log(`API Request - Platform: ${platform}, Language: ${language}, Region: ${region}`);
    const modelsToTry = [
      "mistralai/mistral-7b-instruct",
      "meta-llama/llama-3-8b-instruct",
      "google/gemini-flash-1.5",
      "anthropic/claude-3-haiku"
    ];
    let generatedText = null;
    let lastError = null;
    for (const model of modelsToTry) {
      try {
        console.log(`Attempting to generate content with model: ${model}`);
        const enhancedPrompt = `${prompt}

STRICT REQUIREMENTS:
- Generate EXACTLY 15-20 items per category (minimum 15, maximum 20)
- For YouTube: Provide both TAGS (plain text) and HASHTAGS (with # symbol)
- For other platforms: Provide only HASHTAGS (with # symbol)
- Use the specified language: ${language}
- Target region: ${region}
- Platform: ${platform}
- Content format: ${options.contentFormat || "general"}

FORMAT REQUIREMENTS:
- YouTube: TAGS:[tag1,tag2,tag3]HASHTAGS:[#hashtag1,#hashtag2,#hashtag3]
- Other platforms: #hashtag1,#hashtag2,#hashtag3
- NO extra text, explanations, or formatting
- Count must be between 15-20 items per category`;
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: [{
              role: "user",
              content: enhancedPrompt
            }],
            temperature: 0.7,
            max_tokens: 1e3
          })
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`API error with ${model}: ${response.status} ${response.statusText} - ${errorData}`);
        }
        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
          generatedText = data.choices[0].message.content;
          console.log(`Successfully generated content with model: ${model}`);
          break;
        } else {
          throw new Error(`API response from ${model} missing content or unexpected structure.`);
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error.message);
        lastError = error;
      }
    }
    if (generatedText) {
      return res.status(200).json({
        text: generatedText
      });
    } else {
      console.warn("All OpenRouter models failed. Falling back to local fallback.json.");
      const fallbackPath = path.join(__dirname, "fallback.json");
      const fallbackContent = fs.readFileSync(fallbackPath, "utf-8");
      const fallbackData = JSON.parse(fallbackContent);
      let fallbackText = "";
      if (language !== "english" && fallbackData.multilingual && fallbackData.multilingual[language]) {
        const langData = fallbackData.multilingual[language];
        if (platform === "youtube") {
          const tags = langData.tags.slice(0, 15);
          const hashtags = langData.hashtags.slice(0, 15);
          fallbackText = `TAGS:[${tags.join(",")}]HASHTAGS:[${hashtags.join(",")}]`;
        } else {
          fallbackText = langData.hashtags.slice(0, 15).join(", ");
        }
      } else {
        const minItems = 15;
        const maxItems = 20;
        if (platform === "youtube") {
          const tags = fallbackData.youtube.plain_tags.slice(0, maxItems);
          const hashtags = fallbackData.youtube.hashtags.slice(0, maxItems);
          fallbackText = `TAGS:[${tags.join(",")}]HASHTAGS:[${hashtags.join(",")}]`;
        } else if (platform === "instagram") {
          fallbackText = fallbackData.instagram_hashtags.slice(0, maxItems).join(", ");
        } else if (platform === "tiktok") {
          fallbackText = fallbackData.tiktok_hashtags.slice(0, maxItems).join(", ");
        } else if (platform === "facebook") {
          fallbackText = fallbackData.facebook_hashtags.slice(0, maxItems).join(", ");
        } else {
          const tags = fallbackData.youtube.plain_tags.slice(0, maxItems);
          const hashtags = fallbackData.youtube.hashtags.slice(0, maxItems);
          fallbackText = `TAGS:[${tags.join(",")}]HASHTAGS:[${hashtags.join(",")}]`;
        }
      }
      return res.status(200).json({
        text: fallbackText,
        fallback: true,
        message: `Using ${language} fallback content due to API unavailability`
      });
    }
  } catch (error) {
    console.error("Final error in generate.js:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "An unexpected error occurred during content generation."
    });
  }
}

// vite.config.js
dotenv.config();
function vercelApiDevPlugin() {
  return {
    name: "vercel-api-dev-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/api/generate")) {
          return next();
        }
        console.log(`[API] ${req.method} ${req.url}`);
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            error: "Method Not Allowed",
            message: "Only POST requests are supported"
          }));
          return;
        }
        let body = "";
        req.setEncoding("utf8");
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            req.body = body ? JSON.parse(body) : {};
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
              return res;
            };
            await handler(req, res);
          } catch (parseError) {
            console.error("Request parsing error:", parseError);
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              error: "Bad Request",
              message: "Invalid JSON in request body"
            }));
          }
        });
        req.on("error", (error) => {
          console.error("Request stream error:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            error: "Internal Server Error",
            message: "Request processing failed"
          }));
        });
      });
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  build: {
    target: "es2015",
    minify: "esbuild",
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("react-router-dom")) {
              return "router";
            }
            if (id.includes("framer-motion")) {
              return "animations";
            }
            if (id.includes("lucide-react")) {
              return "icons";
            }
            if (id.includes("firebase")) {
              return "firebase";
            }
            return "vendor";
          }
          if (id.includes("/pages/")) {
            return "pages";
          }
          if (id.includes("/components/")) {
            return "components";
          }
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      },
      external: []
    },
    cssMinify: true,
    reportCompressedSize: false
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lucide-react"
    ],
    exclude: ["firebase"]
  },
  server: {
    cors: true,
    headers: {
      "Cache-Control": "max-age=31536000",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block"
    }
  },
  preview: {
    headers: {
      "Cache-Control": "max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY"
    }
  },
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAiYXBpL2dlbmVyYXRlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcblxuLy8gTG9hZCAuZW52IGZpbGVcbmRvdGVudi5jb25maWcoKTtcblxuLy8gSW1wb3J0IHRoZSBoYW5kbGVyIGZ1bmN0aW9uXG5pbXBvcnQgYXBpSGFuZGxlciBmcm9tICcuL2FwaS9nZW5lcmF0ZS5qcyc7XG5cbi8vIFNpbXBsZSBhbmQgcmVsaWFibGUgQVBJIG1pZGRsZXdhcmUgcGx1Z2luXG5mdW5jdGlvbiB2ZXJjZWxBcGlEZXZQbHVnaW4oKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZlcmNlbC1hcGktZGV2LXBsdWdpbicsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgLy8gT25seSBoYW5kbGUgL2FwaS9nZW5lcmF0ZSByZXF1ZXN0c1xuICAgICAgICBpZiAoIXJlcS51cmw/LnN0YXJ0c1dpdGgoJy9hcGkvZ2VuZXJhdGUnKSkge1xuICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgW0FQSV0gJHtyZXEubWV0aG9kfSAke3JlcS51cmx9YCk7XG5cbiAgICAgICAgLy8gSGFuZGxlIG9ubHkgUE9TVCByZXF1ZXN0c1xuICAgICAgICBpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSB7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDU7XG4gICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGVycm9yOiAnTWV0aG9kIE5vdCBBbGxvd2VkJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdPbmx5IFBPU1QgcmVxdWVzdHMgYXJlIHN1cHBvcnRlZCdcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGFyc2UgcmVxdWVzdCBib2R5XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG4gICAgICAgIHJlcS5zZXRFbmNvZGluZygndXRmOCcpO1xuXG4gICAgICAgIHJlcS5vbignZGF0YScsIGNodW5rID0+IHtcbiAgICAgICAgICBib2R5ICs9IGNodW5rO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXEub24oJ2VuZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gUGFyc2UgSlNPTiBib2R5XG4gICAgICAgICAgICByZXEuYm9keSA9IGJvZHkgPyBKU09OLnBhcnNlKGJvZHkpIDoge307XG5cbiAgICAgICAgICAgIC8vIEFkZCBFeHByZXNzLWxpa2UgbWV0aG9kcyB0byByZXNwb25zZVxuICAgICAgICAgICAgcmVzLnN0YXR1cyA9IChjb2RlKSA9PiB7XG4gICAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gY29kZTtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlcy5qc29uID0gKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBBUEkgaGFuZGxlclxuICAgICAgICAgICAgYXdhaXQgYXBpSGFuZGxlcihyZXEsIHJlcyk7XG5cbiAgICAgICAgICB9IGNhdGNoIChwYXJzZUVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdSZXF1ZXN0IHBhcnNpbmcgZXJyb3I6JywgcGFyc2VFcnJvcik7XG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwMDtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgZXJyb3I6ICdCYWQgUmVxdWVzdCcsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdJbnZhbGlkIEpTT04gaW4gcmVxdWVzdCBib2R5J1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVxLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3Qgc3RyZWFtIGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgZXJyb3I6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1JlcXVlc3QgcHJvY2Vzc2luZyBmYWlsZWQnXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG59XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgdmVyY2VsQXBpRGV2UGx1Z2luKCldLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzMjAxNScsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA1MDAsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIC8vIENvcmUgUmVhY3QgY2h1bmtzXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdCcpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1kb20nKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3JlYWN0LXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0LXJvdXRlci1kb20nKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3JvdXRlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2ZyYW1lci1tb3Rpb24nKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2FuaW1hdGlvbnMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdsdWNpZGUtcmVhY3QnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2ljb25zJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZmlyZWJhc2UnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2ZpcmViYXNlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvcGFnZXMvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAncGFnZXMnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9jb21wb25lbnRzLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2NvbXBvbmVudHMnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJ1xuICAgICAgfSxcbiAgICAgIGV4dGVybmFsOiBbXVxuICAgIH0sXG4gICAgY3NzTWluaWZ5OiB0cnVlLFxuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncmVhY3QnLFxuICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAnZnJhbWVyLW1vdGlvbicsXG4gICAgICAnbHVjaWRlLXJlYWN0J1xuICAgIF0sXG4gICAgZXhjbHVkZTogWydmaXJlYmFzZSddXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGNvcnM6IHRydWUsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbWF4LWFnZT0zMTUzNjAwMCcsXG4gICAgICAnWC1Db250ZW50LVR5cGUtT3B0aW9ucyc6ICdub3NuaWZmJyxcbiAgICAgICdYLUZyYW1lLU9wdGlvbnMnOiAnREVOWScsXG4gICAgICAnWC1YU1MtUHJvdGVjdGlvbic6ICcxOyBtb2RlPWJsb2NrJ1xuICAgIH1cbiAgfSxcbiAgcHJldmlldzoge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDYWNoZS1Db250cm9sJzogJ21heC1hZ2U9MzE1MzYwMDAsIGltbXV0YWJsZScsXG4gICAgICAnWC1Db250ZW50LVR5cGUtT3B0aW9ucyc6ICdub3NuaWZmJyxcbiAgICAgICdYLUZyYW1lLU9wdGlvbnMnOiAnREVOWSdcbiAgICB9XG4gIH0sXG4gIGNzczoge1xuICAgIGRldlNvdXJjZW1hcDogZmFsc2UsXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgY3NzOiB7XG4gICAgICAgIGNoYXJzZXQ6IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2NvZGUvYXBpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvYXBpL2dlbmVyYXRlLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvY29kZS9hcGkvZ2VuZXJhdGUuanNcIjtpbXBvcnQgZnMgZnJvbSAnbm9kZTpmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcblxuLy8gSGVscGVyIHRvIGdldCBfX2Rpcm5hbWUgaW4gRVMgbW9kdWxlc1xuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICAvLyBJbW1lZGlhdGVseSBzZXQgSlNPTiBjb250ZW50LXR5cGVcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcblxuICAvLyBCbG9jayBub24tUE9TVCByZXF1ZXN0c1xuICBpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA1KS5qc29uKHtcbiAgICAgIGVycm9yOiAnTWV0aG9kIE5vdCBBbGxvd2VkJyxcbiAgICAgIG1lc3NhZ2U6ICdPbmx5IFBPU1QgcmVxdWVzdHMgYXJlIHN1cHBvcnRlZCdcbiAgICB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgeyBwcm9tcHQsIHBsYXRmb3JtID0gJ3lvdXR1YmUnLCBsYW5ndWFnZSA9ICdlbmdsaXNoJywgcmVnaW9uID0gJ2dsb2JhbCcgfSA9IHJlcS5ib2R5O1xuXG4gICAgaWYgKCFwcm9tcHQpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7XG4gICAgICAgIGVycm9yOiAnQmFkIFJlcXVlc3QnLFxuICAgICAgICBtZXNzYWdlOiAnTWlzc2luZyBwcm9tcHQgaW4gcmVxdWVzdCBib2R5J1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYEFQSSBSZXF1ZXN0IC0gUGxhdGZvcm06ICR7cGxhdGZvcm19LCBMYW5ndWFnZTogJHtsYW5ndWFnZX0sIFJlZ2lvbjogJHtyZWdpb259YCk7XG5cbiAgICAvLyBEZWZpbmUgdGhlIGxpc3Qgb2YgbW9kZWxzIHRvIHRyeSBpbiBvcmRlciBvZiBwcmVmZXJlbmNlXG4gICAgY29uc3QgbW9kZWxzVG9UcnkgPSBbXG4gICAgICBcIm1pc3RyYWxhaS9taXN0cmFsLTdiLWluc3RydWN0XCIsXG4gICAgICBcIm1ldGEtbGxhbWEvbGxhbWEtMy04Yi1pbnN0cnVjdFwiLFxuICAgICAgXCJnb29nbGUvZ2VtaW5pLWZsYXNoLTEuNVwiLFxuICAgICAgXCJhbnRocm9waWMvY2xhdWRlLTMtaGFpa3VcIlxuICAgIF07XG5cbiAgICBsZXQgZ2VuZXJhdGVkVGV4dCA9IG51bGw7XG4gICAgbGV0IGxhc3RFcnJvciA9IG51bGw7XG5cbiAgICBmb3IgKGNvbnN0IG1vZGVsIG9mIG1vZGVsc1RvVHJ5KSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyB0byBnZW5lcmF0ZSBjb250ZW50IHdpdGggbW9kZWw6ICR7bW9kZWx9YCk7XG5cbiAgICAgICAgLy8gRW5oYW5jZWQgcHJvbXB0IGZvciBiZXR0ZXIgdGFnIGdlbmVyYXRpb25cbiAgICAgICAgY29uc3QgZW5oYW5jZWRQcm9tcHQgPSBgJHtwcm9tcHR9XG5cblNUUklDVCBSRVFVSVJFTUVOVFM6XG4tIEdlbmVyYXRlIEVYQUNUTFkgMTUtMjAgaXRlbXMgcGVyIGNhdGVnb3J5IChtaW5pbXVtIDE1LCBtYXhpbXVtIDIwKVxuLSBGb3IgWW91VHViZTogUHJvdmlkZSBib3RoIFRBR1MgKHBsYWluIHRleHQpIGFuZCBIQVNIVEFHUyAod2l0aCAjIHN5bWJvbClcbi0gRm9yIG90aGVyIHBsYXRmb3JtczogUHJvdmlkZSBvbmx5IEhBU0hUQUdTICh3aXRoICMgc3ltYm9sKVxuLSBVc2UgdGhlIHNwZWNpZmllZCBsYW5ndWFnZTogJHtsYW5ndWFnZX1cbi0gVGFyZ2V0IHJlZ2lvbjogJHtyZWdpb259XG4tIFBsYXRmb3JtOiAke3BsYXRmb3JtfVxuLSBDb250ZW50IGZvcm1hdDogJHtvcHRpb25zLmNvbnRlbnRGb3JtYXQgfHwgJ2dlbmVyYWwnfVxuXG5GT1JNQVQgUkVRVUlSRU1FTlRTOlxuLSBZb3VUdWJlOiBUQUdTOlt0YWcxLHRhZzIsdGFnM11IQVNIVEFHUzpbI2hhc2h0YWcxLCNoYXNodGFnMiwjaGFzaHRhZzNdXG4tIE90aGVyIHBsYXRmb3JtczogI2hhc2h0YWcxLCNoYXNodGFnMiwjaGFzaHRhZzNcbi0gTk8gZXh0cmEgdGV4dCwgZXhwbGFuYXRpb25zLCBvciBmb3JtYXR0aW5nXG4tIENvdW50IG11c3QgYmUgYmV0d2VlbiAxNS0yMCBpdGVtcyBwZXIgY2F0ZWdvcnlgO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCJodHRwczovL29wZW5yb3V0ZXIuYWkvYXBpL3YxL2NoYXQvY29tcGxldGlvbnNcIiwge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke3Byb2Nlc3MuZW52Lk9QRU5ST1VURVJfQVBJX0tFWX1gLFxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgbW9kZWw6IG1vZGVsLFxuICAgICAgICAgICAgbWVzc2FnZXM6IFt7XG4gICAgICAgICAgICAgIHJvbGU6IFwidXNlclwiLFxuICAgICAgICAgICAgICBjb250ZW50OiBlbmhhbmNlZFByb21wdFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTogMC43LFxuICAgICAgICAgICAgbWF4X3Rva2VuczogMTAwMFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICBjb25zdCBlcnJvckRhdGEgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7IC8vIFVzZSAudGV4dCgpIGZvciBiZXR0ZXIgZXJyb3IgZGV0YWlsc1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQVBJIGVycm9yIHdpdGggJHttb2RlbH06ICR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9IC0gJHtlcnJvckRhdGF9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBpZiAoZGF0YS5jaG9pY2VzICYmIGRhdGEuY2hvaWNlcy5sZW5ndGggPiAwICYmIGRhdGEuY2hvaWNlc1swXS5tZXNzYWdlICYmIGRhdGEuY2hvaWNlc1swXS5tZXNzYWdlLmNvbnRlbnQpIHtcbiAgICAgICAgICBnZW5lcmF0ZWRUZXh0ID0gZGF0YS5jaG9pY2VzWzBdLm1lc3NhZ2UuY29udGVudDtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGdlbmVyYXRlZCBjb250ZW50IHdpdGggbW9kZWw6ICR7bW9kZWx9YCk7XG4gICAgICAgICAgYnJlYWs7IC8vIEV4aXQgbG9vcCBpZiBzdWNjZXNzZnVsXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBUEkgcmVzcG9uc2UgZnJvbSAke21vZGVsfSBtaXNzaW5nIGNvbnRlbnQgb3IgdW5leHBlY3RlZCBzdHJ1Y3R1cmUuYCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHdpdGggbW9kZWwgJHttb2RlbH06YCwgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIGxhc3RFcnJvciA9IGVycm9yOyAvLyBTdG9yZSB0aGUgbGFzdCBlcnJvclxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChnZW5lcmF0ZWRUZXh0KSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICB0ZXh0OiBnZW5lcmF0ZWRUZXh0XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgYWxsIG1vZGVscyBmYWlsLCBmYWxsIGJhY2sgdG8gdGhlIGxvY2FsIEpTT04gZmlsZVxuICAgICAgY29uc29sZS53YXJuKFwiQWxsIE9wZW5Sb3V0ZXIgbW9kZWxzIGZhaWxlZC4gRmFsbGluZyBiYWNrIHRvIGxvY2FsIGZhbGxiYWNrLmpzb24uXCIpO1xuICAgICAgY29uc3QgZmFsbGJhY2tQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZhbGxiYWNrLmpzb24nKTtcbiAgICAgIGNvbnN0IGZhbGxiYWNrQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmYWxsYmFja1BhdGgsICd1dGYtOCcpO1xuICAgICAgY29uc3QgZmFsbGJhY2tEYXRhID0gSlNPTi5wYXJzZShmYWxsYmFja0NvbnRlbnQpO1xuXG4gICAgICBsZXQgZmFsbGJhY2tUZXh0ID0gXCJcIjtcblxuICAgICAgLy8gSGFuZGxlIG11bHRpbGluZ3VhbCBmYWxsYmFjayBjb250ZW50XG4gICAgICBpZiAobGFuZ3VhZ2UgIT09ICdlbmdsaXNoJyAmJiBmYWxsYmFja0RhdGEubXVsdGlsaW5ndWFsICYmIGZhbGxiYWNrRGF0YS5tdWx0aWxpbmd1YWxbbGFuZ3VhZ2VdKSB7XG4gICAgICAgIGNvbnN0IGxhbmdEYXRhID0gZmFsbGJhY2tEYXRhLm11bHRpbGluZ3VhbFtsYW5ndWFnZV07XG4gICAgICAgIGlmIChwbGF0Zm9ybSA9PT0gJ3lvdXR1YmUnKSB7XG4gICAgICAgICAgY29uc3QgdGFncyA9IGxhbmdEYXRhLnRhZ3Muc2xpY2UoMCwgMTUpO1xuICAgICAgICAgIGNvbnN0IGhhc2h0YWdzID0gbGFuZ0RhdGEuaGFzaHRhZ3Muc2xpY2UoMCwgMTUpO1xuICAgICAgICAgIGZhbGxiYWNrVGV4dCA9IGBUQUdTOlske3RhZ3Muam9pbignLCcpfV1IQVNIVEFHUzpbJHtoYXNodGFncy5qb2luKCcsJyl9XWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmFsbGJhY2tUZXh0ID0gbGFuZ0RhdGEuaGFzaHRhZ3Muc2xpY2UoMCwgMTUpLmpvaW4oJywgJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEVuZ2xpc2ggZmFsbGJhY2sgLSBnZW5lcmF0ZSBleGFjdGx5IDE1LTIwIGl0ZW1zXG4gICAgICAgIGNvbnN0IG1pbkl0ZW1zID0gMTU7XG4gICAgICAgIGNvbnN0IG1heEl0ZW1zID0gMjA7XG5cbiAgICAgICAgaWYgKHBsYXRmb3JtID09PSAneW91dHViZScpIHtcbiAgICAgICAgICBjb25zdCB0YWdzID0gZmFsbGJhY2tEYXRhLnlvdXR1YmUucGxhaW5fdGFncy5zbGljZSgwLCBtYXhJdGVtcyk7XG4gICAgICAgICAgY29uc3QgaGFzaHRhZ3MgPSBmYWxsYmFja0RhdGEueW91dHViZS5oYXNodGFncy5zbGljZSgwLCBtYXhJdGVtcyk7XG4gICAgICAgICAgZmFsbGJhY2tUZXh0ID0gYFRBR1M6WyR7dGFncy5qb2luKCcsJyl9XUhBU0hUQUdTOlske2hhc2h0YWdzLmpvaW4oJywnKX1dYDtcbiAgICAgICAgfSBlbHNlIGlmIChwbGF0Zm9ybSA9PT0gJ2luc3RhZ3JhbScpIHtcbiAgICAgICAgICBmYWxsYmFja1RleHQgPSBmYWxsYmFja0RhdGEuaW5zdGFncmFtX2hhc2h0YWdzLnNsaWNlKDAsIG1heEl0ZW1zKS5qb2luKCcsICcpO1xuICAgICAgICB9IGVsc2UgaWYgKHBsYXRmb3JtID09PSAndGlrdG9rJykge1xuICAgICAgICAgIGZhbGxiYWNrVGV4dCA9IGZhbGxiYWNrRGF0YS50aWt0b2tfaGFzaHRhZ3Muc2xpY2UoMCwgbWF4SXRlbXMpLmpvaW4oJywgJyk7XG4gICAgICAgIH0gZWxzZSBpZiAocGxhdGZvcm0gPT09ICdmYWNlYm9vaycpIHtcbiAgICAgICAgICBmYWxsYmFja1RleHQgPSBmYWxsYmFja0RhdGEuZmFjZWJvb2tfaGFzaHRhZ3Muc2xpY2UoMCwgbWF4SXRlbXMpLmpvaW4oJywgJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRGVmYXVsdCBmYWxsYmFja1xuICAgICAgICAgIGNvbnN0IHRhZ3MgPSBmYWxsYmFja0RhdGEueW91dHViZS5wbGFpbl90YWdzLnNsaWNlKDAsIG1heEl0ZW1zKTtcbiAgICAgICAgICBjb25zdCBoYXNodGFncyA9IGZhbGxiYWNrRGF0YS55b3V0dWJlLmhhc2h0YWdzLnNsaWNlKDAsIG1heEl0ZW1zKTtcbiAgICAgICAgICBmYWxsYmFja1RleHQgPSBgVEFHUzpbJHt0YWdzLmpvaW4oJywnKX1dSEFTSFRBR1M6WyR7aGFzaHRhZ3Muam9pbignLCcpfV1gO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgIHRleHQ6IGZhbGxiYWNrVGV4dCxcbiAgICAgICAgZmFsbGJhY2s6IHRydWUsXG4gICAgICAgIG1lc3NhZ2U6IGBVc2luZyAke2xhbmd1YWdlfSBmYWxsYmFjayBjb250ZW50IGR1ZSB0byBBUEkgdW5hdmFpbGFiaWxpdHlgXG4gICAgICB9KTtcbiAgICB9XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdGaW5hbCBlcnJvciBpbiBnZW5lcmF0ZS5qczonLCBlcnJvcik7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIGVycm9yOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyxcbiAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQgZHVyaW5nIGNvbnRlbnQgZ2VuZXJhdGlvbi4nXG4gICAgfSk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNk0sU0FBUyxvQkFBb0I7QUFDMU8sT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTs7O0FDRmdNLE9BQU8sUUFBUTtBQUNsTyxPQUFPLFVBQVU7QUFDakIsU0FBUyxxQkFBcUI7QUFGaUcsSUFBTSwyQ0FBMkM7QUFLaEwsSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLEtBQUssUUFBUSxVQUFVO0FBRXpDLGVBQU8sUUFBK0IsS0FBSyxLQUFLO0FBRTlDLE1BQUksVUFBVSxnQkFBZ0Isa0JBQWtCO0FBR2hELE1BQUksSUFBSSxXQUFXLFFBQVE7QUFDekIsV0FBTyxJQUFJLE9BQU8sR0FBRyxFQUFFLEtBQUs7QUFBQSxNQUMxQixPQUFPO0FBQUEsTUFDUCxTQUFTO0FBQUEsSUFDWCxDQUFDO0FBQUEsRUFDSDtBQUVBLE1BQUk7QUFDRixVQUFNLEVBQUUsUUFBUSxXQUFXLFdBQVcsV0FBVyxXQUFXLFNBQVMsU0FBUyxJQUFJLElBQUk7QUFFdEYsUUFBSSxDQUFDLFFBQVE7QUFDWCxhQUFPLElBQUksT0FBTyxHQUFHLEVBQUUsS0FBSztBQUFBLFFBQzFCLE9BQU87QUFBQSxRQUNQLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBRUEsWUFBUSxJQUFJLDJCQUEyQixRQUFRLGVBQWUsUUFBUSxhQUFhLE1BQU0sRUFBRTtBQUczRixVQUFNLGNBQWM7QUFBQSxNQUNsQjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFFQSxRQUFJLGdCQUFnQjtBQUNwQixRQUFJLFlBQVk7QUFFaEIsZUFBVyxTQUFTLGFBQWE7QUFDL0IsVUFBSTtBQUNGLGdCQUFRLElBQUksOENBQThDLEtBQUssRUFBRTtBQUdqRSxjQUFNLGlCQUFpQixHQUFHLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0NBTVIsUUFBUTtBQUFBLG1CQUNyQixNQUFNO0FBQUEsY0FDWCxRQUFRO0FBQUEsb0JBQ0YsUUFBUSxpQkFBaUIsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVE5QyxjQUFNLFdBQVcsTUFBTSxNQUFNLGlEQUFpRDtBQUFBLFVBQzVFLFFBQVE7QUFBQSxVQUNSLFNBQVM7QUFBQSxZQUNQLGlCQUFpQixVQUFVLFFBQVEsSUFBSSxrQkFBa0I7QUFBQSxZQUN6RCxnQkFBZ0I7QUFBQSxVQUNsQjtBQUFBLFVBQ0EsTUFBTSxLQUFLLFVBQVU7QUFBQSxZQUNuQjtBQUFBLFlBQ0EsVUFBVSxDQUFDO0FBQUEsY0FDVCxNQUFNO0FBQUEsY0FDTixTQUFTO0FBQUEsWUFDWCxDQUFDO0FBQUEsWUFDRCxhQUFhO0FBQUEsWUFDYixZQUFZO0FBQUEsVUFDZCxDQUFDO0FBQUEsUUFDSCxDQUFDO0FBRUQsWUFBSSxDQUFDLFNBQVMsSUFBSTtBQUNoQixnQkFBTSxZQUFZLE1BQU0sU0FBUyxLQUFLO0FBQ3RDLGdCQUFNLElBQUksTUFBTSxrQkFBa0IsS0FBSyxLQUFLLFNBQVMsTUFBTSxJQUFJLFNBQVMsVUFBVSxNQUFNLFNBQVMsRUFBRTtBQUFBLFFBQ3JHO0FBRUEsY0FBTSxPQUFPLE1BQU0sU0FBUyxLQUFLO0FBQ2pDLFlBQUksS0FBSyxXQUFXLEtBQUssUUFBUSxTQUFTLEtBQUssS0FBSyxRQUFRLENBQUMsRUFBRSxXQUFXLEtBQUssUUFBUSxDQUFDLEVBQUUsUUFBUSxTQUFTO0FBQ3pHLDBCQUFnQixLQUFLLFFBQVEsQ0FBQyxFQUFFLFFBQVE7QUFDeEMsa0JBQVEsSUFBSSw4Q0FBOEMsS0FBSyxFQUFFO0FBQ2pFO0FBQUEsUUFDRixPQUFPO0FBQ0wsZ0JBQU0sSUFBSSxNQUFNLHFCQUFxQixLQUFLLDJDQUEyQztBQUFBLFFBQ3ZGO0FBQUEsTUFDRixTQUFTLE9BQU87QUFDZCxnQkFBUSxNQUFNLG9CQUFvQixLQUFLLEtBQUssTUFBTSxPQUFPO0FBQ3pELG9CQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFFQSxRQUFJLGVBQWU7QUFDakIsYUFBTyxJQUFJLE9BQU8sR0FBRyxFQUFFLEtBQUs7QUFBQSxRQUMxQixNQUFNO0FBQUEsTUFDUixDQUFDO0FBQUEsSUFDSCxPQUFPO0FBRUwsY0FBUSxLQUFLLG9FQUFvRTtBQUNqRixZQUFNLGVBQWUsS0FBSyxLQUFLLFdBQVcsZUFBZTtBQUN6RCxZQUFNLGtCQUFrQixHQUFHLGFBQWEsY0FBYyxPQUFPO0FBQzdELFlBQU0sZUFBZSxLQUFLLE1BQU0sZUFBZTtBQUUvQyxVQUFJLGVBQWU7QUFHbkIsVUFBSSxhQUFhLGFBQWEsYUFBYSxnQkFBZ0IsYUFBYSxhQUFhLFFBQVEsR0FBRztBQUM5RixjQUFNLFdBQVcsYUFBYSxhQUFhLFFBQVE7QUFDbkQsWUFBSSxhQUFhLFdBQVc7QUFDMUIsZ0JBQU0sT0FBTyxTQUFTLEtBQUssTUFBTSxHQUFHLEVBQUU7QUFDdEMsZ0JBQU0sV0FBVyxTQUFTLFNBQVMsTUFBTSxHQUFHLEVBQUU7QUFDOUMseUJBQWUsU0FBUyxLQUFLLEtBQUssR0FBRyxDQUFDLGNBQWMsU0FBUyxLQUFLLEdBQUcsQ0FBQztBQUFBLFFBQ3hFLE9BQU87QUFDTCx5QkFBZSxTQUFTLFNBQVMsTUFBTSxHQUFHLEVBQUUsRUFBRSxLQUFLLElBQUk7QUFBQSxRQUN6RDtBQUFBLE1BQ0YsT0FBTztBQUVMLGNBQU0sV0FBVztBQUNqQixjQUFNLFdBQVc7QUFFakIsWUFBSSxhQUFhLFdBQVc7QUFDMUIsZ0JBQU0sT0FBTyxhQUFhLFFBQVEsV0FBVyxNQUFNLEdBQUcsUUFBUTtBQUM5RCxnQkFBTSxXQUFXLGFBQWEsUUFBUSxTQUFTLE1BQU0sR0FBRyxRQUFRO0FBQ2hFLHlCQUFlLFNBQVMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxjQUFjLFNBQVMsS0FBSyxHQUFHLENBQUM7QUFBQSxRQUN4RSxXQUFXLGFBQWEsYUFBYTtBQUNuQyx5QkFBZSxhQUFhLG1CQUFtQixNQUFNLEdBQUcsUUFBUSxFQUFFLEtBQUssSUFBSTtBQUFBLFFBQzdFLFdBQVcsYUFBYSxVQUFVO0FBQ2hDLHlCQUFlLGFBQWEsZ0JBQWdCLE1BQU0sR0FBRyxRQUFRLEVBQUUsS0FBSyxJQUFJO0FBQUEsUUFDMUUsV0FBVyxhQUFhLFlBQVk7QUFDbEMseUJBQWUsYUFBYSxrQkFBa0IsTUFBTSxHQUFHLFFBQVEsRUFBRSxLQUFLLElBQUk7QUFBQSxRQUM1RSxPQUFPO0FBRUwsZ0JBQU0sT0FBTyxhQUFhLFFBQVEsV0FBVyxNQUFNLEdBQUcsUUFBUTtBQUM5RCxnQkFBTSxXQUFXLGFBQWEsUUFBUSxTQUFTLE1BQU0sR0FBRyxRQUFRO0FBQ2hFLHlCQUFlLFNBQVMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxjQUFjLFNBQVMsS0FBSyxHQUFHLENBQUM7QUFBQSxRQUN4RTtBQUFBLE1BQ0Y7QUFFQSxhQUFPLElBQUksT0FBTyxHQUFHLEVBQUUsS0FBSztBQUFBLFFBQzFCLE1BQU07QUFBQSxRQUNOLFVBQVU7QUFBQSxRQUNWLFNBQVMsU0FBUyxRQUFRO0FBQUEsTUFDNUIsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUVGLFNBQVMsT0FBTztBQUNkLFlBQVEsTUFBTSwrQkFBK0IsS0FBSztBQUNsRCxXQUFPLElBQUksT0FBTyxHQUFHLEVBQUUsS0FBSztBQUFBLE1BQzFCLE9BQU87QUFBQSxNQUNQLFNBQVMsTUFBTSxXQUFXO0FBQUEsSUFDNUIsQ0FBQztBQUFBLEVBQ0g7QUFDRjs7O0FENUpBLE9BQU8sT0FBTztBQU1kLFNBQVMscUJBQXFCO0FBQzVCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGdCQUFnQixRQUFRO0FBQ3RCLGFBQU8sWUFBWSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7QUFFekMsWUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLGVBQWUsR0FBRztBQUN6QyxpQkFBTyxLQUFLO0FBQUEsUUFDZDtBQUVBLGdCQUFRLElBQUksU0FBUyxJQUFJLE1BQU0sSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUc1QyxZQUFJLElBQUksV0FBVyxRQUFRO0FBQ3pCLGNBQUksYUFBYTtBQUNqQixjQUFJLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUNoRCxjQUFJLElBQUksS0FBSyxVQUFVO0FBQUEsWUFDckIsT0FBTztBQUFBLFlBQ1AsU0FBUztBQUFBLFVBQ1gsQ0FBQyxDQUFDO0FBQ0Y7QUFBQSxRQUNGO0FBR0EsWUFBSSxPQUFPO0FBQ1gsWUFBSSxZQUFZLE1BQU07QUFFdEIsWUFBSSxHQUFHLFFBQVEsV0FBUztBQUN0QixrQkFBUTtBQUFBLFFBQ1YsQ0FBQztBQUVELFlBQUksR0FBRyxPQUFPLFlBQVk7QUFDeEIsY0FBSTtBQUVGLGdCQUFJLE9BQU8sT0FBTyxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUM7QUFHdEMsZ0JBQUksU0FBUyxDQUFDLFNBQVM7QUFDckIsa0JBQUksYUFBYTtBQUNqQixxQkFBTztBQUFBLFlBQ1Q7QUFFQSxnQkFBSSxPQUFPLENBQUMsU0FBUztBQUNuQixrQkFBSSxVQUFVLGdCQUFnQixrQkFBa0I7QUFDaEQsa0JBQUksSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUFDO0FBQzVCLHFCQUFPO0FBQUEsWUFDVDtBQUdBLGtCQUFNLFFBQVcsS0FBSyxHQUFHO0FBQUEsVUFFM0IsU0FBUyxZQUFZO0FBQ25CLG9CQUFRLE1BQU0sMEJBQTBCLFVBQVU7QUFDbEQsZ0JBQUksYUFBYTtBQUNqQixnQkFBSSxVQUFVLGdCQUFnQixrQkFBa0I7QUFDaEQsZ0JBQUksSUFBSSxLQUFLLFVBQVU7QUFBQSxjQUNyQixPQUFPO0FBQUEsY0FDUCxTQUFTO0FBQUEsWUFDWCxDQUFDLENBQUM7QUFBQSxVQUNKO0FBQUEsUUFDRixDQUFDO0FBRUQsWUFBSSxHQUFHLFNBQVMsQ0FBQyxVQUFVO0FBQ3pCLGtCQUFRLE1BQU0seUJBQXlCLEtBQUs7QUFDNUMsY0FBSSxhQUFhO0FBQ2pCLGNBQUksVUFBVSxnQkFBZ0Isa0JBQWtCO0FBQ2hELGNBQUksSUFBSSxLQUFLLFVBQVU7QUFBQSxZQUNyQixPQUFPO0FBQUEsWUFDUCxTQUFTO0FBQUEsVUFDWCxDQUFDLENBQUM7QUFBQSxRQUNKLENBQUM7QUFBQSxNQUNILENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztBQUFBLEVBQ3ZDLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGNBQWM7QUFBQSxJQUNkLHVCQUF1QjtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUVmLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixnQkFBSSxHQUFHLFNBQVMsT0FBTyxLQUFLLEdBQUcsU0FBUyxXQUFXLEdBQUc7QUFDcEQscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLGtCQUFrQixHQUFHO0FBQ25DLHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxlQUFlLEdBQUc7QUFDaEMscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsVUFBVSxHQUFHO0FBQzNCLHFCQUFPO0FBQUEsWUFDVDtBQUNBLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLFNBQVMsR0FBRztBQUMxQixtQkFBTztBQUFBLFVBQ1Q7QUFDQSxjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBQ0EsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxNQUNBLFVBQVUsQ0FBQztBQUFBLElBQ2I7QUFBQSxJQUNBLFdBQVc7QUFBQSxJQUNYLHNCQUFzQjtBQUFBLEVBQ3hCO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTLENBQUMsVUFBVTtBQUFBLEVBQ3RCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUCxpQkFBaUI7QUFBQSxNQUNqQiwwQkFBMEI7QUFBQSxNQUMxQixtQkFBbUI7QUFBQSxNQUNuQixvQkFBb0I7QUFBQSxJQUN0QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFNBQVM7QUFBQSxNQUNQLGlCQUFpQjtBQUFBLE1BQ2pCLDBCQUEwQjtBQUFBLE1BQzFCLG1CQUFtQjtBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsY0FBYztBQUFBLElBQ2QscUJBQXFCO0FBQUEsTUFDbkIsS0FBSztBQUFBLFFBQ0gsU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
