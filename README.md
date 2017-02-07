## Gestalt Ui
Gestalt Ui written in React/Redux

## Prerequisites
### Install nvm
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
nvm install 6
cd gestalt-ui-react-react
nvm use 6
```

### Install Binaries
```
npm install -g karma karma-cli yarn
```

*Ensure that you ```nvm use 6``` whenever you start a new terminal. You may optionally persist this setting by using `nvm alias default <node-version>`*

## Development
First time (and anytime dependencies are updated or changed)
```
yarn install
```

Start the webpack dev server and hosts gestalt-ui-react for development purposes. Navigate to http://localhost:8081
```
yarn dev
```

## Production (Distribute Build)
Minify, optimize and compress for production deployment. Generates a ```/build``` directory can then be used for CI or statically hosted using your favorite http server.
```
yarn deploy
```

However, it is **highly recommended** that you pass a commit SHA to `yarn deploy`. The SHA will be appended to the version that displays in the ui.

For Example:
```
yarn deploy -- --sha `git rev-parse --short=8 HEAD`
```

## Configuration
If you wish to change Development or Production variables in the gestalt-ui-react prior to building, you may do so by editing the following lines in `config.json`
Otherwise, `config.js` can be automed via CI to inject the correct values before kicking off `yarn deploy`
For example:
```
{
  "development": {
    "API_URL": "https://meta.test.galacticfog.com",
    "SEC_API_URL": "https://security.test.galacticfog.com",
  },
  "production": {
    "API_URL": "/meta",
    "SEC_API_URL": "/security",
  }
}
```

## Testing
### Full test suite without (no watch)
Runs all Tests without watching. Useful for automation with CI Tools.
```
yarn test
```

### TDD Testing
Runs the app in TDD mode. Allows you to watch the code and tests for changes with you TDD.

#### Test Suite by Specific File Path
Runs all the tests for a test  in TDD mode. This is the fastest way to TDD when working on a single file
```
yarn test-tdd -- -f spec/app/app.test.js
```

#### Test Suite by Module
Runs all the tests for a single module in TDD mode. Slower than a single file, but useful for multiple tests

For example:
```
yarn test-tdd -- -m app
```
For this mode to work a <module>.tests.js file must exist in the spec directory.

### Code Coverage
```
yarn test-coverage
```

### Maintenance Modes

By default, the node-updates and node-upgrade commands are set to filter out npm-shrinkwrap, to lock it to v200+.
```
yarn node-packages - list installed packages
yarn node-updates - list node that may be outdated.
yarn node-upgrade - updates all the node versions in node.json.
yarn node-purge - removes your node_modules folder.
yarn node-reinstall - removes your node_modules folder and does a npm install.
yarn node-killall - kills all node processes - useful if your webpack-dev-server address is in use
yarn stats - generates build stats that can be analyzed @ http://webpack.github.io/analyse/#hints
```