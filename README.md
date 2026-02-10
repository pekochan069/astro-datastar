# astro-datastar

This astro integration lets you use [Datastar](https://data-star.dev/) in your project.

## How to use

First install `datastar` and `astro-datastar` packages.

```sh
npm install @pekochan069/astro-datastar
```

```sh
bun add @pekochan069/astro-datastar
```

```sh
pnpm add @pekochan069/astro-datastar
```

```sh
deno add npm:@starfederation/datastar npm:@pekochan069/astro-datastar
```

```sh
yarn add @pekochan069/astro-datastar
```

After installation, you need to add `astro-datastar` to your Astro configuration file.

```diff
  // astro.config.mjs
  import { defineConfig } from "astro/config";
+ import datastar from "@pekochan069/astro-datastar";

  // https://astro.build/config
  export default defineConfig({
+   integrations: [datastar()],
                   ^^^^^^^^^^
  });
```

## Configuration

### entrypoint

Similar to [@astrojs/alpinejs](https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs), `astro-datastar` supports custom entrypoint. With custom entrypoint, you have full control over which plugins are included, use custom plugins, etc.

```diff
  // astro.config.mjs
  import { defineConfig } from "astro/config";
  import datastar from "@pekochan069/astro-datastar";

  // https://astro.build/config
  export default defineConfig({
    integrations: [datastar({
+     entrypoint: "/script/to/entrypoint.js",
      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    })],
  });
```

- [Astro Alpine Doc](https://docs.astro.build/en/guides/integrations-guide/alpinejs/#entrypoint)

## Astro

entrypoint part was copied from astro's alpine integration. Huge Thanks to the Astro team for creating such a wonderful framework!
