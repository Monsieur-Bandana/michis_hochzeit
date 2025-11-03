// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: [
      "m-hochzeit-demo-840610411426.asia-southeast2.run.app",
      "michis-hochzeit-840610411426.asia-southeast2.run.app",
    ],
    host: true, // allow external connections
    port: 5173, // optional, default
  },
});
