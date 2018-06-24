# bestie

%NPM: bestie%

`bestie` is a Node.js package to build Node.js packages with `import` and `export` statements. The goal of this project is to start with using the babel AST parsing to build packages to allow functionality, however then to implement a regular expression transform stream which would update references to `import` into `require` statements. The motivation for this is that a modern Node.js package would only need a single babel transform to allow imports and exports, however all babel dependencies need to be installed and linked (around 5500 dependencies). Also, when transpiling, babel transform will use `requireInterop` expression which VS Code IDE cannot parse, and the JSDoc documentation disappears from all functions _etc_ not exported in the main file.

```sh
yarn add -E bestie
```

## Table Of Contents

%TOC%

### CLI

The usage via the CLI is encouraged and can be achieved by specifying a `script` field in the [`package.json`](t) file, e.g.,

```json
{
  "name": "package",
  "scripts": {
  	"build": "b"
  }
}
```

#### `--init`, `-i`: Init .Babelrc

Create a `.babelrc` file in the current direcory. The default content is:

%FORK-json print-babelrc.js%

#### `--help`, `-h`: Show Help

```sh
A command-line tool to build packages.
  Source is the first argument, followed by any additional arguments
  Default source is src and default out-dir is build.
  Any other additional arguments are passed along to babel.


  bestie [src] [--out-dir build] [[--copy-files] --etc]

        --help, -h      print the help message
        --init, -i      write the .babelrc in the current directory

  Example:

    bestie src --out-dir build --copy-files
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
    "stdout?": ["Stream", "`process.stdout`"],
    "stderr?": ["Stream", "`process.stderr`"],
    "cwd?": ["string", "`process.cwd()`"]
  }]
]
```

Calling the `bestie` function from the source code will return a promise to transpile files. In background, `babel` will be spawned via the `child_process`.

%EXAMPLE: example/example.js, ..src => bestie, javascript%

%FORK: example example/example.js%

---

(c) [Art Deco Code][1] 2018

[1]: https://adc.sh
