# Common Utils

This package provides utility methods for common operations which cover a wide
range of use cases and helps in avoiding writing boilerplate code.

## Install

```sh
npm install @b613/utils
```

## Libraries

| Module                          | Documentation                                  |
| ------------------------------- | ---------------------------------------------- |
| `@b613/utils/lib/array`         | [src/array.d.ts](src/array.d.ts)               |
| `@b613/utils/lib/CircularList`  | [src/CircularList.d.ts](src/CircularList.d.ts) |
| `@b613/utils/lib/client`        | [src/client.d.ts](src/client.d.ts)             |
| `@b613/utils/lib/color`         | [src/color.d.ts](src/color.d.ts)               |
| `@b613/utils/lib/http`          | [src/http.d.ts](src/http.d.ts)                 |
| `@b613/utils/lib/image`         | [src/image.d.ts](src/image.d.ts)               |
| `@b613/utils/lib/number`        | [src/number.d.ts](src/number.d.ts)             |
| `@b613/utils/lib/object`        | [src/object.d.ts](src/object.d.ts)             |
| `@b613/utils/lib/ping`          | [src/ping.d.ts](src/ping.d.ts)                 |
| `@b613/utils/lib/promise`       | [src/promise.d.ts](src/promise.d.ts)           |
| `@b613/utils/lib/qs`            | [src/qs.d.ts](src/qs.d.ts)                     |
| `@b613/utils/lib/regex`         | [src/regex.d.ts](src/regex.d.ts)               |
| `@b613/utils/lib/schema`        | [src/schema.d.ts](src/schema.d.ts)             |
| `@b613/utils/lib/Server`        | [src/Server.d.ts](src/Server.d.ts)             |
| `@b613/utils/lib/string`        | [src/string.d.ts](src/string.d.ts)             |
| `@b613/utils/lib/Trace`         | [src/Trace.d.ts](src/Trace.d.ts)               |

## Development Setup

1. [Install Nix Package Manager](https://nixos.org/manual/nix/stable/installation/installing-binary.html)

2. [Install `direnv` with your OS package manager](https://direnv.net/docs/installation.html#from-system-packages)

3. [Hook it `direnv` into your shell](https://direnv.net/docs/hook.html)

4. At the top-level of your project run:

   ```sh
   direnv allow
   ```

   The next time your launch your terminal and enter the top-level of your
   project, `direnv` will check for changes.

## License

Under the MIT license.
See [LICENSE](https://gitlab.com/demsking/xutils/blob/main/LICENSE) file for
more details.
