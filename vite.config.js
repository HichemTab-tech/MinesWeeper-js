import { defineConfig } from 'vite'
import path from 'path'

const aliasesStrings = ['js', 'scss'];

const aliases = {};
aliasesStrings.forEach(alias => {
    aliases[`@minesweeper/${alias}`] = path.resolve(__dirname, `src/${alias}/`);
});

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            input: path.resolve(__dirname, 'index.html'),
            output: {
                entryFileNames: `assets/[name].[hash].js`
            }
        }
    },
    server: {
        port: 5000
    },
    resolve: {
        alias: {
            ...aliases
        }
    },
    optimizeDeps: {
        include: ['main.js']
    }
});
