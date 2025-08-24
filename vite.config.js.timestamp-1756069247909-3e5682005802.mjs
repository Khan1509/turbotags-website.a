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
      const defaultResponse = "TAGS:[content creation,social media,digital marketing,viral content,audience engagement]HASHTAGS:[#ContentCreator,#SocialMedia,#DigitalMarketing,#ViralContent,#Engagement]";
      let fallbackText = defaultResponse;
      if (prompt.toLowerCase().includes("youtube")) {
        const tags = fallbackData.youtube.plain_tags.slice(0, 15);
        const hashtags = fallbackData.youtube.hashtags.slice(0, 15);
        fallbackText = `TAGS:[${tags.join(",")}]HASHTAGS:[${hashtags.join(",")}]`;
      } else if (prompt.toLowerCase().includes("instagram")) {
        fallbackText = fallbackData.instagram_hashtags.slice(0, 15).join(", ");
      } else if (prompt.toLowerCase().includes("tiktok")) {
        fallbackText = fallbackData.tiktok_hashtags.slice(0, 15).join(", ");
      } else {
        fallbackText = defaultResponse;
      }
      return res.status(200).json({
        text: fallbackText,
        fallback: true,
        message: "Using fallback content due to API unavailability"
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
        manualChunks: {
          // Core React chunks
          "react-vendor": ["react", "react-dom"],
          "router": ["react-router-dom"],
          // UI library chunks
          "animations": ["framer-motion"],
          "icons": ["lucide-react"],
          // Firebase chunk (if used)
          "firebase": ["firebase/app", "firebase/analytics"]
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAiYXBpL2dlbmVyYXRlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcblxuLy8gTG9hZCAuZW52IGZpbGVcbmRvdGVudi5jb25maWcoKTtcblxuLy8gSW1wb3J0IHRoZSBoYW5kbGVyIGZ1bmN0aW9uXG5pbXBvcnQgYXBpSGFuZGxlciBmcm9tICcuL2FwaS9nZW5lcmF0ZS5qcyc7XG5cbi8vIEN1c3RvbSBWaXRlIHBsdWdpbiB0byBlbXVsYXRlIFZlcmNlbCdzIHNlcnZlcmxlc3MgZnVuY3Rpb25zIGluIGRldmVsb3BtZW50XG5mdW5jdGlvbiB2ZXJjZWxBcGlEZXZQbHVnaW4oKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZlcmNlbC1hcGktZGV2LXBsdWdpbicsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL2FwaS9nZW5lcmF0ZScsIChyZXEsIHJlcykgPT4ge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICByZXEub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgICAgYm9keSArPSBjaHVuay50b1N0cmluZygpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVxLm9uKCdlbmQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJyAmJiBib2R5KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXEuYm9keSA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJlcS5ib2R5ID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcS5ib2R5ID0ge307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU2hpbSBFeHByZXNzLWxpa2UgcmVzIG1ldGhvZHMgb250byBOb2RlJ3MgbmF0aXZlIHJlcyBvYmplY3RcbiAgICAgICAgICByZXMuc3RhdHVzID0gKGNvZGUpID0+IHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gY29kZTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXMuanNvbiA9IChkYXRhKSA9PiB7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgIH07XG4gICAgICAgICAgXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGFwaUhhbmRsZXIocmVxLCByZXMpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbiBBUEkgaGFuZGxlciBtaWRkbGV3YXJlOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgdmVyY2VsQXBpRGV2UGx1Z2luKCldLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzMjAxNScsIC8vIEJldHRlciBjb21wYXRpYmlsaXR5IHdoaWxlIHN0aWxsIG1vZGVyblxuICAgIG1pbmlmeTogJ2VzYnVpbGQnLCAvLyBGYXN0ZXIgYnVpbGQgdGltZXNcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsIC8vIFdhcm4gZm9yIGNodW5rcyBsYXJnZXIgdGhhbiAxTUJcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgLy8gQ29yZSBSZWFjdCBjaHVua3NcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAncm91dGVyJzogWydyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgLy8gVUkgbGlicmFyeSBjaHVua3NcbiAgICAgICAgICAnYW5pbWF0aW9ucyc6IFsnZnJhbWVyLW1vdGlvbiddLFxuICAgICAgICAgICdpY29ucyc6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgICAgICAgLy8gRmlyZWJhc2UgY2h1bmsgKGlmIHVzZWQpXG4gICAgICAgICAgJ2ZpcmViYXNlJzogWydmaXJlYmFzZS9hcHAnLCAnZmlyZWJhc2UvYW5hbHl0aWNzJ10sXG4gICAgICAgIH0sXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XSdcbiAgICAgIH0sXG4gICAgICBleHRlcm5hbDogW10gLy8gS2VlcCBhbGwgZGVwZW5kZW5jaWVzIGJ1bmRsZWQgZm9yIGJldHRlciBjYWNoaW5nXG4gICAgfSxcbiAgICAvLyBPcHRpbWl6ZSBDU1NcbiAgICBjc3NNaW5pZnk6IHRydWUsXG4gICAgLy8gQmV0dGVyIHRyZWUgc2hha2luZ1xuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSAvLyBGYXN0ZXIgYnVpbGRzXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICdyZWFjdCcsXG4gICAgICAncmVhY3QtZG9tJyxcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcbiAgICAgICdmcmFtZXItbW90aW9uJyxcbiAgICAgICdsdWNpZGUtcmVhY3QnXG4gICAgXSxcbiAgICBleGNsdWRlOiBbJ2ZpcmViYXNlJ10gLy8gTGV0IGZpcmViYXNlIGJlIGR5bmFtaWNhbGx5IGltcG9ydGVkXG4gIH0sXG4gIC8vIFBlcmZvcm1hbmNlIG9wdGltaXphdGlvbnNcbiAgc2VydmVyOiB7XG4gICAgY29yczogdHJ1ZSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQ2FjaGUtQ29udHJvbCc6ICdtYXgtYWdlPTMxNTM2MDAwJyxcbiAgICAgICdYLUNvbnRlbnQtVHlwZS1PcHRpb25zJzogJ25vc25pZmYnLFxuICAgICAgJ1gtRnJhbWUtT3B0aW9ucyc6ICdERU5ZJyxcbiAgICAgICdYLVhTUy1Qcm90ZWN0aW9uJzogJzE7IG1vZGU9YmxvY2snXG4gICAgfVxuICB9LFxuICBwcmV2aWV3OiB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbWF4LWFnZT0zMTUzNjAwMCwgaW1tdXRhYmxlJyxcbiAgICAgICdYLUNvbnRlbnQtVHlwZS1PcHRpb25zJzogJ25vc25pZmYnLFxuICAgICAgJ1gtRnJhbWUtT3B0aW9ucyc6ICdERU5ZJ1xuICAgIH1cbiAgfSxcbiAgLy8gQ1NTIG9wdGltaXphdGlvblxuICBjc3M6IHtcbiAgICBkZXZTb3VyY2VtYXA6IGZhbHNlLFxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIGNzczoge1xuICAgICAgICBjaGFyc2V0OiBmYWxzZSAvLyBSZW1vdmUgY2hhcnNldCBmcm9tIENTU1xuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL2FwaVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC9jb2RlL2FwaS9nZW5lcmF0ZS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvYXBpL2dlbmVyYXRlLmpzXCI7aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XG5cbi8vIEhlbHBlciB0byBnZXQgX19kaXJuYW1lIGluIEVTIG1vZHVsZXNcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgLy8gSW1tZWRpYXRlbHkgc2V0IEpTT04gY29udGVudC10eXBlXG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cbiAgLy8gQmxvY2sgbm9uLVBPU1QgcmVxdWVzdHNcbiAgaWYgKHJlcS5tZXRob2QgIT09ICdQT1NUJykge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwNSkuanNvbih7XG4gICAgICBlcnJvcjogJ01ldGhvZCBOb3QgQWxsb3dlZCcsXG4gICAgICBtZXNzYWdlOiAnT25seSBQT1NUIHJlcXVlc3RzIGFyZSBzdXBwb3J0ZWQnXG4gICAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHsgcHJvbXB0LCBwbGF0Zm9ybSA9ICd5b3V0dWJlJywgbGFuZ3VhZ2UgPSAnZW5nbGlzaCcsIHJlZ2lvbiA9ICdnbG9iYWwnIH0gPSByZXEuYm9keTtcblxuICAgIGlmICghcHJvbXB0KSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICBlcnJvcjogJ0JhZCBSZXF1ZXN0JyxcbiAgICAgICAgbWVzc2FnZTogJ01pc3NpbmcgcHJvbXB0IGluIHJlcXVlc3QgYm9keSdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGBBUEkgUmVxdWVzdCAtIFBsYXRmb3JtOiAke3BsYXRmb3JtfSwgTGFuZ3VhZ2U6ICR7bGFuZ3VhZ2V9LCBSZWdpb246ICR7cmVnaW9ufWApO1xuXG4gICAgLy8gRGVmaW5lIHRoZSBsaXN0IG9mIG1vZGVscyB0byB0cnkgaW4gb3JkZXIgb2YgcHJlZmVyZW5jZVxuICAgIGNvbnN0IG1vZGVsc1RvVHJ5ID0gW1xuICAgICAgXCJtaXN0cmFsYWkvbWlzdHJhbC03Yi1pbnN0cnVjdFwiLFxuICAgICAgXCJtZXRhLWxsYW1hL2xsYW1hLTMtOGItaW5zdHJ1Y3RcIixcbiAgICAgIFwiZ29vZ2xlL2dlbWluaS1mbGFzaC0xLjVcIixcbiAgICAgIFwiYW50aHJvcGljL2NsYXVkZS0zLWhhaWt1XCJcbiAgICBdO1xuXG4gICAgbGV0IGdlbmVyYXRlZFRleHQgPSBudWxsO1xuICAgIGxldCBsYXN0RXJyb3IgPSBudWxsO1xuXG4gICAgZm9yIChjb25zdCBtb2RlbCBvZiBtb2RlbHNUb1RyeSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc29sZS5sb2coYEF0dGVtcHRpbmcgdG8gZ2VuZXJhdGUgY29udGVudCB3aXRoIG1vZGVsOiAke21vZGVsfWApO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9vcGVucm91dGVyLmFpL2FwaS92MS9jaGF0L2NvbXBsZXRpb25zXCIsIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHtwcm9jZXNzLmVudi5PUEVOUk9VVEVSX0FQSV9LRVl9YCxcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIG1vZGVsOiBtb2RlbCxcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBbeyByb2xlOiBcInVzZXJcIiwgY29udGVudDogcHJvbXB0IH1dXG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgIGNvbnN0IGVycm9yRGF0YSA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTsgLy8gVXNlIC50ZXh0KCkgZm9yIGJldHRlciBlcnJvciBkZXRhaWxzXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBUEkgZXJyb3Igd2l0aCAke21vZGVsfTogJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH0gLSAke2Vycm9yRGF0YX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIGlmIChkYXRhLmNob2ljZXMgJiYgZGF0YS5jaG9pY2VzLmxlbmd0aCA+IDAgJiYgZGF0YS5jaG9pY2VzWzBdLm1lc3NhZ2UgJiYgZGF0YS5jaG9pY2VzWzBdLm1lc3NhZ2UuY29udGVudCkge1xuICAgICAgICAgIGdlbmVyYXRlZFRleHQgPSBkYXRhLmNob2ljZXNbMF0ubWVzc2FnZS5jb250ZW50O1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBTdWNjZXNzZnVsbHkgZ2VuZXJhdGVkIGNvbnRlbnQgd2l0aCBtb2RlbDogJHttb2RlbH1gKTtcbiAgICAgICAgICBicmVhazsgLy8gRXhpdCBsb29wIGlmIHN1Y2Nlc3NmdWxcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFQSSByZXNwb25zZSBmcm9tICR7bW9kZWx9IG1pc3NpbmcgY29udGVudCBvciB1bmV4cGVjdGVkIHN0cnVjdHVyZS5gKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3Igd2l0aCBtb2RlbCAke21vZGVsfTpgLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgbGFzdEVycm9yID0gZXJyb3I7IC8vIFN0b3JlIHRoZSBsYXN0IGVycm9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGdlbmVyYXRlZFRleHQpIHtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgIHRleHQ6IGdlbmVyYXRlZFRleHRcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBhbGwgbW9kZWxzIGZhaWwsIGZhbGwgYmFjayB0byB0aGUgbG9jYWwgSlNPTiBmaWxlXG4gICAgICBjb25zb2xlLndhcm4oXCJBbGwgT3BlblJvdXRlciBtb2RlbHMgZmFpbGVkLiBGYWxsaW5nIGJhY2sgdG8gbG9jYWwgZmFsbGJhY2suanNvbi5cIik7XG4gICAgICBjb25zdCBmYWxsYmFja1BhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZmFsbGJhY2suanNvbicpO1xuICAgICAgY29uc3QgZmFsbGJhY2tDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZhbGxiYWNrUGF0aCwgJ3V0Zi04Jyk7XG4gICAgICBjb25zdCBmYWxsYmFja0RhdGEgPSBKU09OLnBhcnNlKGZhbGxiYWNrQ29udGVudCk7XG5cbiAgICAgIGNvbnN0IGRlZmF1bHRSZXNwb25zZSA9IFwiVEFHUzpbY29udGVudCBjcmVhdGlvbixzb2NpYWwgbWVkaWEsZGlnaXRhbCBtYXJrZXRpbmcsdmlyYWwgY29udGVudCxhdWRpZW5jZSBlbmdhZ2VtZW50XUhBU0hUQUdTOlsjQ29udGVudENyZWF0b3IsI1NvY2lhbE1lZGlhLCNEaWdpdGFsTWFya2V0aW5nLCNWaXJhbENvbnRlbnQsI0VuZ2FnZW1lbnRdXCI7XG5cbiAgICAgIGxldCBmYWxsYmFja1RleHQgPSBkZWZhdWx0UmVzcG9uc2U7XG4gICAgICBpZiAocHJvbXB0LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3lvdXR1YmUnKSkge1xuICAgICAgICAvLyBGb3JtYXQgZm9yIFlvdVR1YmUgd2l0aCBib3RoIHRhZ3MgYW5kIGhhc2h0YWdzXG4gICAgICAgIGNvbnN0IHRhZ3MgPSBmYWxsYmFja0RhdGEueW91dHViZS5wbGFpbl90YWdzLnNsaWNlKDAsIDE1KTtcbiAgICAgICAgY29uc3QgaGFzaHRhZ3MgPSBmYWxsYmFja0RhdGEueW91dHViZS5oYXNodGFncy5zbGljZSgwLCAxNSk7XG4gICAgICAgIGZhbGxiYWNrVGV4dCA9IGBUQUdTOlske3RhZ3Muam9pbignLCcpfV1IQVNIVEFHUzpbJHtoYXNodGFncy5qb2luKCcsJyl9XWA7XG4gICAgICB9IGVsc2UgaWYgKHByb21wdC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdpbnN0YWdyYW0nKSkge1xuICAgICAgICBmYWxsYmFja1RleHQgPSBmYWxsYmFja0RhdGEuaW5zdGFncmFtX2hhc2h0YWdzLnNsaWNlKDAsIDE1KS5qb2luKCcsICcpO1xuICAgICAgfSBlbHNlIGlmIChwcm9tcHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygndGlrdG9rJykpIHtcbiAgICAgICAgZmFsbGJhY2tUZXh0ID0gZmFsbGJhY2tEYXRhLnRpa3Rva19oYXNodGFncy5zbGljZSgwLCAxNSkuam9pbignLCAnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZhbGxiYWNrVGV4dCA9IGRlZmF1bHRSZXNwb25zZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgdGV4dDogZmFsbGJhY2tUZXh0LFxuICAgICAgICBmYWxsYmFjazogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogXCJVc2luZyBmYWxsYmFjayBjb250ZW50IGR1ZSB0byBBUEkgdW5hdmFpbGFiaWxpdHlcIlxuICAgICAgfSk7XG4gICAgfVxuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRmluYWwgZXJyb3IgaW4gZ2VuZXJhdGUuanM6JywgZXJyb3IpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XG4gICAgICBlcnJvcjogJ0ludGVybmFsIFNlcnZlciBFcnJvcicsXG4gICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8ICdBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkIGR1cmluZyBjb250ZW50IGdlbmVyYXRpb24uJ1xuICAgIH0pO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZNLFNBQVMsb0JBQW9CO0FBQzFPLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7OztBQ0ZnTSxPQUFPLFFBQVE7QUFDbE8sT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBRmlHLElBQU0sMkNBQTJDO0FBS2hMLElBQU0sYUFBYSxjQUFjLHdDQUFlO0FBQ2hELElBQU0sWUFBWSxLQUFLLFFBQVEsVUFBVTtBQUV6QyxlQUFPLFFBQStCLEtBQUssS0FBSztBQUU5QyxNQUFJLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUdoRCxNQUFJLElBQUksV0FBVyxRQUFRO0FBQ3pCLFdBQU8sSUFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLO0FBQUEsTUFDMUIsT0FBTztBQUFBLE1BQ1AsU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVB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
