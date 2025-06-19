import type { Config } from "react-router";

export default {
  ssr: false,
  future: {
    unstable_optimizeDeps: true,
  },
  buildDirectory: "./build",
} satisfies Config;