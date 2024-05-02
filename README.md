# Common Utils

[![npm](https://img.shields.io/npm/v/@b613/utils.svg)](https://www.npmjs.com/package/@b613/utils)
[![Build status](https://gitlab.com/demsking/xutils/badges/main/pipeline.svg)](https://gitlab.com/demsking/xutils/pipelines)
[![Test coverage](https://gitlab.com/demsking/xutils/badges/main/coverage.svg)](https://gitlab.com/demsking/xutils/pipelines)
[![Buy me a beer](https://img.shields.io/badge/Buy%20me-a%20beer-1f425f.svg)](https://www.buymeacoffee.com/demsking)

This package provides utility methods for common operations which cover a wide
range of use cases and helps in avoiding writing boilerplate code.

## Install

```sh
npm install @b613/utils
```

**Install Peer Dependencies by needed modules**

| Module                | Peer Dependencies                                  |
| --------------------- | -------------------------------------------------- |
| `@b613/utils/color`   | `npm install cli-color` (only for Node.js usage)   |
| `@b613/utils/image`   | `npm install image-downloader sharp`               |
| `@b613/utils/server`  | `npm install body-parser express morgan`           |

## Libraries

| Module                | Browser | Node.js | Documentation                                                                              |
| --------------------- | ------- | ------- | ------------------------------------------------------------------------------------------ |
| `@b613/utils/array`   |    🗸    |    🗸    | [array.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/array.d.ts)               |
| `@b613/utils/clist`   |    🗸    |    🗸    | [CircularList.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/CircularList.d.ts) |
| `@b613/utils/client`  |    🗸    |    🗸    | [client.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/client.d.ts)             |
| `@b613/utils/color`   |    🗸    |    🗸    | [color.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/color.d.ts)               |
| `@b613/utils/http`    |    🗸    |    🗸    | [color.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/http.d.ts)                |
| `@b613/utils/image`   |    🗸    |    🗸    | [image.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/image.d.ts)               |
| `@b613/utils/number`  |    🗸    |    🗸    | [number.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/number.d.ts)             |
| `@b613/utils/object`  |    🗸    |    🗸    | [object.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/object.d.ts)             |
| `@b613/utils/ping`    |         |    🗸    | [ping.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/ping.d.ts)                 |
| `@b613/utils/promise` |    🗸    |    🗸    | [promise.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/promise.d.ts)           |
| `@b613/utils/qs`      |    🗸    |    🗸    | [qs.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/qs.d.ts)                     |
| `@b613/utils/regex`   |    🗸    |    🗸    | [regex.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/regex.d.ts)               |
| `@b613/utils/schema`  |    🗸    |    🗸    | [schema.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/schema.d.ts)             |
| `@b613/utils/server`  |         |    🗸    | [Server.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/server.d.ts)             |
| `@b613/utils/string`  |    🗸    |    🗸    | [string.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/string.d.ts)             |
| `@b613/utils/trace`   |    🗸    |    🗸    | [trace.d.ts](https://gitlab.com/demsking/xutils/-/blob/main/src/trace.d.ts)               |

## Development Setup

1. [Install The Determinate Nix Installer](https://github.com/DeterminateSystems/nix-installer)

2. [Install `direnv` with your OS package manager](https://direnv.net/docs/installation.html#from-system-packages)

3. [Hook it `direnv` into your shell](https://direnv.net/docs/hook.html)

4. **Load environment**

   At the top-level of your project run:

   ```sh
   direnv allow
   ```

5. **Install dependencies**

   ```sh
   make install
   ```

6. **Start dev environment**

   ```sh
   make env
   ```

   This will starts a preconfigured Tmux session.
   Please see the [.tmuxinator.yml](.tmuxinator.yml) file.

## License

Under the MIT license.
See [LICENSE](https://gitlab.com/demsking/xutils/blob/main/LICENSE) file for
more details.
