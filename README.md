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

### noDefaultPlugins

By default, `astro-datastar` uses `datastar` bundle which includes all official plugins. If you set `noDefaultPlugins` to `true`, then `astro-datastar` will load `datastar-core` bundle instead, which doesn't include any plugins.

```diff
  // astro.config.mjs
  import { defineConfig } from "astro/config";
  import datastar from "@pekochan069/astro-datastar";

  // https://astro.build/config
  export default defineConfig({
    integrations: [datastar({
+     noDefaultPlugin: true,
      ^^^^^^^^^^^^^^^^^^^^^^
    })],
  });
```

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

```js
// script/to/entrypoint.js
function customPlugin() {
    ...
}

export default (datastar) {
  datastar.load(
    customPlugin,
  )
}
```

If you set `noDefaultPlugins` to `true`, you can modify the snippet below to include only you are actually using.

```js
// entrypoint.js
import { DELETE } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/actions/delete";
import { GET } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/actions/get";
import { PATCH } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/actions/patch";
import { POST } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/actions/post";
import { PUT } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/actions/put";
import { Indicator } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/attributes/indicator";
import { ExecuteScript } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/watchers/executeScript";
import { MergeFragments } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/watchers/mergeFragments";
import { MergeSignals } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/watchers/mergeSignals";
import { RemoveFragments } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/watchers/removeFragments";
import { RemoveSignals } from "/node_modules/@starfederation/datastar/dist/plugins/official/backend/watchers/removeSignals";
import { Clipboard } from "/node_modules/@starfederation/datastar/dist/plugins/official/browser/actions/clipboard";
import { CustomValidity } from "/node_modules/@starfederation/datastar/dist/plugins/official/browser/attributes/customValidity";
import { Intersects } from "/node_modules/@starfederation/datastar/dist/plugins/official/browser/attributes/intersects";
import { Persist } from "/node_modules/@starfederation/datastar/dist/plugins/official/browser/attributes/persist";
import { ReplaceUrl } from "/node_modules/@starfederation/datastar/dist/plugins/official/browser/attributes/replaceUrl";
import { ScrollIntoView } from "/node_modules/@starfederation/datastar/dist/plugins/official/browser/attributes/scrollIntoView";
import { Show } from "/node_modules/@starfederation/datastar/dist/plugins/official/browser/attributes/show";
import { ViewTransition } from "/node_modules/@starfederation/datastar/dist/plugins/official/browser/attributes/viewTransition";
import { Attr } from "/node_modules/@starfederation/datastar/dist/plugins/official/dom/attributes/attr";
import { Bind } from "/node_modules/@starfederation/datastar/dist/plugins/official/dom/attributes/bind";
import { Class } from "/node_modules/@starfederation/datastar/dist/plugins/official/dom/attributes/class";
import { On } from "/node_modules/@starfederation/datastar/dist/plugins/official/dom/attributes/on";
import { Ref } from "/node_modules/@starfederation/datastar/dist/plugins/official/dom/attributes/ref";
import { Text } from "/node_modules/@starfederation/datastar/dist/plugins/official/dom/attributes/text";
import { Fit } from "/node_modules/@starfederation/datastar/dist/plugins/official/logic/actions/fit";
import { SetAll } from "/node_modules/@starfederation/datastar/dist/plugins/official/logic/actions/setAll";
import { ToggleAll } from "/node_modules/@starfederation/datastar/dist/plugins/official/logic/actions/toggleAll";

export default (datastar) => {
  datastar.load(
    DELETE,
    GET,
    PATCH,
    POST,
    PUT,
    Indicator,
    ExecuteScript,
    MergeFragments,
    MergeSignals,
    RemoveFragments,
    RemoveSignals,
    Clipboard,
    CustomValidity,
    Intersects,
    Persist,
    ReplaceUrl,
    ScrollIntoView,
    Show,
    ViewTransition,
    Attr,
    Bind,
    Class,
    On,
    Ref,
    Text,
    Fit,
    SetAll,
    ToggleAll,
  );
};
```

- [Astro Alpine Doc](https://docs.astro.build/en/guides/integrations-guide/alpinejs/#entrypoint)

## Astro

entrypoint part was copied from astro's alpine integration. Huge Thanks to the Astro team for creating such a wonderful framework!
