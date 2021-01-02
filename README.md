# Webpack Setup

Wepack Setup is a CLI which lets you add plugins and create initial webpack files. Project is not yet completed.

---

## Installation

If you have [NodeJS](https://nodejs.org) installed in your machine
```shell
npm install -g webpack-setup
```

## # Commands
`ws` is an alias of `webpack-setup` so you can use `ws add plugin` or `webpack-setup <command>`

### Add a webpack plugin
**Usage :** 
```shell
mkdir Project
cd Project
mkdir src
cd src
touch index.js
cd ..
ws add plugin
```

Add a plugin and it will create a file in build_utils/presets directory with its default configuration.

---

Since we all know how hard is to deal with a large webpack file. This CLI tool simplifies your configurations by creating a seperate file for each presets. Every preset will contain its own custom configuration.

We are using webpack-merge tool to merge these configuration.
