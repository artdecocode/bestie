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
- [How To Reduce The Size Of Node_modules](#how-to-reduce-the-size-of-node_modules)

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

🎉  Successfully compiled 6 files with Babel.
```

## How To Reduce The Size Of Node_modules

Before upgrading to using `bestie`, each package directory occupied at least 30 MB of dependencies, most of which are the `babel` dependencies.

```
name                      v   size     size2    size3   final
./adc.sh/                 46  84064    46512    46512   x0.8 
./africa/                 51  88472    46200    7608    x10.6
./appshot/                49  104088   61680    25320   x3.1 
./aqt/                    51  124712   81040    5688    x20.9
./argufy/                 51  62480    6600     6600    x8.4 
./artdeco.bz/             47  197640   171032   147296  x0.3 
./assert-throws/          46  60176    8064     8064    x6.4 
./bestie/                 51  64240    64104    64120   -    
./bosom/                  49  90808    45840    7232    x11.5
./documentary/            51  90928    46544    7936    x10.4
./erotic/                 49  89192    44520    5928    x14  
./erte/                   49  90896    45840    7232    x11.5
./eslint-config-artdeco/  -   4744     4744     4744    -    
./expensive/              51  91320    45896    7288    x11.5
./ictx/                   49  89048    44296    5688    x14.6
./idio/                   47  155456   111288   85512   x0.8 
./idio-dev/               49  198536   173016   149816  x0.3 
./irio/                   49  89048    44296    5688    x14.6
./koa2-jsx/               47  125520   81568    55544   x1.2 
./makepromise/            46  58456    6416     6416    x8.1 
./mnp/                    49  93176    48888    10280   x8   
./mnp-idio/               -   4720     4720     4720    -    
./mnp-irio/               -   8        8        8       -    
./nodeeu/                 49  89048    44296    5688    x14.6
./pedantry/               51  89800    46760    8152    x10  
./pompeii/                49  89048    44296    5688    x14.6
./reloquent/              49  88568    44424    6296    x13  
./restream/               51  63144    7592     7592    x7.3 
./rqt/                    51  173920   130864   67128   x1.5 
./snapshot-context/       47  64456    7160     7160    x8   
./spawncommand/           47  62264    4816     4816    x11.9
./tablature/              49  90744    7232     7232    x11.5
./usually/                49  90736    45840    7232    x11.5
./window-info/            49  89296    44296    5688    x14.6
./yarn-s/                 46  56256    4744     4744    x10.8
./zoroaster/              47  90168    45832    7224    x11.4
total                     -   3120 MB  1671 MB  801 MB  x3
```

---

(c) [Art Deco Code][1] 2018

[1]: https://adc.sh
