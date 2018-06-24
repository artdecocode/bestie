# bestie

%NPM: bestie%

`bestie` is a Node.js package to build Node.js packages with `import` and `export` statements. The goal of this project is to start with using the babel AST parsing to build packages to allow functionality, however then to implement a regular expression transform stream which would update references to `import` into `require` statements. The motivation for this is that a modern Node.js package would only need a single babel transform to allow imports and exports, however all babel dependencies need to be installed and linked (around 5500 dependencies). Also, when transpiling, babel transform will use `requireInterop` expression which VS Code IDE cannot parse, and the JSDoc documentation disappears from all functions _etc_ not exported in the main file.

```sh
yarn add -E bestie
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

When installed globally, `bestie` can report the size of `node_modules` directory with `-e` command.

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

%FORK-table read-data.js%

---

(c) [Art Deco Code][1] 2018

[1]: https://adc.sh
