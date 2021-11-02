/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    globals: { 'ts-jest': { tsconfig: './tsconfig.json' } },
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    modulePaths: ['src'],
};
