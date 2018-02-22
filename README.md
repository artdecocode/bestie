# bestie

`bestie` is a _Node.js_ package to create an `es5` directory in the project
directory which can be required from Node 4 and browsers with minimal
configuration. `async` is transpiled using `fast-async` to avoid runtimes. An
`index.js` file is created in the `es5` directory to point to the transpiled
main file, so that the bestified version of the module is just `package/es5`.

```sh
yarn add bestie -D
```

```sh
npm i bestie -g
```

## bestie init

Create a `.babelrc` file in the current direcory. The default content is:

```json
{
    "presets": [
        ["@babel/env", {
            "exclude": [
                "transform-regenerator",
                "transform-async-to-generator"
            ],
            "modules": false,
            "debug": true,
            "targets": {
                "node": 4
            }
        }]
    ],
    "plugins": [
        ["module:fast-async", {
            "spec": true
        }],
        ["transform-rename-import", {
            "original": "wrote",
            "replacement": "wrote/es5"
        }]
    ]
}
```

## bestie build

```sh
bestie build [dir] [dest] [--arg1, ..., --argN]
```

When `.` is passed as source directory (`dir`), or not passed at all, it is assumed
that `src` and `test` directories in the `cwd` need transpilation. A command to run
`babel` will be executed, e.g.,:

```sh
# bestie build test build --copy-files --include-dotfiles
./node_modules/.bin/babel test --out-dir build/test --copy-files --include-dotfiles
```

Default output directory is `es5`.

Source directories can be separated with a comma, e.g., `bestie build src,test`.

## ES5 notice

Include the information about transpiled version in the `README.md` file with
the following lines:

````markdown
## ES5

The package uses some newer language features. For your convenience, it's been
transpiled to be compatible with Node 4. You can use the following snippet.

```js
const bestie = require('bestie/es5')
```
````

## package.json

`package.json` file can be configured to run `bestie` from local
`node_modules`.

```json
{
	"name": "package",
	"scripts": {
		"build": "bestie",
		"build-test": "bestie test",
		"build-src": "bestie src"
	}
}
```

## API

`bestie` can be used programmatically and has the following API.

### _`async`_ `bestie({`<br/>&nbsp;&nbsp;`dir=`_`.`_`: String`<br/>&nbsp;&nbsp;`destination=`_`es5`_`: String`<br/>&nbsp;&nbsp;`args=`_`[]`_`: string[]`<br/>`})`

Call the `bestie` function from the source code to get a promise to transpile.
`babel` will be spawned with `child_process`.

```js
const bestie = require('bestie');

(async () => {
	await bestie({
		dir: 'src,bin,test',
		destination: 'build',
		args: ['--copy-files', '--include-dotfiles'],
		stdout: process.stdout,
  	stderr: process.stderr,
		cwd: process.cwd()
	})
})
```

---

(c) [sobes.io][1] 2018

[1]: https://sobes.io
