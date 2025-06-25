import cProcess from "child_process";
import process from "process";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import svgr from "@svgr/rollup";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";

export default defineConfig(() => {
  const date = new Date().toISOString();
  const commit = cProcess
    .execSync("git rev-parse HEAD || echo UNKNOWN")
    .toString()
    .trim();

  process.env.VITE_APP_NAME = pkg.name;
  process.env.VITE_APP_VERSION = pkg.version;
  process.env.VITE_BUILD_DATE = date;
  process.env.VITE_BUILD_COMMIT = commit;

  return {
    base: "./",
    clearScreen: false,
    plugins: [
      react(),
      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: "eslint \"./src/**/*.{ts,tsx,js,jsx}\"",
        },
        overlay: {
          initialIsOpen: false,
        },
      }),
      svgr({
        ref: true,
        memo: true,
        icon: true,
        svgProps: {
          focusable: "false",
          "aria-hidden": "true",
          fill: "currentColor",
        },
      }),
    ],
  };
});
