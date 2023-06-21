/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testNamePattern: ["**/tests/**/(*.)+(test|spec).[tj]s?(x)"],
};