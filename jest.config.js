/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }] },
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
};
module.exports = config;
