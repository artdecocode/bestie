# bestie

%NPM: bestie%

`bestie` is a Node.js package to build Node.js packages with `import` and `export` statements. The goal of this project is to start with using the babel AST parsing to build packages to allow functionality, however then to implement a regular expression transform stream which would update references to `import` into `require` statements. The motivation for this is that a modern Node.js package would only need a single babel transform to allow imports and exports, however all babel dependencies need to be installed and linked (around 5500 dependencies). Also, when transpiling, babel transform will use `requireInterop` expression which VS Code IDE cannot parse, and the JSDoc documentation disappears from all functions _etc_ not exported in the main file.

```sh
yarn add -DE bestie
```

## Table Of Contents

%TOC%

### CLI

To [`install bestie`](t), you need to clone its repository in the working directory, and install it with the dev dependencies from there. Then, `yarn link` it, and again in other projects.

```sh
cd ~/work
git clone https://github.com/artdecocode/bestie.git
cd bestie
yarn
link
cd ..
cd project
yarn link bestie
```

Because the all dependencies that the babel needs are in the bestie directory, they will be used. No need to install them for each individual project.

<!-- Despite this, the process still seems hack-ish and therefore the real aim is to use regular expressions-->

The usage via the CLI is encouraged and can be achieved by specifying a `script` field in the [`package.json`](t) file, e.g.,

```json
{
  "name": "package",
  "scripts": {
    "build": "b"
  },
  "dependencies": {
    "bestie": "2.0.0"
  }
}
```

#### `--init`, `-i`: Init .Babelrc

Create a `.babelrc` file in the current direcory. The default content is:

%EXAMPLE: .babelrc, json%

#### `--help`, `-h`: Show Help

%FORK-sh src/bin/register -h%

#### `b [src] [--out-dir=build]`: Build Project

The `b` binary will build the project, taking the files from the `src` directory and transpiling them into files in the `out-dir`.

#### `bestie -e .`: Print `Node_modules` Size

When installed globally, `bestie` can report the size of `node_modules` directory with `-e` command. The size is got from the `du` command. It might differ from the `du -sh ./*/node_modules` report.

%FORK-sh src/bin/register -e ..%

#### `bestie -I`: Install `@Babel`

Installs the modules in the list below in the current package directory with the latest version.

```fs
@babel/cli
@babel/core
@babel/register
@babel/plugin-syntax-object-rest-spread
@babel/plugin-transform-modules-commonjs
babel-plugin-transform-rename-import
```

<details>
  <summary>[<code>b -I</code> log](t)</summary>

```c
Offices-iMac:structure zavr$ yarn bI
yarn run v1.7.0
$ b -I
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
success Saved lockfile.
success Saved 134 new dependencies.
info Direct dependencies
├─ @babel/cli@7.0.0-beta.51
├─ @babel/core@7.0.0-beta.51
├─ @babel/plugin-syntax-object-rest-spread@7.0.0-beta.51
├─ @babel/plugin-transform-modules-commonjs@7.0.0-beta.51
├─ @babel/register@7.0.0-beta.51
└─ babel-plugin-transform-rename-import@2.2.0
info All dependencies
├─ @babel/cli@7.0.0-beta.51
├─ @babel/core@7.0.0-beta.51
├─ @babel/helper-function-name@7.0.0-beta.51
├─ @babel/helper-get-function-arity@7.0.0-beta.51
├─ @babel/helper-module-imports@7.0.0-beta.51
├─ @babel/helper-module-transforms@7.0.0-beta.51
├─ @babel/helpers@7.0.0-beta.51
├─ @babel/highlight@7.0.0-beta.51
├─ @babel/plugin-syntax-object-rest-spread@7.0.0-beta.51
├─ @babel/plugin-transform-modules-commonjs@7.0.0-beta.51
├─ @babel/register@7.0.0-beta.51
├─ abbrev@1.1.1
├─ anymatch@2.0.0
├─ aproba@1.2.0
├─ are-we-there-yet@1.1.5
├─ arr-flatten@1.1.0
├─ assign-symbols@1.0.0
├─ async-each@1.0.1
├─ atob@2.1.1
├─ babel-plugin-transform-rename-import@2.2.0
├─ base@0.11.2
├─ binary-extensions@1.11.0
├─ braces@2.3.2
├─ cache-base@1.0.1
├─ chokidar@2.0.4
├─ chownr@1.0.1
├─ class-utils@0.3.6
├─ code-point-at@1.1.0
├─ collection-visit@1.0.0
├─ commander@2.15.1
├─ commondir@1.0.1
├─ console-control-strings@1.1.0
├─ copy-descriptor@0.1.1
├─ core-js@2.5.7
├─ debug@2.6.9
├─ decode-uri-component@0.2.0
├─ deep-extend@0.6.0
├─ delegates@1.0.0
├─ detect-libc@1.0.3
├─ expand-brackets@2.1.4
├─ extglob@2.0.4
├─ fill-range@4.0.0
├─ find-cache-dir@1.0.0
├─ find-up@2.1.0
├─ for-in@1.0.2
├─ fs-minipass@1.2.5
├─ fs-readdir-recursive@1.1.0
├─ fsevents@1.2.4
├─ gauge@2.7.4
├─ get-value@2.0.6
├─ glob-parent@3.1.0
├─ has-unicode@2.0.1
├─ has-value@1.0.0
├─ has-values@1.0.0
├─ home-or-tmp@3.0.0
├─ ignore-walk@3.0.1
├─ ini@1.3.5
├─ invariant@2.2.4
├─ is-accessor-descriptor@1.0.0
├─ is-binary-path@1.0.1
├─ is-data-descriptor@1.0.0
├─ is-descriptor@1.0.2
├─ is-extglob@2.1.1
├─ is-glob@4.0.0
├─ is-odd@2.0.0
├─ is-plain-obj@1.1.0
├─ is-plain-object@2.0.4
├─ is-windows@1.0.2
├─ jsesc@2.5.1
├─ json5@0.5.1
├─ kind-of@3.2.2
├─ locate-path@2.0.0
├─ lodash.debounce@4.0.8
├─ loose-envify@1.3.1
├─ make-dir@1.3.0
├─ map-visit@1.0.0
├─ micromatch@3.1.10
├─ minizlib@1.1.0
├─ mixin-deep@1.3.1
├─ nan@2.10.0
├─ nanomatch@1.2.9
├─ needle@2.2.1
├─ node-modules-regexp@1.0.0
├─ node-pre-gyp@0.10.2
├─ nopt@4.0.1
├─ npm-bundled@1.0.3
├─ npm-packlist@1.1.10
├─ npmlog@4.1.2
├─ number-is-nan@1.0.1
├─ object-copy@0.1.0
├─ os-homedir@1.0.2
├─ osenv@0.1.5
├─ output-file-sync@2.0.1
├─ p-limit@1.3.0
├─ p-locate@2.0.0
├─ p-try@1.0.0
├─ pascalcase@0.1.1
├─ path-dirname@1.0.2
├─ path-exists@3.0.0
├─ path-parse@1.0.5
├─ pirates@3.0.2
├─ pkg-dir@2.0.0
├─ posix-character-classes@0.1.1
├─ rc@1.2.8
├─ readdirp@2.1.0
├─ remove-trailing-separator@1.1.0
├─ repeat-element@1.1.2
├─ resolve-url@0.2.1
├─ resolve@1.8.1
├─ ret@0.1.15
├─ sax@1.2.4
├─ set-blocking@2.0.0
├─ set-immediate-shim@1.0.1
├─ set-value@2.0.0
├─ slash@1.0.0
├─ snapdragon-node@2.1.1
├─ snapdragon-util@3.0.1
├─ source-map-resolve@0.5.2
├─ source-map-support@0.4.18
├─ source-map-url@0.4.0
├─ source-map@0.5.7
├─ split-string@3.1.0
├─ static-extend@0.1.2
├─ tar@4.4.4
├─ to-fast-properties@2.0.0
├─ to-regex-range@2.1.1
├─ trim-right@1.0.1
├─ union-value@1.0.0
├─ unset-value@1.0.0
├─ upath@1.1.0
├─ urix@0.1.0
├─ use@3.1.0
├─ wide-align@1.1.3
└─ yallist@3.0.2
✨  Done in 62.53s.
```
</details>

