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
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing prompt in request body"
      });
    }
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
      const defaultResponse = "No content could be generated.";
      let fallbackText = defaultResponse;
      if (prompt.toLowerCase().includes("youtube")) {
        fallbackText = [...fallbackData.youtube.plain_tags, ...fallbackData.youtube.hashtags].join(", ");
      } else if (prompt.toLowerCase().includes("instagram")) {
        fallbackText = fallbackData.instagram_hashtags.join(", ");
      } else if (prompt.toLowerCase().includes("tiktok")) {
        fallbackText = fallbackData.tiktok_hashtags.join(", ");
      } else {
        fallbackText = fallbackData.youtube.plain_tags.join(", ");
      }
      return res.status(200).json({
        text: fallbackText || defaultResponse
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
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["framer-motion", "lucide-react"],
          router: ["react-router-dom"]
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion", "lucide-react", "react-router-dom"]
  },
  server: {
    cors: true,
    headers: {
      "Cache-Control": "max-age=31536000"
    }
  },
  preview: {
    headers: {
      "Cache-Control": "max-age=31536000"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAiYXBpL2dlbmVyYXRlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL2NvZGUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2FwcC9jb2RlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcblxuLy8gTG9hZCAuZW52IGZpbGVcbmRvdGVudi5jb25maWcoKTtcblxuLy8gSW1wb3J0IHRoZSBoYW5kbGVyIGZ1bmN0aW9uXG5pbXBvcnQgYXBpSGFuZGxlciBmcm9tICcuL2FwaS9nZW5lcmF0ZS5qcyc7XG5cbi8vIEN1c3RvbSBWaXRlIHBsdWdpbiB0byBlbXVsYXRlIFZlcmNlbCdzIHNlcnZlcmxlc3MgZnVuY3Rpb25zIGluIGRldmVsb3BtZW50XG5mdW5jdGlvbiB2ZXJjZWxBcGlEZXZQbHVnaW4oKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZlcmNlbC1hcGktZGV2LXBsdWdpbicsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnL2FwaS9nZW5lcmF0ZScsIChyZXEsIHJlcykgPT4ge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICByZXEub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICAgICAgYm9keSArPSBjaHVuay50b1N0cmluZygpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmVxLm9uKCdlbmQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJyAmJiBib2R5KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICByZXEuYm9keSA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJlcS5ib2R5ID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcS5ib2R5ID0ge307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU2hpbSBFeHByZXNzLWxpa2UgcmVzIG1ldGhvZHMgb250byBOb2RlJ3MgbmF0aXZlIHJlcyBvYmplY3RcbiAgICAgICAgICByZXMuc3RhdHVzID0gKGNvZGUpID0+IHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gY29kZTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXMuanNvbiA9IChkYXRhKSA9PiB7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgIH07XG4gICAgICAgICAgXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGFwaUhhbmRsZXIocmVxLCByZXMpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbiBBUEkgaGFuZGxlciBtaWRkbGV3YXJlOicsIGVycm9yKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgdmVyY2VsQXBpRGV2UGx1Z2luKCldLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICB1aTogWydmcmFtZXItbW90aW9uJywgJ2x1Y2lkZS1yZWFjdCddLFxuICAgICAgICAgIHJvdXRlcjogWydyZWFjdC1yb3V0ZXItZG9tJ11cbiAgICAgICAgfSxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAnZnJhbWVyLW1vdGlvbicsICdsdWNpZGUtcmVhY3QnLCAncmVhY3Qtcm91dGVyLWRvbSddXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGNvcnM6IHRydWUsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbWF4LWFnZT0zMTUzNjAwMCdcbiAgICB9XG4gIH0sXG4gIHByZXZpZXc6IHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQ2FjaGUtQ29udHJvbCc6ICdtYXgtYWdlPTMxNTM2MDAwJ1xuICAgIH1cbiAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2FwcC9jb2RlL2FwaVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2FwcC9jb2RlL2FwaS9nZW5lcmF0ZS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2NvZGUvYXBpL2dlbmVyYXRlLmpzXCI7aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XG5cbi8vIEhlbHBlciB0byBnZXQgX19kaXJuYW1lIGluIEVTIG1vZHVsZXNcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgLy8gSW1tZWRpYXRlbHkgc2V0IEpTT04gY29udGVudC10eXBlXG4gIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cbiAgLy8gQmxvY2sgbm9uLVBPU1QgcmVxdWVzdHNcbiAgaWYgKHJlcS5tZXRob2QgIT09ICdQT1NUJykge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwNSkuanNvbih7XG4gICAgICBlcnJvcjogJ01ldGhvZCBOb3QgQWxsb3dlZCcsXG4gICAgICBtZXNzYWdlOiAnT25seSBQT1NUIHJlcXVlc3RzIGFyZSBzdXBwb3J0ZWQnXG4gICAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHsgcHJvbXB0IH0gPSByZXEuYm9keTtcblxuICAgIGlmICghcHJvbXB0KSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xuICAgICAgICBlcnJvcjogJ0JhZCBSZXF1ZXN0JyxcbiAgICAgICAgbWVzc2FnZTogJ01pc3NpbmcgcHJvbXB0IGluIHJlcXVlc3QgYm9keSdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgbGlzdCBvZiBtb2RlbHMgdG8gdHJ5IGluIG9yZGVyIG9mIHByZWZlcmVuY2VcbiAgICBjb25zdCBtb2RlbHNUb1RyeSA9IFtcbiAgICAgIFwibWlzdHJhbGFpL21pc3RyYWwtN2ItaW5zdHJ1Y3RcIixcbiAgICAgIFwibWV0YS1sbGFtYS9sbGFtYS0zLThiLWluc3RydWN0XCIsXG4gICAgICBcImdvb2dsZS9nZW1pbmktZmxhc2gtMS41XCIsXG4gICAgICBcImFudGhyb3BpYy9jbGF1ZGUtMy1oYWlrdVwiXG4gICAgXTtcblxuICAgIGxldCBnZW5lcmF0ZWRUZXh0ID0gbnVsbDtcbiAgICBsZXQgbGFzdEVycm9yID0gbnVsbDtcblxuICAgIGZvciAoY29uc3QgbW9kZWwgb2YgbW9kZWxzVG9UcnkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBBdHRlbXB0aW5nIHRvIGdlbmVyYXRlIGNvbnRlbnQgd2l0aCBtb2RlbDogJHttb2RlbH1gKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcImh0dHBzOi8vb3BlbnJvdXRlci5haS9hcGkvdjEvY2hhdC9jb21wbGV0aW9uc1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7cHJvY2Vzcy5lbnYuT1BFTlJPVVRFUl9BUElfS0VZfWAsXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBtb2RlbDogbW9kZWwsXG4gICAgICAgICAgICBtZXNzYWdlczogW3sgcm9sZTogXCJ1c2VyXCIsIGNvbnRlbnQ6IHByb21wdCB9XVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICBjb25zdCBlcnJvckRhdGEgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7IC8vIFVzZSAudGV4dCgpIGZvciBiZXR0ZXIgZXJyb3IgZGV0YWlsc1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQVBJIGVycm9yIHdpdGggJHttb2RlbH06ICR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9IC0gJHtlcnJvckRhdGF9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBpZiAoZGF0YS5jaG9pY2VzICYmIGRhdGEuY2hvaWNlcy5sZW5ndGggPiAwICYmIGRhdGEuY2hvaWNlc1swXS5tZXNzYWdlICYmIGRhdGEuY2hvaWNlc1swXS5tZXNzYWdlLmNvbnRlbnQpIHtcbiAgICAgICAgICBnZW5lcmF0ZWRUZXh0ID0gZGF0YS5jaG9pY2VzWzBdLm1lc3NhZ2UuY29udGVudDtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgU3VjY2Vzc2Z1bGx5IGdlbmVyYXRlZCBjb250ZW50IHdpdGggbW9kZWw6ICR7bW9kZWx9YCk7XG4gICAgICAgICAgYnJlYWs7IC8vIEV4aXQgbG9vcCBpZiBzdWNjZXNzZnVsXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBUEkgcmVzcG9uc2UgZnJvbSAke21vZGVsfSBtaXNzaW5nIGNvbnRlbnQgb3IgdW5leHBlY3RlZCBzdHJ1Y3R1cmUuYCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHdpdGggbW9kZWwgJHttb2RlbH06YCwgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIGxhc3RFcnJvciA9IGVycm9yOyAvLyBTdG9yZSB0aGUgbGFzdCBlcnJvclxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChnZW5lcmF0ZWRUZXh0KSB7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICB0ZXh0OiBnZW5lcmF0ZWRUZXh0XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgYWxsIG1vZGVscyBmYWlsLCBmYWxsIGJhY2sgdG8gdGhlIGxvY2FsIEpTT04gZmlsZVxuICAgICAgY29uc29sZS53YXJuKFwiQWxsIE9wZW5Sb3V0ZXIgbW9kZWxzIGZhaWxlZC4gRmFsbGluZyBiYWNrIHRvIGxvY2FsIGZhbGxiYWNrLmpzb24uXCIpO1xuICAgICAgY29uc3QgZmFsbGJhY2tQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZhbGxiYWNrLmpzb24nKTtcbiAgICAgIGNvbnN0IGZhbGxiYWNrQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmYWxsYmFja1BhdGgsICd1dGYtOCcpO1xuICAgICAgY29uc3QgZmFsbGJhY2tEYXRhID0gSlNPTi5wYXJzZShmYWxsYmFja0NvbnRlbnQpO1xuICAgICAgXG4gICAgICBjb25zdCBkZWZhdWx0UmVzcG9uc2UgPSBcIk5vIGNvbnRlbnQgY291bGQgYmUgZ2VuZXJhdGVkLlwiO1xuICAgICAgXG4gICAgICBsZXQgZmFsbGJhY2tUZXh0ID0gZGVmYXVsdFJlc3BvbnNlO1xuICAgICAgaWYgKHByb21wdC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCd5b3V0dWJlJykpIHtcbiAgICAgICAgZmFsbGJhY2tUZXh0ID0gWy4uLmZhbGxiYWNrRGF0YS55b3V0dWJlLnBsYWluX3RhZ3MsIC4uLmZhbGxiYWNrRGF0YS55b3V0dWJlLmhhc2h0YWdzXS5qb2luKCcsICcpO1xuICAgICAgfSBlbHNlIGlmIChwcm9tcHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnaW5zdGFncmFtJykpIHtcbiAgICAgICAgZmFsbGJhY2tUZXh0ID0gZmFsbGJhY2tEYXRhLmluc3RhZ3JhbV9oYXNodGFncy5qb2luKCcsICcpO1xuICAgICAgfSBlbHNlIGlmIChwcm9tcHQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygndGlrdG9rJykpIHtcbiAgICAgICAgZmFsbGJhY2tUZXh0ID0gZmFsbGJhY2tEYXRhLnRpa3Rva19oYXNodGFncy5qb2luKCcsICcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmFsbGJhY2tUZXh0ID0gZmFsbGJhY2tEYXRhLnlvdXR1YmUucGxhaW5fdGFncy5qb2luKCcsICcpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICB0ZXh0OiBmYWxsYmFja1RleHQgfHwgZGVmYXVsdFJlc3BvbnNlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdGaW5hbCBlcnJvciBpbiBnZW5lcmF0ZS5qczonLCBlcnJvcik7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtcbiAgICAgIGVycm9yOiAnSW50ZXJuYWwgU2VydmVyIEVycm9yJyxcbiAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQgZHVyaW5nIGNvbnRlbnQgZ2VuZXJhdGlvbi4nXG4gICAgfSk7XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNk0sU0FBUyxvQkFBb0I7QUFDMU8sT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTs7O0FDRmdNLE9BQU8sUUFBUTtBQUNsTyxPQUFPLFVBQVU7QUFDakIsU0FBUyxxQkFBcUI7QUFGaUcsSUFBTSwyQ0FBMkM7QUFLaEwsSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLEtBQUssUUFBUSxVQUFVO0FBRXpDLGVBQU8sUUFBK0IsS0FBSyxLQUFLO0FBRTlDLE1BQUksVUFBVSxnQkFBZ0Isa0JBQWtCO0FBR2hELE1BQUksSUFBSSxXQUFXLFFBQVE7QUFDekIsV0FBTyxJQUFJLE9BQU8sR0FBRyxFQUFFLEtBQUs7QUFBQSxNQUMxQixPQUFPO0FBQUEsTUFDUCxTQUFTO0FBQUEsSUFDWCxDQUFDO0FBQUEsRUFDSDtBQUVBLE1BQUk7QUFDRixVQUFNLEVBQUUsT0FBTyxJQUFJLElBQUk7QUFFdkIsUUFBSSxDQUFDLFFBQVE7QUFDWCxhQUFPLElBQUksT0FBTyxHQUFHLEVBQUUsS0FBSztBQUFBLFFBQzFCLE9BQU87QUFBQSxRQUNQLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQSxJQUNIO0FBR0EsVUFBTSxjQUFjO0FBQUEsTUFDbEI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBRUEsUUFBSSxnQkFBZ0I7QUFDcEIsUUFBSSxZQUFZO0FBRWhCLGVBQVcsU0FBUyxhQUFhO0FBQy9CLFVBQUk7QUFDRixnQkFBUSxJQUFJLDhDQUE4QyxLQUFLLEVBQUU7QUFDakUsY0FBTSxXQUFXLE1BQU0sTUFBTSxpREFBaUQ7QUFBQSxVQUM1RSxRQUFRO0FBQUEsVUFDUixTQUFTO0FBQUEsWUFDUCxpQkFBaUIsVUFBVSxRQUFRLElBQUksa0JBQWtCO0FBQUEsWUFDekQsZ0JBQWdCO0FBQUEsVUFDbEI7QUFBQSxVQUNBLE1BQU0sS0FBSyxVQUFVO0FBQUEsWUFDbkI7QUFBQSxZQUNBLFVBQVUsQ0FBQyxFQUFFLE1BQU0sUUFBUSxTQUFTLE9BQU8sQ0FBQztBQUFBLFVBQzlDLENBQUM7QUFBQSxRQUNILENBQUM7QUFFRCxZQUFJLENBQUMsU0FBUyxJQUFJO0FBQ2hCLGdCQUFNLFlBQVksTUFBTSxTQUFTLEtBQUs7QUFDdEMsZ0JBQU0sSUFBSSxNQUFNLGtCQUFrQixLQUFLLEtBQUssU0FBUyxNQUFNLElBQUksU0FBUyxVQUFVLE1BQU0sU0FBUyxFQUFFO0FBQUEsUUFDckc7QUFFQSxjQUFNLE9BQU8sTUFBTSxTQUFTLEtBQUs7QUFDakMsWUFBSSxLQUFLLFdBQVcsS0FBSyxRQUFRLFNBQVMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxFQUFFLFdBQVcsS0FBSyxRQUFRLENBQUMsRUFBRSxRQUFRLFNBQVM7QUFDekcsMEJBQWdCLEtBQUssUUFBUSxDQUFDLEVBQUUsUUFBUTtBQUN4QyxrQkFBUSxJQUFJLDhDQUE4QyxLQUFLLEVBQUU7QUFDakU7QUFBQSxRQUNGLE9BQU87QUFDTCxnQkFBTSxJQUFJLE1BQU0scUJBQXFCLEtBQUssMkNBQTJDO0FBQUEsUUFDdkY7QUFBQSxNQUNGLFNBQVMsT0FBTztBQUNkLGdCQUFRLE1BQU0sb0JBQW9CLEtBQUssS0FBSyxNQUFNLE9BQU87QUFDekQsb0JBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUVBLFFBQUksZUFBZTtBQUNqQixhQUFPLElBQUksT0FBTyxHQUFHLEVBQUUsS0FBSztBQUFBLFFBQzFCLE1BQU07QUFBQSxNQUNSLENBQUM7QUFBQSxJQUNILE9BQU87QUFFTCxjQUFRLEtBQUssb0VBQW9FO0FBQ2pGLFlBQU0sZUFBZSxLQUFLLEtBQUssV0FBVyxlQUFlO0FBQ3pELFlBQU0sa0JBQWtCLEdBQUcsYUFBYSxjQUFjLE9BQU87QUFDN0QsWUFBTSxlQUFlLEtBQUssTUFBTSxlQUFlO0FBRS9DLFlBQU0sa0JBQWtCO0FBRXhCLFVBQUksZUFBZTtBQUNuQixVQUFJLE9BQU8sWUFBWSxFQUFFLFNBQVMsU0FBUyxHQUFHO0FBQzVDLHVCQUFlLENBQUMsR0FBRyxhQUFhLFFBQVEsWUFBWSxHQUFHLGFBQWEsUUFBUSxRQUFRLEVBQUUsS0FBSyxJQUFJO0FBQUEsTUFDakcsV0FBVyxPQUFPLFlBQVksRUFBRSxTQUFTLFdBQVcsR0FBRztBQUNyRCx1QkFBZSxhQUFhLG1CQUFtQixLQUFLLElBQUk7QUFBQSxNQUMxRCxXQUFXLE9BQU8sWUFBWSxFQUFFLFNBQVMsUUFBUSxHQUFHO0FBQ2xELHVCQUFlLGFBQWEsZ0JBQWdCLEtBQUssSUFBSTtBQUFBLE1BQ3ZELE9BQU87QUFDTCx1QkFBZSxhQUFhLFFBQVEsV0FBVyxLQUFLLElBQUk7QUFBQSxNQUMxRDtBQUVBLGFBQU8sSUFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLO0FBQUEsUUFDMUIsTUFBTSxnQkFBZ0I7QUFBQSxNQUN4QixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBRUYsU0FBUyxPQUFPO0FBQ2QsWUFBUSxNQUFNLCtCQUErQixLQUFLO0FBQ2xELFdBQU8sSUFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLO0FBQUEsTUFDMUIsT0FBTztBQUFBLE1BQ1AsU0FBUyxNQUFNLFdBQVc7QUFBQSxJQUM1QixDQUFDO0FBQUEsRUFDSDtBQUNGOzs7QUQxR0EsT0FBTyxPQUFPO0FBTWQsU0FBUyxxQkFBcUI7QUFDNUIsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sZ0JBQWdCLFFBQVE7QUFDdEIsYUFBTyxZQUFZLElBQUksaUJBQWlCLENBQUMsS0FBSyxRQUFRO0FBQ3BELFlBQUksT0FBTztBQUNYLFlBQUksR0FBRyxRQUFRLFdBQVM7QUFDdEIsa0JBQVEsTUFBTSxTQUFTO0FBQUEsUUFDekIsQ0FBQztBQUNELFlBQUksR0FBRyxPQUFPLFlBQVk7QUFDeEIsY0FBSSxJQUFJLFdBQVcsVUFBVSxNQUFNO0FBQ2pDLGdCQUFJO0FBQ0Ysa0JBQUksT0FBTyxLQUFLLE1BQU0sSUFBSTtBQUFBLFlBQzVCLFNBQVMsR0FBRztBQUNWLGtCQUFJLE9BQU8sQ0FBQztBQUFBLFlBQ2Q7QUFBQSxVQUNGLE9BQU87QUFDTCxnQkFBSSxPQUFPLENBQUM7QUFBQSxVQUNkO0FBR0EsY0FBSSxTQUFTLENBQUMsU0FBUztBQUNyQixnQkFBSSxhQUFhO0FBQ2pCLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksT0FBTyxDQUFDLFNBQVM7QUFDbkIsZ0JBQUksVUFBVSxnQkFBZ0Isa0JBQWtCO0FBQ2hELGdCQUFJLElBQUksS0FBSyxVQUFVLElBQUksQ0FBQztBQUM1QixtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJO0FBQ0Ysa0JBQU0sUUFBVyxLQUFLLEdBQUc7QUFBQSxVQUMzQixTQUFTLE9BQU87QUFDZCxvQkFBUSxNQUFNLG9DQUFvQyxLQUFLO0FBQ3ZELGdCQUFJLE9BQU8sR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLHdCQUF3QixDQUFDO0FBQUEsVUFDekQ7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNILENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGO0FBSUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztBQUFBLEVBQ3ZDLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGNBQWM7QUFBQSxJQUNkLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM3QixJQUFJLENBQUMsaUJBQWlCLGNBQWM7QUFBQSxVQUNwQyxRQUFRLENBQUMsa0JBQWtCO0FBQUEsUUFDN0I7QUFBQSxRQUNBLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxTQUFTLGFBQWEsaUJBQWlCLGdCQUFnQixrQkFBa0I7QUFBQSxFQUNyRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLE1BQ1AsaUJBQWlCO0FBQUEsSUFDbkI7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxTQUFTO0FBQUEsTUFDUCxpQkFBaUI7QUFBQSxJQUNuQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
