# bestie

[![npm version](https://badge.fury.io/js/bestie.svg)](https://npmjs.org/package/bestie)

`bestie` is a Node.js package to build Node.js packages with `import` and `export` statements. The goal of this project is to start with using the babel AST parsing to build packages to allow functionality, however then to implement a regular expression transform stream which would update references to `import` into `require` statements. The motivation for this is that a modern Node.js package would only need a single babel transform to allow imports and exports, however all babel dependencies need to be installed and linked (around 5500 dependencies). Also, when transpiling, babel transform will use `requireInterop` expression which VS Code IDE cannot parse, and the JSDoc documentation disappears from all functions _etc_ not exported in the main file.

```sh
yarn add -E bestie
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
  * [CLI](#cli)
    * [`install bestie`](#install-bestie)
    * [`package.json`](#packagejson)
    * [`--init`, `-i`: Init .Babelrc](#--init--i-init-babelrc)
    * [`--help`, `-h`: Show Help](#--help--h-show-help)
    * [`b [src] [--out-dir=build]`: Build Project](#b-src---out-dirbuild-build-project)
- [API](#api)
  * [`async bestie(config: object)`](#async-bestieconfig-from-string--srcto-string--buildargs-string--stdout-stream--processstdoutstderr-stream--processstderrcwd-string--processcwd-void)

### CLI

To <a name="install-bestie">`install bestie`</a>, you need to clone its repository in the working directory, and install it with the dev dependencies from there. Then, `yarn link` it, and again in other projects.

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

The usage via the CLI is encouraged and can be achieved by specifying a `script` field in the <a name="packagejson">`package.json`</a> file, e.g.,

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

```json
{
  "plugins": [
    "@babel/plugin-syntax-object-rest-spread",
    "@babel/plugin-transform-modules-commonjs"
  ],
  "env": {
    "test-build": {
      "plugins": [
        [
          "transform-rename-import",
          {
            "original": "^((../)+)src",
            "replacement": "$1build"
          }
        ]
      ],
      "ignore": [
        "build/**/*.js"
      ]
    },
    "debug": {
      "retainLines": true
    }
  }
}
```

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

#### `b [src] [--out-dir=build]`: Build Project

The `b` binary will build the project, taking the files from the `src` directory and transpiling them into files in the `out-dir`.

## API

`bestie` can also be used programmatically and has the following API.

### `async bestie(`<br/>&nbsp;&nbsp;`config: {`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`from?: string = src,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`to?: string = build,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`args?: string[] = [],`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`stdout?: Stream = process.stdout,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`stderr?: Stream = process.stderr,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`cwd?: string = process.cwd(),`<br/>&nbsp;&nbsp;`},`<br/>`): void`

Calling the `bestie` function from the source code will return a promise to transpile files. In background, `babel` will be spawned via the `child_process`.

```javascript
import bestie from 'bestie'

(async () => {
  await bestie({
    from: 'src',
    to: 'build',
    args: ['--copy-files', '--include-dotfiles'],
    stdout: process.stdout,
    stderr: process.stderr,
    cwd: process.cwd(),
  })
})()
```

```
node_modules/@babel/cli/bin/babel.js src --out-dir build --copy-files --include-dotfiles 

🎉  Successfully compiled 5 files with Babel.
```

---

(c) [Art Deco Code][1] 2018

[1]: https://adc.sh
