// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/*.test.ts"],
}

module.exports = createJestConfig(customJestConfig)
