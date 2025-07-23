import { defineConfig } from 'vite'
import path from 'path'
import templateCfg from './template.config.js'
import modules from './imports.js'

const makeAliases = (aliases) => {
	return Object.entries(aliases).reduce((acc, [key, value]) => {
		acc[key] = path.resolve(process.cwd(), value)
		return acc
	}, {})
}

const aliases = makeAliases(templateCfg.aliases)

const ignoredDirs = [
	'vendor', 'node_modules', 'plugins', 'dist', '.git', 'documentation', 'fonts-convert'
]
const ignoredFiles = ['package.json', 'yarn.lock', 'snippets.json', 'README.md']


export default defineConfig({
	plugins: [
		modules.vituum(),
		modules.posthtml({
			encoding: 'utf-8',
			root: process.cwd(),
			plugins: [
				modules.expressions(),
				modules.beautify({ rules: { blankLines: '', sortAttrs: true }, }),
			],
		}),

		// Hot Module Replacement
		{
			name: 'custom-hmr',
			enforce: 'post',
			handleHotUpdate({ file, server }) {
				if (file.endsWith('.html') || file.endsWith('.php')) {
					server.ws.send({ type: 'full-reload', path: '*' })
				}
			},
		},

	],

	// CSS preprocessor
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
				sourceMap: true,
				quietDeps: true,
			},
		},
	},

	// Server config
	server: {
		host: '0.0.0.0',
		watch: {
			ignored: [
				...ignoredDirs.map(dir => `**/${dir}/**`),
				...ignoredFiles.map(file => `**/${file}/**`),
			],
		}
	},

	resolve: {
		alias: { ...aliases },
	},

	build: {
		// Output directory
		outDir: 'dist',

		// Generate manifest file for production
		manifest: false,

		// Configure rollup options
		rollupOptions: {

			output: {
				entryFileNames: 'js/[name].js',
				chunkFileNames: 'js/[name].js',
				assetFileNames: (assetInfo) => {
					if (assetInfo.name.endsWith('.css')) {
						return 'css/[name][extname]'
					}
					return 'assets/[name][extname]'
				}
			}
		}
	},
})
