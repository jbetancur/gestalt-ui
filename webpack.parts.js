const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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

exports.devServer = function devServer({ host, port }) {
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Don't refresh if hot loading fails. If you want
      // refresh behavior, set hot: true instead.
      hotOnly: true,

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
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
