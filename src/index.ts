import { resolve } from "node:path";
import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";

type Options = {
	noDefaultPlugins?: boolean;
	/**
	 * Configure Datastar using custom entrypoint
	 * ```js
	 * // astro.config.mjs
	 * import { defineConfig } from "astro/config";
	 * import datastar from "@pekochan069/astro-datastar";
	 *
	 * // https://astro.build/config
	 * export default defineConfig({
	 *   integrations: [datastar({
	 * 	   entrypoint: "./src/entrypoint.js",
	 *   })],
	 * });
	 * ```
	 *
	 * Then create entrypoint file like this:
	 *
	 * ```js
	 * // src/entrypoint.js
	 * export default function setup(datastar) {
	 *   datastar.load(
	 *     customPlugin,
	 *   )
	 * }
	 * ```
	 */
	entrypoint?: string;
};

function createScript(options?: Options) {
	const datastarImport = options?.noDefaultPlugins
		? "datastar-core"
		: "datastar";

	return `\
import { Datastar } from "/node_modules/@starfederation/datastar/dist/${datastarImport}.js";
import { setup } from "virtual:astro-datastar/entrypoint";
setup(Datastar);
document.addEventListener("astro:after-swap", () => {
  Datastar.apply(document.body);
});
window.Datastar = Datastar;
`;
}

function virtualEntrypoint(options?: Options): Plugin {
	const virtualModuleId = "virtual:astro-datastar/entrypoint";
	const resolvedVirtualModuleId = `\0${virtualModuleId}`;

	let isBuild: boolean;
	let root: string;
	let entrypoint: string | undefined;

	return {
		name: "astro-datastar:virtual-entrypoint",
		config(_, { command }) {
			isBuild = command === "build";
		},
		configResolved(config) {
			root = config.root;
			if (options?.entrypoint) {
				entrypoint = options.entrypoint.startsWith(".")
					? resolve(root, options.entrypoint)
					: options.entrypoint;
			}
		},
		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},
		load(id) {
			if (id === resolvedVirtualModuleId) {
				if (entrypoint) {
					return `\
import * as mod from ${JSON.stringify(entrypoint)};

export const setup = (Datastar) => {
	if ('default' in mod) {
		mod.default(Datastar);
	} else {
		${
			!isBuild
				? `console.warn("[astro-datastar] entrypoint \`" + ${JSON.stringify(
						entrypoint,
					)} + "\` does not export a default function.");`
				: ""
		}
	}
}`;
				}
				return "export const setup = () => {};";
			}
		},
	};
}

/**
 * Astro Datastar integration
 *
 * @param options
 * @returns AstroIntegration
 * @example
 * ```js
 * // astro.config.mjs
 * import { defineConfig } from "astro/config";
 * import datastar from "@pekochan069/astro-datastar";
 *
 * // https://astro.build/config
 * export default defineConfig({
 *   integrations: [datastar()],
 * });
 * ```
 */
export default function datastar(options?: Options): AstroIntegration {
	const script = createScript(options);

	return {
		name: "astro-datastar",
		hooks: {
			"astro:config:setup": ({ injectScript, updateConfig }) => {
				injectScript("page", script);
				updateConfig({
					vite: {
						plugins: [virtualEntrypoint(options)],
					},
				});
			},
		},
	};
}
