import { resolve } from "node:path";
import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";

type DatastarPluginKeys =
	| "delete"
	| "get"
	| "patch"
	| "post"
	| "put"
	| "indicator"
	| "executeScript"
	| "mergeFragments"
	| "mergeSignals"
	| "removeFragments"
	| "removeSignals"
	| "clipboard"
	| "customValidity"
	| "intersects"
	| "persist"
	| "replaceUrl"
	| "scrollIntoView"
	| "show"
	| "viewTransition"
	| "attr"
	| "bind"
	| "class"
	| "on"
	| "ref"
	| "text"
	| "fit"
	| "setAll"
	| "toggleAll";

type DatastarPlugin = {
	location: string;
	import: string;
};

// biome-ignore format:
const availableDatastarPlugins: Map<DatastarPluginKeys, DatastarPlugin> = new Map([
	["delete", { location: "backend/actions/delete", import: "DELETE" }] as const,
	["get", { location: "backend/actions/get", import: "GET" }] as const,
	["patch", { location: "backend/actions/patch", import: "PATCH" }] as const,
	["post", { location: "backend/actions/post", import: "POST" }] as const,
	["put", { location: "backend/actions/put", import: "PUT" }] as const,
	["indicator", { location: "backend/attributes/indicator", import: "Indicator" }] as const,
	["executeScript", { location: "backend/watchers/executeScript", import: "ExecuteScript" }] as const,
	["mergeFragments", { location: "backend/watchers/mergeFragments", import: "MergeFragments" }] as const,
	["mergeSignals", { location: "backend/watchers/mergeSignals", import: "MergeSignals" }] as const,
	["removeFragments", { location: "backend/watchers/removeFragments", import: "RemoveFragments" }] as const,
	["removeSignals", { location: "backend/watchers/removeSignals", import: "RemoveSignals" }] as const,
	["clipboard", { location: "browser/actions/clipboard", import: "Clipboard" }] as const,
	["customValidity", { location: "browser/attributes/customValidity", import: "CustomValidity" }] as const,
	["intersects", { location: "browser/attributes/intersects", import: "Intersects" }] as const,
	["persist", { location: "browser/attributes/persist", import: "Persist" }] as const,
	["replaceUrl", { location: "browser/attributes/replaceUrl", import: "ReplaceUrl" }] as const,
	["scrollIntoView", { location: "browser/attributes/scrollIntoView", import: "ScrollIntoView" }] as const,
	["show", { location: "browser/attributes/show", import: "Show" }] as const,
	["viewTransition", { location: "browser/attributes/viewTransition", import: "ViewTransition" }] as const,
	["attr", { location: "dom/attributes/attr", import: "Attr" }] as const,
	["bind", { location: "dom/attributes/bind", import: "Bind" }] as const,
	["class", { location: "dom/attributes/class", import: "Class" }] as const,
	["on", { location: "dom/attributes/on", import: "On" }] as const,
	["ref", { location: "dom/attributes/ref", import: "Ref" }] as const,
	["text", { location: "dom/attributes/text", import: "Text" }] as const,
	["fit", { location: "logic/actions/fit", import: "Fit" }] as const,
	["setAll", { location: "logic/actions/setAll", import: "SetAll" }] as const,
	["toggleAll", { location: "logic/actions/toggleAll", import: "ToggleAll" }] as const,	
])

type Options = {
	/**
	 * If not specified, astro-datastar will load all official plugins.
	 * If specified, only plugins listed on this field will be loaded.
	 * This field will be ignored when `noDefaultPlugin` is set to `true`.
	 */
	plugins?: DatastarPluginKeys[];
	/**
	 * If set to `true`, no default plugins will be activated. Use with
	 * `entrypoint`.
	 */
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

function getPlugins(options?: Options) {
	if (options?.noDefaultPlugins) {
		return "";
	}

	let plugins = "";

	if (options?.plugins !== undefined) {
		const pluginsSet = new Set(options.plugins);
		pluginsSet.forEach((key) => {
			const plugin = availableDatastarPlugins.get(key);
			if (!plugin) {
				return;
			}

			plugins += `import {${plugin.import}} from "/node_modules/@starfederation/datastar/dist/plugins/official/${plugin.location}";\n`;
		});
		plugins += "Datastar.load(";
		pluginsSet.forEach((key) => {
			const plugin = availableDatastarPlugins.get(key);
			if (!plugin) {
				return;
			}

			plugins += `${plugin.import},`;
		});
		plugins += ");";
	} else {
		availableDatastarPlugins.forEach((plugin) => {
			plugins += `import {${plugin.import}} from "/node_modules/@starfederation/datastar/dist/plugins/official/${plugin.location}";\n`;
		});
		plugins += "Datastar.load(";
		availableDatastarPlugins.forEach((plugin) => {
			plugins += `${plugin.import},`;
		});
		plugins += ");";
	}

	return plugins;
}

function createScript(options?: Options) {
	if (options?.plugins === undefined && options?.noDefaultPlugins !== true) {
		return `\
import { Datastar } from "/node_modules/@starfederation/datastar/dist/datastar.js";
import { setup } from "virtual:astro-datastar/entrypoint";
setup(Datastar);
document.addEventListener("astro:after-swap", () => {
	Datastar.apply(document.body);
});
window.Datastar = Datastar;
`;
	}
	return `\
import { Datastar } from "/node_modules/@starfederation/datastar/dist/datastar-core.js";
import { setup } from "virtual:astro-datastar/entrypoint";
${getPlugins(options)}
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
	if ("default" in mod) {
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
