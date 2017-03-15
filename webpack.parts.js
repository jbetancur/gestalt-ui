const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const execSync = require('child_process').execSync;
const pkg = require('./package.json');
const config = require('./config.json');

exports.sourceMaps = () => (
  {
    devtool: 'inline-source-map' // or cheap-module-eval-source-map
  }
);

exports.externals = () => (
  {
    externals: {
      cheerio: 'window',
      'react/addons': 'react',
      'react/lib/ExecutionEnvironment': 'react',
      'react/lib/ReactContext': 'react',
    }
  }
);

exports.babelConfig = () => (
  {
    module: {
      rules: [{
        test: /(\.js|\.jsx)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      }]
    }
  }
);

exports.esLintConfig = () => (
  {
    module: {
      rules: [{
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      }]
    }
  }
);

exports.scssConfig = ({ options }) => (
  {
    module: {
      rules: [{
        test: /(\.scss|\.css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss-loader',
                plugins: () => [autoprefixer]
              }
            },
            {
              loader: 'sass-loader',
              options
            }
          ]
        })
      }]
    }
  }
);

exports.fontConfig = () => (
  {
    module: {
      rules: [{
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'url-loader'
      }]
    }
  }
);

exports.icoConfig = () => (
  {
    module: {
      rules: [{
        test: /\.(ico)$/,
        loader: 'raw-loader'
      }]
    }
  }
);

exports.svgConfig = () => (
  {
    module: {
      rules: [{
        test: /\.(svg)$/,
        loader: 'file-loader'
      }]
    }
  }
);

exports.imageConfig = () => (
  {
    module: {
      rules: [{
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=10000' // inline base64 URLs for <=8k images, direct URLs for the rest
      }]
    }
  }
);

exports.generateConstants = env => (
  new webpack.DefinePlugin({
    $$API_URL$$: JSON.stringify(config[env].API_URL),
    $$SEC_API_URL$$: JSON.stringify(config[env].SEC_API_URL),
    $$API_TIMEOUT$$: JSON.stringify(config[env].API_TIMEOUT),
    $$LICENSE_EXP_THRESHOLD$$: JSON.stringify(config[env].LICENSE_EXP_THRESHOLD),
    $$DEBUG$$: JSON.stringify(config[env].DEBUG),
    $$COMPANY_TITLE$$: JSON.stringify(config[env].COMPANY_TITLE),
    $$COMPANY_URL$$: JSON.stringify(config[env].COMPANY_URL),
    $$APP_TITLE$$: JSON.stringify(config[env].APP_TITLE),
    $$DOCUMENTATION_URL$$: JSON.stringify(config[env].DOCUMENTATION_URL),
    $$UI_VERSION$$: JSON.stringify(`${pkg.version}-${execSync('git rev-parse --short=8 HEAD')}`),
    'process.env': {
      NODE_ENV: JSON.stringify(env), // needed by redux and react internally - otherwise not build specific to out codebase
    }
  })
);

exports.devServer = function devServer({ host, port, contentBase, compress }) {
  return {
    devServer: {
      contentBase,
      compress,
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Don't refresh if hot loading fails. If you want
      // refresh behavior, set hot: true instead.
      // hotOnly: true,
      hot: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host, // Defaults to `localhost`
      port, // Defaults to 8080
    }
  };
};
