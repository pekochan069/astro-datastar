# Changelog

## v0.2.0

### Changes

- You can now specify plugins in config file using `plugins` option. This option will be ignored when `noDefaultPlugins` is set to `true`.

```diff
  // astro.config.mjs
  import { defineConfig } from "astro/config";
  import datastar from "@pekochan069/astro-datastar";

  // https://astro.build/config
  export default defineConfig({
    integrations: [datastar({
+     plugins: ["on", "clipboard"],
      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    })],
  });
```