#### `bestie -U`: Uninstall `@Babel`

Removes the modules (from the same list as installed), and will ask for confirmation beforehand:

```c
Continue removing
 @babel/cli@7.0.0-beta.51
 @babel/core@7.0.0-beta.51
 @babel/register@7.0.0-beta.51
 @babel/plugin-syntax-object-rest-spread@7.0.0-beta.51
 @babel/plugin-transform-modules-commonjs@7.0.0-beta.51
 babel-plugin-transform-rename-import@2.2.0
from bestie? [y] n
```

%GIF doc/uninstall.gif
Uninstalling babel dependencies.
<code>b -U</code>
%

<!-- When `.` is passed as source directory (`dir`), or not passed at all, it is assumed that `src` and `test` directories in the `cwd` need transpilation. A command to run
`babel` will be executed, e.g.,: -->

<!-- ```sh
# bestie build test build --copy-files --include-dotfiles
./node_modules/.bin/babel test --out-dir build/test --copy-files --include-dotfiles
``` -->

<!-- Default output directory is `es5`.

Source directories can be separated with a comma, e.g., `bestie build src,test`. -->

<!-- ## ES5 notice

Include the information about transpiled version in the `README.md` file with
the following lines:

````markdown
## ES5 -->

<!-- The package uses some newer language features. For your convenience, it's been
transpiled to be compatible with Node 4. You can use the following snippet.

```js
const bestie = require('bestie/es5')
```
```` -->

## API

`bestie` can also be used programmatically and has the following API.

```### async bestie
[
  ["config", {
    "from?": ["string", "src"],
    "to?": ["string", "build"],
    "args?": ["string[]", "[]"],
    "stdout?": ["Stream", "process.stdout"],
    "stderr?": ["Stream", "process.stderr"],
    "cwd?": ["string", "process.cwd()"]
  }]
]
```

Calling the `bestie` function from the source code will return a promise to transpile files. In background, `babel` will be spawned via the `child_process`.

%EXAMPLE: example/example.js, ../src => bestie, javascript%

%FORK example example/example.js%

## How To Reduce The Size Of Node_modules

Before upgrading to using `bestie`, a standard package `node_module` directory would occupy ~ 90 MB of disk space, including `@babel/cli`, `@babel/core`, `@babel/register`, `@babel/plugin-syntax-object-rest-spread`, `@babel/plugin-transform-modules-commonjs`, `babel-plugin-transform-rename-import` and `eslint`.

At first, `@babel` was removed, and then `eslint`. This allowed to save 2 GB of disk space in total.

%EXAMPLE: read-data.json, table%

---

(c) [Art Deco Code][1] 2018

[1]: https://adc.sh
