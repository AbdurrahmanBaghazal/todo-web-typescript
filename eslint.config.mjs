import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  globalIgnores([".next/**", "node_modules/**", "out/**", "next-env.d.ts"])
];

export default eslintConfig;
