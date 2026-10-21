import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  // Existing data-fetch effects predate the React Compiler lint rules.
  { rules: { "react-hooks/set-state-in-effect": "warn" } },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
