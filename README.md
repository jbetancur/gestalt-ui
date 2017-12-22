## Gestalt Ui
Gestalt Ui written in React/Redux

[![build status](https://gitlab.com/galacticfog/gestalt-ui-react/badges/develop/build.svg)](https://gitlab.com/galacticfog/gestalt-ui-react/commits/develop)
[![coverage report](https://gitlab.com/galacticfog/gestalt-ui-react/badges/develop/coverage.svg)](https://galacticfog.gitlab.io/gestalt-ui-react/)
## Prerequisites
### Install nvm
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
nvm install 8
cd gestalt-ui-react
nvm use 8
```
*Ensure that you `nvm use 8` whenever you start a new terminal. You may optionally persist this setting by executing `nvm alias default 8*

### Install Binaries
```
npm install -g yarn
```

## Install Dependencies
First time (and anytime dependencies are updated or changed)
```
yarn install
```
## Development
Start the webpack dev server and hosts gestalt-ui-react for development purposes. Navigate to http://localhost:8081
```
yarn dev
```

## Production (Distribute Build)
Minify, optimize and compress for production deployment. Generates a `/build` directory can then be used for CI or statically hosted using your favorite http server.
```
yarn deploy
```

However, it is **highly recommended** that you pass a commit SHA to `yarn deploy`. The SHA will be appended to the version that displays in the ui.

For Example:
```
yarn deploy -- --sha `git rev-parse --short=8 HEAD`
```

## Configuration
If you wish to change Development or Production variables in  gestalt-ui-react prior to building, you may do so by editing `config.json`.
Otherwise, `config.json` can be automed via CI to inject the correct values before kicking off `yarn deploy`

Sample `config.json`:
```
{
  "development": {
    "API_URL": "https://meta.test.galacticfog.com",
    "SEC_API_URL": "https://security.test.galacticfog.com",
    "API_TIMEOUT": 120000,
    "API_RETRIES": 5,
    "COMPANY_TITLE": "Galactic Fog",
    "COMPANY_URL": "http://www.galacticfog.com/",
    "APP_TITLE": "Gestalt",
    "DEFAULT_LANG": "en_us",
    "LICENSE_EXP_THRESHOLD": 15,
    "ANALYTICS_TRACKING_ACCT": "",
    "ANALYTICS_TRACKING": false,
    "DEBUG": true,
    "DOCUMENTATION_URL": "http://docs.galacticfog.com"
  },
  "production": {
    "API_URL": "/meta",
    "SEC_API_URL": "/security",
    "API_TIMEOUT": 120000,
    "API_RETRIES": 5,
    "COMPANY_TITLE": "Galactic Fog",
    "COMPANY_URL": "http://www.galacticfog.com/",
    "APP_TITLE": "Gestalt",
    "DEFAULT_LANG": "en_us",
    "LICENSE_EXP_THRESHOLD": 15,
    "ANALYTICS_TRACKING_ACCT": "xxxx",
    "ANALYTICS_TRACKING": true,
    "DEBUG": false,
    "DOCUMENTATION_URL": "http://docs.galacticfog.com"
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
Runs the app in watch mode, which allows you to watch the code and tests for changes with you as you TDD.
```
yarn test-tdd
```

### Cross Browser Testing
Runs all Tests against the following browsers: PhantomJS, Chrome, Firefox, Safari. Useful for cross browser unit testing.

```
yarn test-browser
```

### Code Coverage
Simply opens a browser window with coverage results.

```
yarn test-coverage
```



### Maintenance Modes

```
yarn packages - list installed packages
yarn purge - removes your node_modules folder.
yarn reinstall - removes your node_modules folder and does a npm install.
yarn killall - kills all node processes - useful if your webpack-dev-server address is in use
yarn stats - generates build stats that can be analyzed @ http://webpack.github.io/analyse/#hints
```
