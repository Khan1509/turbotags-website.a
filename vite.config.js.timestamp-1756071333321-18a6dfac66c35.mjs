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
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }]
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
        if (platform === "youtube") {
          const tags = fallbackData.youtube.plain_tags.slice(0, 15);
          const hashtags = fallbackData.youtube.hashtags.slice(0, 15);
          fallbackText = `TAGS:[${tags.join(",")}]HASHTAGS:[${hashtags.join(",")}]`;
        } else if (platform === "instagram") {
          fallbackText = fallbackData.instagram_hashtags.slice(0, 15).join(", ");
        } else if (platform === "tiktok") {
          fallbackText = fallbackData.tiktok_hashtags.slice(0, 15).join(", ");
        } else if (platform === "facebook") {
          fallbackText = fallbackData.facebook_hashtags.slice(0, 15).join(", ");
        } else {
          const tags = fallbackData.youtube.plain_tags.slice(0, 15);
          const hashtags = fallbackData.youtube.hashtags.slice(0, 15);
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
      server.middlewares.use("/api/generate", (req, res) => {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          if (req.method === "POST" && body) {
            try {
              req.body = JSON.parse(body);
            } catch (e) {
              req.body = {};
            }
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
          try {
            await handler(req, res);
          } catch (error) {
            console.error("Error in API handler middleware:", error);
            res.status(500).json({ error: "Internal Server Error" });
          }
        });
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
    chunkSizeWarningLimit: 1e3,
    // Warn for chunks larger than 1MB
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAiYXBpL2dlbmVyYXRlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcblxuLy8gTG9hZCAuZW52IGZpbGVcbmRvdGVudi5jb25maWcoKTtcblxuLy8gSW1wb3J0IHRoZSBoYW5kbGVyIGZ1bmN0aW9uXG5pbXBvcnQgYXBpSGFuZGxlciBmcm9tICcuL2FwaS9nZW5lcmF0ZS5qcyc7XG5cbi8vIEN1c3RvbSBWaXRlIHBsdWdpbiB0byBlbXVsYXRlIFZlcmNlbCdzIHNlcnZlcmxlc3MgZnVuY3Rpb25zIGluIGRldmVsb3BtZW50XG5mdW5jdGlvbiB2ZXJjZWxBcGlEZXZQbHVnaW4oKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZlcmNlbC1hcGktZGV2LXBsdWdpbicsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL2FwaS9nZW5lcmF0ZScsIChyZXEsIHJlcykgPT4ge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICByZXEub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgICAgYm9keSArPSBjaHVuay50b1N0cmluZygpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVxLm9uKCdlbmQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJyAmJiBib2R5KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXEuYm9keSA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJlcS5ib2R5ID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcS5ib2R5ID0ge307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU2hpbSBFeHByZXNzLWxpa2UgcmVzIG1ldGhvZHMgb250byBOb2RlJ3MgbmF0aXZlIHJlcyBvYmplY3RcbiAgICAgICAgICByZXMuc3RhdHVzID0gKGNvZGUpID0+IHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gY29kZTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXMuanNvbiA9IChkYXRhKSA9PiB7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgIH07XG4gICAgICAgICAgXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGFwaUhhbmRsZXIocmVxLCByZXMpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbiBBUEkgaGFuZGxlciBtaWRkbGV3YXJlOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgdmVyY2VsQXBpRGV2UGx1Z2luKCldLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzMjAxNScsIC8vIEJldHRlciBjb21wYXRpYmlsaXR5IHdoaWxlIHN0aWxsIG1vZGVyblxuICAgIG1pbmlmeTogJ2VzYnVpbGQnLCAvLyBGYXN0ZXIgYnVpbGQgdGltZXNcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsIC8vIFdhcm4gZm9yIGNodW5rcyBsYXJnZXIgdGhhbiAxTUJcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgLy8gQ29yZSBSZWFjdCBjaHVua3NcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0JykgfHwgaWQuaW5jbHVkZXMoJ3JlYWN0LWRvbScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAncmVhY3QtdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3Qtcm91dGVyLWRvbScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAncm91dGVyJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZnJhbWVyLW1vdGlvbicpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnYW5pbWF0aW9ucyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ2x1Y2lkZS1yZWFjdCcpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnaWNvbnMnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdmaXJlYmFzZScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnZmlyZWJhc2UnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gR3JvdXAgYWxsIG90aGVyIHZlbmRvciBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gU3BsaXQgcGFnZXMgaW50byBzZXBhcmF0ZSBjaHVua3NcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9wYWdlcy8nKSkge1xuICAgICAgICAgICAgcmV0dXJuICdwYWdlcyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL2NvbXBvbmVudHMvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnY29tcG9uZW50cyc7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF0nXG4gICAgICB9LFxuICAgICAgZXh0ZXJuYWw6IFtdIC8vIEtlZXAgYWxsIGRlcGVuZGVuY2llcyBidW5kbGVkIGZvciBiZXR0ZXIgY2FjaGluZ1xuICAgIH0sXG4gICAgLy8gT3B0aW1pemUgQ1NTXG4gICAgY3NzTWluaWZ5OiB0cnVlLFxuICAgIC8vIEJldHRlciB0cmVlIHNoYWtpbmdcbiAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UgLy8gRmFzdGVyIGJ1aWxkc1xuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncmVhY3QnLFxuICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAnZnJhbWVyLW1vdGlvbicsXG4gICAgICAnbHVjaWRlLXJlYWN0J1xuICAgIF0sXG4gICAgZXhjbHVkZTogWydmaXJlYmFzZSddIC8vIExldCBmaXJlYmFzZSBiZSBkeW5hbWljYWxseSBpbXBvcnRlZFxuICB9LFxuICAvLyBQZXJmb3JtYW5jZSBvcHRpbWl6YXRpb25zXG4gIHNlcnZlcjoge1xuICAgIGNvcnM6IHRydWUsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbWF4LWFnZT0zMTUzNjAwMCcsXG4gICAgICAnWC1Db250ZW50LVR5cGUtT3B0aW9ucyc6ICdub3NuaWZmJyxcbiAgICAgICdYLUZyYW1lLU9wdGlvbnMnOiAnREVOWScsXG4gICAgICAnWC1YU1MtUHJvdGVjdGlvbic6ICcxOyBtb2RlPWJsb2NrJ1xuICAgIH1cbiAgfSxcbiAgcHJldmlldzoge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDYWNoZS1Db250cm9sJzogJ21heC1hZ2U9MzE1MzYwMDAsIGltbXV0YWJsZScsXG4gICAgICAnWC1Db250ZW50LVR5cGUtT3B0aW9ucyc6ICdub3NuaWZmJyxcbiAgICAgICdYLUZyYW1lLU9wdGlvbnMnOiAnREVOWSdcbiAgICB9XG4gIH0sXG4gIC8vIENTUyBvcHRpbWl6YXRpb25cbiAgY3NzOiB7XG4gICAgZGV2U291cmNlbWFwOiBmYWxzZSxcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBjc3M6IHtcbiAgICAgICAgY2hhcnNldDogZmFsc2UgLy8gUmVtb3ZlIGNoYXJzZXQgZnJvbSBDU1NcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9hcHAvY29kZS9hcGlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvY29kZS9hcGkvZ2VuZXJhdGUuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL2FwaS9nZW5lcmF0ZS5qc1wiO2ltcG9ydCBmcyBmcm9tICdub2RlOmZzJztcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuXG4vLyBIZWxwZXIgdG8gZ2V0IF9fZGlybmFtZSBpbiBFUyBtb2R1bGVzXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gIC8vIEltbWVkaWF0ZWx5IHNldCBKU09OIGNvbnRlbnQtdHlwZVxuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gIC8vIEJsb2NrIG5vbi1QT1NUIHJlcXVlc3RzXG4gIGlmIChyZXEubWV0aG9kICE9PSAnUE9TVCcpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDUpLmpzb24oe1xuICAgICAgZXJyb3I6ICdNZXRob2QgTm90IEFsbG93ZWQnLFxuICAgICAgbWVzc2FnZTogJ09ubHkgUE9TVCByZXF1ZXN0cyBhcmUgc3VwcG9ydGVkJ1xuICAgIH0pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7IHByb21wdCwgcGxhdGZvcm0gPSAneW91dHViZScsIGxhbmd1YWdlID0gJ2VuZ2xpc2gnLCByZWdpb24gPSAnZ2xvYmFsJyB9ID0gcmVxLmJvZHk7XG5cbiAgICBpZiAoIXByb21wdCkge1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcbiAgICAgICAgZXJyb3I6ICdCYWQgUmVxdWVzdCcsXG4gICAgICAgIG1lc3NhZ2U6ICdNaXNzaW5nIHByb21wdCBpbiByZXF1ZXN0IGJvZHknXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgQVBJIFJlcXVlc3QgLSBQbGF0Zm9ybTogJHtwbGF0Zm9ybX0sIExhbmd1YWdlOiAke2xhbmd1YWdlfSwgUmVnaW9uOiAke3JlZ2lvbn1gKTtcblxuICAgIC8vIERlZmluZSB0aGUgbGlzdCBvZiBtb2RlbHMgdG8gdHJ5IGluIG9yZGVyIG9mIHByZWZlcmVuY2VcbiAgICBjb25zdCBtb2RlbHNUb1RyeSA9IFtcbiAgICAgIFwibWlzdHJhbGFpL21pc3RyYWwtN2ItaW5zdHJ1Y3RcIixcbiAgICAgIFwibWV0YS1sbGFtYS9sbGFtYS0zLThiLWluc3RydWN0XCIsXG4gICAgICBcImdvb2dsZS9nZW1pbmktZmxhc2gtMS41XCIsXG4gICAgICBcImFudGhyb3BpYy9jbGF1ZGUtMy1oYWlrdVwiXG4gICAgXTtcblxuICAgIGxldCBnZW5lcmF0ZWRUZXh0ID0gbnVsbDtcbiAgICBsZXQgbGFzdEVycm9yID0gbnVsbDtcblxuICAgIGZvciAoY29uc3QgbW9kZWwgb2YgbW9kZWxzVG9UcnkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBBdHRlbXB0aW5nIHRvIGdlbmVyYXRlIGNvbnRlbnQgd2l0aCBtb2RlbDogJHttb2RlbH1gKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHBzOi8vb3BlbnJvdXRlci5haS9hcGkvdjEvY2hhdC9jb21wbGV0aW9uc1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7cHJvY2Vzcy5lbnYuT1BFTlJPVVRFUl9BUElfS0VZfWAsXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBtb2RlbDogbW9kZWwsXG4gICAgICAgICAgICBtZXNzYWdlczogW3sgcm9sZTogXCJ1c2VyXCIsIGNvbnRlbnQ6IHByb21wdCB9XVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICBjb25zdCBlcnJvckRhdGEgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7IC8vIFVzZSAudGV4dCgpIGZvciBiZXR0ZXIgZXJyb3IgZGV0YWlsc1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQVBJIGVycm9yIHdpdGggJHttb2RlbH06ICR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9IC0gJHtlcnJvckRhdGF9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBpZiAoZGF0YS5jaG9pY2VzICYmIGRhdGEuY2hvaWNlcy5sZW5ndGggPiAwICYmIGRhdGEuY2hvaWNlc1swXS5tZXNzYWdlICYmIGRhdGEuY2hvaWNlc1swXS5tZXNzYWdlLmNvbnRlbnQpIHtcbiAgICAgICAgICBnZW5lcmF0ZWRUZXh0ID0gZGF0YS5jaG9pY2VzWzBdLm1lc3NhZ2UuY29udGVudDtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGdlbmVyYXRlZCBjb250ZW50IHdpdGggbW9kZWw6ICR7bW9kZWx9YCk7XG4gICAgICAgICAgYnJlYWs7IC8vIEV4aXQgbG9vcCBpZiBzdWNjZXNzZnVsXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBUEkgcmVzcG9uc2UgZnJvbSAke21vZGVsfSBtaXNzaW5nIGNvbnRlbnQgb3IgdW5leHBlY3RlZCBzdHJ1Y3R1cmUuYCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHdpdGggbW9kZWwgJHttb2RlbH06YCwgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIGxhc3RFcnJvciA9IGVycm9yOyAvLyBTdG9yZSB0aGUgbGFzdCBlcnJvclxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChnZW5lcmF0ZWRUZXh0KSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICB0ZXh0OiBnZW5lcmF0ZWRUZXh0XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgYWxsIG1vZGVscyBmYWlsLCBmYWxsIGJhY2sgdG8gdGhlIGxvY2FsIEpTT04gZmlsZVxuICAgICAgY29uc29sZS53YXJuKFwiQWxsIE9wZW5Sb3V0ZXIgbW9kZWxzIGZhaWxlZC4gRmFsbGluZyBiYWNrIHRvIGxvY2FsIGZhbGxiYWNrLmpzb24uXCIpO1xuICAgICAgY29uc3QgZmFsbGJhY2tQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZhbGxiYWNrLmpzb24nKTtcbiAgICAgIGNvbnN0IGZhbGxiYWNrQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmYWxsYmFja1BhdGgsICd1dGYtOCcpO1xuICAgICAgY29uc3QgZmFsbGJhY2tEYXRhID0gSlNPTi5wYXJzZShmYWxsYmFja0NvbnRlbnQpO1xuXG4gICAgICBsZXQgZmFsbGJhY2tUZXh0ID0gXCJcIjtcblxuICAgICAgLy8gSGFuZGxlIG11bHRpbGluZ3VhbCBmYWxsYmFjayBjb250ZW50XG4gICAgICBpZiAobGFuZ3VhZ2UgIT09ICdlbmdsaXNoJyAmJiBmYWxsYmFja0RhdGEubXVsdGlsaW5ndWFsICYmIGZhbGxiYWNrRGF0YS5tdWx0aWxpbmd1YWxbbGFuZ3VhZ2VdKSB7XG4gICAgICAgIGNvbnN0IGxhbmdEYXRhID0gZmFsbGJhY2tEYXRhLm11bHRpbGluZ3VhbFtsYW5ndWFnZV07XG4gICAgICAgIGlmIChwbGF0Zm9ybSA9PT0gJ3lvdXR1YmUnKSB7XG4gICAgICAgICAgY29uc3QgdGFncyA9IGxhbmdEYXRhLnRhZ3Muc2xpY2UoMCwgMTUpO1xuICAgICAgICAgIGNvbnN0IGhhc2h0YWdzID0gbGFuZ0RhdGEuaGFzaHRhZ3Muc2xpY2UoMCwgMTUpO1xuICAgICAgICAgIGZhbGxiYWNrVGV4dCA9IGBUQUdTOlske3RhZ3Muam9pbignLCcpfV1IQVNIVEFHUzpbJHtoYXNodGFncy5qb2luKCcsJyl9XWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZmFsbGJhY2tUZXh0ID0gbGFuZ0RhdGEuaGFzaHRhZ3Muc2xpY2UoMCwgMTUpLmpvaW4oJywgJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEVuZ2xpc2ggZmFsbGJhY2tcbiAgICAgICAgaWYgKHBsYXRmb3JtID09PSAneW91dHViZScpIHtcbiAgICAgICAgICBjb25zdCB0YWdzID0gZmFsbGJhY2tEYXRhLnlvdXR1YmUucGxhaW5fdGFncy5zbGljZSgwLCAxNSk7XG4gICAgICAgICAgY29uc3QgaGFzaHRhZ3MgPSBmYWxsYmFja0RhdGEueW91dHViZS5oYXNodGFncy5zbGljZSgwLCAxNSk7XG4gICAgICAgICAgZmFsbGJhY2tUZXh0ID0gYFRBR1M6WyR7dGFncy5qb2luKCcsJyl9XUhBU0hUQUdTOlske2hhc2h0YWdzLmpvaW4oJywnKX1dYDtcbiAgICAgICAgfSBlbHNlIGlmIChwbGF0Zm9ybSA9PT0gJ2luc3RhZ3JhbScpIHtcbiAgICAgICAgICBmYWxsYmFja1RleHQgPSBmYWxsYmFja0RhdGEuaW5zdGFncmFtX2hhc2h0YWdzLnNsaWNlKDAsIDE1KS5qb2luKCcsICcpO1xuICAgICAgICB9IGVsc2UgaWYgKHBsYXRmb3JtID09PSAndGlrdG9rJykge1xuICAgICAgICAgIGZhbGxiYWNrVGV4dCA9IGZhbGxiYWNrRGF0YS50aWt0b2tfaGFzaHRhZ3Muc2xpY2UoMCwgMTUpLmpvaW4oJywgJyk7XG4gICAgICAgIH0gZWxzZSBpZiAocGxhdGZvcm0gPT09ICdmYWNlYm9vaycpIHtcbiAgICAgICAgICBmYWxsYmFja1RleHQgPSBmYWxsYmFja0RhdGEuZmFjZWJvb2tfaGFzaHRhZ3Muc2xpY2UoMCwgMTUpLmpvaW4oJywgJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRGVmYXVsdCBmYWxsYmFja1xuICAgICAgICAgIGNvbnN0IHRhZ3MgPSBmYWxsYmFja0RhdGEueW91dHViZS5wbGFpbl90YWdzLnNsaWNlKDAsIDE1KTtcbiAgICAgICAgICBjb25zdCBoYXNodGFncyA9IGZhbGxiYWNrRGF0YS55b3V0dWJlLmhhc2h0YWdzLnNsaWNlKDAsIDE1KTtcbiAgICAgICAgICBmYWxsYmFja1RleHQgPSBgVEFHUzpbJHt0YWdzLmpvaW4oJywnKX1dSEFTSFRBR1M6WyR7aGFzaHRhZ3Muam9pbignLCcpfV1gO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgIHRleHQ6IGZhbGxiYWNrVGV4dCxcbiAgICAgICAgZmFsbGJhY2s6IHRydWUsXG4gICAgICAgIG1lc3NhZ2U6IGBVc2luZyAke2xhbmd1YWdlfSBmYWxsYmFjayBjb250ZW50IGR1ZSB0byBBUEkgdW5hdmFpbGFiaWxpdHlgXG4gICAgICB9KTtcbiAgICB9XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdGaW5hbCBlcnJvciBpbiBnZW5lcmF0ZS5qczonLCBlcnJvcik7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIGVycm9yOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyxcbiAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQgZHVyaW5nIGNvbnRlbnQgZ2VuZXJhdGlvbi4nXG4gICAgfSk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNk0sU0FBUyxvQkFBb0I7QUFDMU8sT0FBTyxXQUFXO0FBQ2xCLE9B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
