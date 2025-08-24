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
      server.middlewares.use("/api/generate", async (req, res, next) => {
        try {
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
              if (body) {
                req.body = JSON.parse(body);
              } else {
                req.body = {};
              }
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
              console.error("Error parsing request body:", parseError);
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({
                error: "Bad Request",
                message: "Invalid JSON in request body"
              }));
            }
          });
          req.on("error", (error) => {
            console.error("Request error:", error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              error: "Internal Server Error",
              message: "Request processing failed"
            }));
          });
        } catch (error) {
          console.error("Error in API handler middleware:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            error: "Internal Server Error",
            message: "Middleware error"
          }));
        }
      });
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  build: {
    target: "es2015",
    // Better compatibility while still modern
    minify: "esbuild",
    // Faster build times
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    // Warn for chunks larger than 500KB
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
      // Keep all dependencies bundled for better caching
    },
    // Optimize CSS
    cssMinify: true,
    // Better tree shaking
    reportCompressedSize: false
    // Faster builds
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
    // Let firebase be dynamically imported
  },
  // Performance optimizations
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
  // CSS optimization
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      css: {
        charset: false
        // Remove charset from CSS
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAiYXBpL2dlbmVyYXRlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcblxuLy8gTG9hZCAuZW52IGZpbGVcbmRvdGVudi5jb25maWcoKTtcblxuLy8gSW1wb3J0IHRoZSBoYW5kbGVyIGZ1bmN0aW9uXG5pbXBvcnQgYXBpSGFuZGxlciBmcm9tICcuL2FwaS9nZW5lcmF0ZS5qcyc7XG5cbi8vIEN1c3RvbSBWaXRlIHBsdWdpbiB0byBlbXVsYXRlIFZlcmNlbCdzIHNlcnZlcmxlc3MgZnVuY3Rpb25zIGluIGRldmVsb3BtZW50XG5mdW5jdGlvbiB2ZXJjZWxBcGlEZXZQbHVnaW4oKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZlcmNlbC1hcGktZGV2LXBsdWdpbicsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL2FwaS9nZW5lcmF0ZScsIGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIEVuc3VyZSB3ZSdyZSBvbmx5IGhhbmRsaW5nIFBPU1QgcmVxdWVzdHNcbiAgICAgICAgICBpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwNTtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgZXJyb3I6ICdNZXRob2QgTm90IEFsbG93ZWQnLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnT25seSBQT1NUIHJlcXVlc3RzIGFyZSBzdXBwb3J0ZWQnXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUGFyc2UgcmVxdWVzdCBib2R5XG4gICAgICAgICAgbGV0IGJvZHkgPSAnJztcbiAgICAgICAgICByZXEuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcblxuICAgICAgICAgIHJlcS5vbignZGF0YScsIGNodW5rID0+IHtcbiAgICAgICAgICAgIGJvZHkgKz0gY2h1bms7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXEub24oJ2VuZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIC8vIFBhcnNlIEpTT04gYm9keVxuICAgICAgICAgICAgICBpZiAoYm9keSkge1xuICAgICAgICAgICAgICAgIHJlcS5ib2R5ID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXEuYm9keSA9IHt9O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gU2hpbSBFeHByZXNzLWxpa2UgcmVzIG1ldGhvZHMgb250byBOb2RlJ3MgbmF0aXZlIHJlcyBvYmplY3RcbiAgICAgICAgICAgICAgcmVzLnN0YXR1cyA9IChjb2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSBjb2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgcmVzLmpzb24gPSAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBBUEkgaGFuZGxlclxuICAgICAgICAgICAgICBhd2FpdCBhcGlIYW5kbGVyKHJlcSwgcmVzKTtcblxuICAgICAgICAgICAgfSBjYXRjaCAocGFyc2VFcnJvcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwYXJzaW5nIHJlcXVlc3QgYm9keTonLCBwYXJzZUVycm9yKTtcbiAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGVycm9yOiAnQmFkIFJlcXVlc3QnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdJbnZhbGlkIEpTT04gaW4gcmVxdWVzdCBib2R5J1xuICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXEub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdSZXF1ZXN0IGVycm9yOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICBlcnJvcjogJ0ludGVybmFsIFNlcnZlciBFcnJvcicsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdSZXF1ZXN0IHByb2Nlc3NpbmcgZmFpbGVkJ1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW4gQVBJIGhhbmRsZXIgbWlkZGxld2FyZTonLCBlcnJvcik7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGVycm9yOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdNaWRkbGV3YXJlIGVycm9yJ1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcbn1cblxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHZlcmNlbEFwaURldlBsdWdpbigpXSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlczIwMTUnLCAvLyBCZXR0ZXIgY29tcGF0aWJpbGl0eSB3aGlsZSBzdGlsbCBtb2Rlcm5cbiAgICBtaW5pZnk6ICdlc2J1aWxkJywgLy8gRmFzdGVyIGJ1aWxkIHRpbWVzXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA1MDAsIC8vIFdhcm4gZm9yIGNodW5rcyBsYXJnZXIgdGhhbiA1MDBLQlxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICAvLyBDb3JlIFJlYWN0IGNodW5rc1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3QnKSB8fCBpZC5pbmNsdWRlcygncmVhY3QtZG9tJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdyZWFjdC12ZW5kb3InO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdC1yb3V0ZXItZG9tJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdyb3V0ZXInO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdmcmFtZXItbW90aW9uJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdhbmltYXRpb25zJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbHVjaWRlLXJlYWN0JykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdpY29ucyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2ZpcmViYXNlJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdmaXJlYmFzZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBHcm91cCBhbGwgb3RoZXIgdmVuZG9yIGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBTcGxpdCBwYWdlcyBpbnRvIHNlcGFyYXRlIGNodW5rc1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3BhZ2VzLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3BhZ2VzJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvY29tcG9uZW50cy8nKSkge1xuICAgICAgICAgICAgcmV0dXJuICdjb21wb25lbnRzJztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XSdcbiAgICAgIH0sXG4gICAgICBleHRlcm5hbDogW10gLy8gS2VlcCBhbGwgZGVwZW5kZW5jaWVzIGJ1bmRsZWQgZm9yIGJldHRlciBjYWNoaW5nXG4gICAgfSxcbiAgICAvLyBPcHRpbWl6ZSBDU1NcbiAgICBjc3NNaW5pZnk6IHRydWUsXG4gICAgLy8gQmV0dGVyIHRyZWUgc2hha2luZ1xuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSAvLyBGYXN0ZXIgYnVpbGRzXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICdyZWFjdCcsXG4gICAgICAncmVhY3QtZG9tJyxcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICdmcmFtZXItbW90aW9uJyxcbiAgICAgICdsdWNpZGUtcmVhY3QnXG4gICAgXSxcbiAgICBleGNsdWRlOiBbJ2ZpcmViYXNlJ10gLy8gTGV0IGZpcmViYXNlIGJlIGR5bmFtaWNhbGx5IGltcG9ydGVkXG4gIH0sXG4gIC8vIFBlcmZvcm1hbmNlIG9wdGltaXphdGlvbnNcbiAgc2VydmVyOiB7XG4gICAgY29yczogdHJ1ZSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQ2FjaGUtQ29udHJvbCc6ICdtYXgtYWdlPTMxNTM2MDAwJyxcbiAgICAgICdYLUNvbnRlbnQtVHlwZS1PcHRpb25zJzogJ25vc25pZmYnLFxuICAgICAgJ1gtRnJhbWUtT3B0aW9ucyc6ICdERU5ZJyxcbiAgICAgICdYLVhTUy1Qcm90ZWN0aW9uJzogJzE7IG1vZGU9YmxvY2snXG4gICAgfVxuICB9LFxuICBwcmV2aWV3OiB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbWF4LWFnZT0zMTUzNjAwMCwgaW1tdXRhYmxlJyxcbiAgICAgICdYLUNvbnRlbnQtVHlwZS1PcHRpb25zJzogJ25vc25pZmYnLFxuICAgICAgJ1gtRnJhbWUtT3B0aW9ucyc6ICdERU5ZJ1xuICAgIH1cbiAgfSxcbiAgLy8gQ1NTIG9wdGltaXphdGlvblxuICBjc3M6IHtcbiAgICBkZXZTb3VyY2VtYXA6IGZhbHNlLFxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIGNzczoge1xuICAgICAgICBjaGFyc2V0OiBmYWxzZSAvLyBSZW1vdmUgY2hhcnNldCBmcm9tIENTU1xuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL2FwaVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC9jb2RlL2FwaS9nZW5lcmF0ZS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvYXBpL2dlbmVyYXRlLmpzXCI7aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XG5cbi8vIEhlbHBlciB0byBnZXQgX19kaXJuYW1lIGluIEVTIG1vZHVsZXNcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgLy8gSW1tZWRpYXRlbHkgc2V0IEpTT04gY29udGVudC10eXBlXG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cbiAgLy8gQmxvY2sgbm9uLVBPU1QgcmVxdWVzdHNcbiAgaWYgKHJlcS5tZXRob2QgIT09ICdQT1NUJykge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwNSkuanNvbih7XG4gICAgICBlcnJvcjogJ01ldGhvZCBOb3QgQWxsb3dlZCcsXG4gICAgICBtZXNzYWdlOiAnT25seSBQT1NUIHJlcXVlc3RzIGFyZSBzdXBwb3J0ZWQnXG4gICAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHsgcHJvbXB0LCBwbGF0Zm9ybSA9ICd5b3V0dWJlJywgbGFuZ3VhZ2UgPSAnZW5nbGlzaCcsIHJlZ2lvbiA9ICdnbG9iYWwnIH0gPSByZXEuYm9keTtcblxuICAgIGlmICghcHJvbXB0KSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICBlcnJvcjogJ0JhZCBSZXF1ZXN0JyxcbiAgICAgICAgbWVzc2FnZTogJ01pc3NpbmcgcHJvbXB0IGluIHJlcXVlc3QgYm9keSdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGBBUEkgUmVxdWVzdCAtIFBsYXRmb3JtOiAke3BsYXRmb3JtfSwgTGFuZ3VhZ2U6ICR7bGFuZ3VhZ2V9LCBSZWdpb246ICR7cmVnaW9ufWApO1xuXG4gICAgLy8gRGVmaW5lIHRoZSBsaXN0IG9mIG1vZGVscyB0byB0cnkgaW4gb3JkZXIgb2YgcHJlZmVyZW5jZVxuICAgIGNvbnN0IG1vZGVsc1RvVHJ5ID0gW1xuICAgICAgXCJtaXN0cmFsYWkvbWlzdHJhbC03Yi1pbnN0cnVjdFwiLFxuICAgICAgXCJtZXRhLWxsYW1hL2xsYW1hLTMtOGItaW5zdHJ1Y3RcIixcbiAgICAgIFwiZ29vZ2xlL2dlbWluaS1mbGFzaC0xLjVcIixcbiAgICAgIFwiYW50aHJvcGljL2NsYXVkZS0zLWhhaWt1XCJcbiAgICBdO1xuXG4gICAgbGV0IGdlbmVyYXRlZFRleHQgPSBudWxsO1xuICAgIGxldCBsYXN0RXJyb3IgPSBudWxsO1xuXG4gICAgZm9yIChjb25zdCBtb2RlbCBvZiBtb2RlbHNUb1RyeSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc29sZS5sb2coYEF0dGVtcHRpbmcgdG8gZ2VuZXJhdGUgY29udGVudCB3aXRoIG1vZGVsOiAke21vZGVsfWApO1xuXG4gICAgICAgIC8vIEVuaGFuY2VkIHByb21wdCBmb3IgYmV0dGVyIHRhZyBnZW5lcmF0aW9uXG4gICAgICAgIGNvbnN0IGVuaGFuY2VkUHJvbXB0ID0gYCR7cHJvbXB0fVxuXG5TVFJJQ1QgUkVRVUlSRU1FTlRTOlxuLSBHZW5lcmF0ZSBFWEFDVExZIDE1LTIwIGl0ZW1zIHBlciBjYXRlZ29yeSAobWluaW11bSAxNSwgbWF4aW11bSAyMClcbi0gRm9yIFlvdVR1YmU6IFByb3ZpZGUgYm90aCBUQUdTIChwbGFpbiB0ZXh0KSBhbmQgSEFTSFRBR1MgKHdpdGggIyBzeW1ib2wpXG4tIEZvciBvdGhlciBwbGF0Zm9ybXM6IFByb3ZpZGUgb25seSBIQVNIVEFHUyAod2l0aCAjIHN5bWJvbClcbi0gVXNlIHRoZSBzcGVjaWZpZWQgbGFuZ3VhZ2U6ICR7bGFuZ3VhZ2V9XG4tIFRhcmdldCByZWdpb246ICR7cmVnaW9ufVxuLSBQbGF0Zm9ybTogJHtwbGF0Zm9ybX1cbi0gQ29udGVudCBmb3JtYXQ6ICR7b3B0aW9ucy5jb250ZW50Rm9ybWF0IHx8ICdnZW5lcmFsJ31cblxuRk9STUFUIFJFUVVJUkVNRU5UUzpcbi0gWW91VHViZTogVEFHUzpbdGFnMSx0YWcyLHRhZzNdSEFTSFRBR1M6WyNoYXNodGFnMSwjaGFzaHRhZzIsI2hhc2h0YWczXVxuLSBPdGhlciBwbGF0Zm9ybXM6ICNoYXNodGFnMSwjaGFzaHRhZzIsI2hhc2h0YWczXG4tIE5PIGV4dHJhIHRleHQsIGV4cGxhbmF0aW9ucywgb3IgZm9ybWF0dGluZ1xuLSBDb3VudCBtdXN0IGJlIGJldHdlZW4gMTUtMjAgaXRlbXMgcGVyIGNhdGVnb3J5YDtcblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9vcGVucm91dGVyLmFpL2FwaS92MS9jaGF0L2NvbXBsZXRpb25zXCIsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHtwcm9jZXNzLmVudi5PUEVOUk9VVEVSX0FQSV9LRVl9YCxcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIG1vZGVsOiBtb2RlbCxcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBbe1xuICAgICAgICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgICAgICAgY29udGVudDogZW5oYW5jZWRQcm9tcHRcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgdGVtcGVyYXR1cmU6IDAuNyxcbiAgICAgICAgICAgIG1heF90b2tlbnM6IDEwMDBcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgY29uc3QgZXJyb3JEYXRhID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpOyAvLyBVc2UgLnRleHQoKSBmb3IgYmV0dGVyIGVycm9yIGRldGFpbHNcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFQSSBlcnJvciB3aXRoICR7bW9kZWx9OiAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fSAtICR7ZXJyb3JEYXRhfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgaWYgKGRhdGEuY2hvaWNlcyAmJiBkYXRhLmNob2ljZXMubGVuZ3RoID4gMCAmJiBkYXRhLmNob2ljZXNbMF0ubWVzc2FnZSAmJiBkYXRhLmNob2ljZXNbMF0ubWVzc2FnZS5jb250ZW50KSB7XG4gICAgICAgICAgZ2VuZXJhdGVkVGV4dCA9IGRhdGEuY2hvaWNlc1swXS5tZXNzYWdlLmNvbnRlbnQ7XG4gICAgICAgICAgY29uc29sZS5sb2coYFN1Y2Nlc3NmdWxseSBnZW5lcmF0ZWQgY29udGVudCB3aXRoIG1vZGVsOiAke21vZGVsfWApO1xuICAgICAgICAgIGJyZWFrOyAvLyBFeGl0IGxvb3AgaWYgc3VjY2Vzc2Z1bFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQVBJIHJlc3BvbnNlIGZyb20gJHttb2RlbH0gbWlzc2luZyBjb250ZW50IG9yIHVuZXhwZWN0ZWQgc3RydWN0dXJlLmApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciB3aXRoIG1vZGVsICR7bW9kZWx9OmAsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICBsYXN0RXJyb3IgPSBlcnJvcjsgLy8gU3RvcmUgdGhlIGxhc3QgZXJyb3JcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZ2VuZXJhdGVkVGV4dCkge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgdGV4dDogZ2VuZXJhdGVkVGV4dFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIGFsbCBtb2RlbHMgZmFpbCwgZmFsbCBiYWNrIHRvIHRoZSBsb2NhbCBKU09OIGZpbGVcbiAgICAgIGNvbnNvbGUud2FybihcIkFsbCBPcGVuUm91dGVyIG1vZGVscyBmYWlsZWQuIEZhbGxpbmcgYmFjayB0byBsb2NhbCBmYWxsYmFjay5qc29uLlwiKTtcbiAgICAgIGNvbnN0IGZhbGxiYWNrUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmYWxsYmFjay5qc29uJyk7XG4gICAgICBjb25zdCBmYWxsYmFja0NvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmFsbGJhY2tQYXRoLCAndXRmLTgnKTtcbiAgICAgIGNvbnN0IGZhbGxiYWNrRGF0YSA9IEpTT04ucGFyc2UoZmFsbGJhY2tDb250ZW50KTtcblxuICAgICAgbGV0IGZhbGxiYWNrVGV4dCA9IFwiXCI7XG5cbiAgICAgIC8vIEhhbmRsZSBtdWx0aWxpbmd1YWwgZmFsbGJhY2sgY29udGVudFxuICAgICAgaWYgKGxhbmd1YWdlICE9PSAnZW5nbGlzaCcgJiYgZmFsbGJhY2tEYXRhLm11bHRpbGluZ3VhbCAmJiBmYWxsYmFja0RhdGEubXVsdGlsaW5ndWFsW2xhbmd1YWdlXSkge1xuICAgICAgICBjb25zdCBsYW5nRGF0YSA9IGZhbGxiYWNrRGF0YS5tdWx0aWxpbmd1YWxbbGFuZ3VhZ2VdO1xuICAgICAgICBpZiAocGxhdGZvcm0gPT09ICd5b3V0dWJlJykge1xuICAgICAgICAgIGNvbnN0IHRhZ3MgPSBsYW5nRGF0YS50YWdzLnNsaWNlKDAsIDE1KTtcbiAgICAgICAgICBjb25zdCBoYXNodGFncyA9IGxhbmdEYXRhLmhhc2h0YWdzLnNsaWNlKDAsIDE1KTtcbiAgICAgICAgICBmYWxsYmFja1RleHQgPSBgVEFHUzpbJHt0YWdzLmpvaW4oJywnKX1dSEFTSFRBR1M6WyR7aGFzaHRhZ3Muam9pbignLCcpfV1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZhbGxiYWNrVGV4dCA9IGxhbmdEYXRhLmhhc2h0YWdzLnNsaWNlKDAsIDE1KS5qb2luKCcsICcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFbmdsaXNoIGZhbGxiYWNrIC0gZ2VuZXJhdGUgZXhhY3RseSAxNS0yMCBpdGVtc1xuICAgICAgICBjb25zdCBtaW5JdGVtcyA9IDE1O1xuICAgICAgICBjb25zdCBtYXhJdGVtcyA9IDIwO1xuXG4gICAgICAgIGlmIChwbGF0Zm9ybSA9PT0gJ3lvdXR1YmUnKSB7XG4gICAgICAgICAgY29uc3QgdGFncyA9IGZhbGxiYWNrRGF0YS55b3V0dWJlLnBsYWluX3RhZ3Muc2xpY2UoMCwgbWF4SXRlbXMpO1xuICAgICAgICAgIGNvbnN0IGhhc2h0YWdzID0gZmFsbGJhY2tEYXRhLnlvdXR1YmUuaGFzaHRhZ3Muc2xpY2UoMCwgbWF4SXRlbXMpO1xuICAgICAgICAgIGZhbGxiYWNrVGV4dCA9IGBUQUdTOlske3RhZ3Muam9pbignLCcpfV1IQVNIVEFHUzpbJHtoYXNodGFncy5qb2luKCcsJyl9XWA7XG4gICAgICAgIH0gZWxzZSBpZiAocGxhdGZvcm0gPT09ICdpbnN0YWdyYW0nKSB7XG4gICAgICAgICAgZmFsbGJhY2tUZXh0ID0gZmFsbGJhY2tEYXRhLmluc3RhZ3JhbV9oYXNodGFncy5zbGljZSgwLCBtYXhJdGVtcykuam9pbignLCAnKTtcbiAgICAgICAgfSBlbHNlIGlmIChwbGF0Zm9ybSA9PT0gJ3Rpa3RvaycpIHtcbiAgICAgICAgICBmYWxsYmFja1RleHQgPSBmYWxsYmFja0RhdGEudGlrdG9rX2hhc2h0YWdzLnNsaWNlKDAsIG1heEl0ZW1zKS5qb2luKCcsICcpO1xuICAgICAgICB9IGVsc2UgaWYgKHBsYXRmb3JtID09PSAnZmFjZWJvb2snKSB7XG4gICAgICAgICAgZmFsbGJhY2tUZXh0ID0gZmFsbGJhY2tEYXRhLmZhY2Vib29rX2hhc2h0YWdzLnNsaWNlKDAsIG1heEl0ZW1zKS5qb2luKCcsICcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIERlZmF1bHQgZmFsbGJhY2tcbiAgICAgICAgICBjb25zdCB0YWdzID0gZmFsbGJhY2tEYXRhLnlvdXR1YmUucGxhaW5fdGFncy5zbGljZSgwLCBtYXhJdGVtcyk7XG4gICAgICAgICAgY29uc3QgaGFzaHRhZ3MgPSBmYWxsYmFja0RhdGEueW91dHViZS5oYXNodGFncy5zbGljZSgwLCBtYXhJdGVtcyk7XG4gICAgICAgICAgZmFsbGJhY2tUZXh0ID0gYFRBR1M6WyR7dGFncy5qb2luKCcsJyl9XUhBU0hUQUdTOlske2hhc2h0YWdzLmpvaW4oJywnKX1dYDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICB0ZXh0OiBmYWxsYmFja1RleHQsXG4gICAgICAgIGZhbGxiYWNrOiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiBgVXNpbmcgJHtsYW5ndWFnZX0gZmFsbGJhY2sgY29udGVudCBkdWUgdG8gQVBJIHVuYXZhaWxhYmlsaXR5YFxuICAgICAgfSk7XG4gICAgfVxuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRmluYWwgZXJyb3IgaW4gZ2VuZXJhdGUuanM6JywgZXJyb3IpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBlcnJvcjogJ0ludGVybmFsIFNlcnZlciBFcnJvcicsXG4gICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkIGR1cmluZyBjb250ZW50IGdlbmVyYXRpb24uJ1xuICAgIH0pO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZNLFNBQVMsb0JBQW9CO0FBQzFPLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7OztBQ0ZnTSxPQUFPLFFBQVE7QUFDbE8sT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBRmlHLElBQU0sMkNBQTJDO0FBS2hMLElBQU0sYUFBYSxjQUFjLHdDQUFlO0FBQ2hELElBQU0sWUFBWSxLQUFLLFFBQVEsVUFBVTtBQUV6QyxlQUFPLFFBQStCLEtBQUssS0FBSztBQUU5QyxNQUFJLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUdoRCxNQUFJLElBQUksV0FBVyxRQUFRO0FBQ3pCLFdBQU8sSUFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLO0FBQUEsTUFDMUIsT0FBTztBQUFBLE1BQ1AsU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0g7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SyxHQUFHLFNBQVMsV0FBVyxHQUFHO0FBQ3BELHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxrQkFBa0IsR0FBRztBQUNuQyxxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsZUFBZSxHQUFHO0FBQ2hDLHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLFVBQVUsR0FBRztBQUMzQixxQkFBTztBQUFBLFlBQ1Q7QUFFQSxtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLEdBQUcsU0FBUyxTQUFTLEdBQUc7QUFDMUIsbUJBQU87QUFBQSxVQUNUO0FBQ0EsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxRQUNBLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsTUFDQSxVQUFVLENBQUM7QUFBQTtBQUFBLElBQ2I7QUFBQTtBQUFBLElBRUEsV0FBVztBQUFBO0FBQUEsSUFFWCxzQkFBc0I7QUFBQTtBQUFBLEVBQ3hCO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTLENBQUMsVUFBVTtBQUFBO0FBQUEsRUFDdEI7QUFBQTtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLE1BQ1AsaUJBQWlCO0FBQUEsTUFDakIsMEJBQTBCO0FBQUEsTUFDMUIsbUJBQW1CO0FBQUEsTUFDbkIsb0JBQW9CO0FBQUEsSUFDdEI7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxTQUFTO0FBQUEsTUFDUCxpQkFBaUI7QUFBQSxNQUNqQiwwQkFBMEI7QUFBQSxNQUMxQixtQkFBbUI7QUFBQSxJQUNyQjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsS0FBSztBQUFBLElBQ0gsY0FBYztBQUFBLElBQ2QscUJBQXFCO0FBQUEsTUFDbkIsS0FBSztBQUFBLFFBQ0gsU0FBUztBQUFBO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
