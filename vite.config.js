import { defineConfig } from 'vite'
import path from 'path'

const aliasesStrings = ['js', 'scss'];

const aliases = {};
aliasesStrings.forEach(alias => {
    aliases[`@${alias}`] = path.resolve(__dirname, `src/${alias}/`);
});

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
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
