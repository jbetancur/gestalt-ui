const path = require('path');
const pkg = require('./package.json');
const config = require('./config.json');
const execSync = require('child_process').execSync;
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Clean = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rootPath = path.join(__dirname, './');
const buildPath = path.join(__dirname, './build');
const srcPath = path.join(__dirname, './src');

if (!(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production')) {
  throw new Error('Invalid Environment. NODE_ENV must be set to "production" or "development"');
}

let plugins = [];

if (process.env.NODE_ENV === 'production') {
  plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('theme-[hash:6].css', {
      allChunks: true,
      disable: false
    })
  ];
} else {
  plugins = [
    new ExtractTextPlugin('', {
      allChunks: true,
      disable: true
    })];
}

module.exports = {
  context: __dirname,
  devtool: 'inline-source-map',
  entry: {
    app: [`${srcPath}/index.jsx`],
  },
  output: {
    path: buildPath,
    filename: 'bundle-[hash:6].js',
    publicPath: '',
  },
  module: {
    loaders: [{
      test: /(\.js|\.jsx)$/,
      loader: 'babel-loader',
      exclude: [/node_modules/],
    },
    {
      test: /(\.jsx|\.js)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
    },
    {
      test: /(\.scss|\.css)$/,
      loaders: [
        'style-loader',
        'css-loader?importLoaders=2',
        'postcss-loader',
        'sass-loader?sourceMap=inline&outputStyle=expanded',
      ]
    },
    // {
    //   test: /\.svg$/,
    //   loader: 'url-loader'
    // },
    {
      test: /\.(eot|ttf|woff|woff2)$/,
      loader: 'url-loader'
    },
    {
      test: /\.(ico)$/,
      loader: 'raw-loader'
    },
    {
      test: /\.(svg)$/,
      loader: 'file-loader'
    },
    {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=10000' // inline base64 URLs for <=8k images, direct URLs for the rest
    }]
  },
  postcss: [autoprefixer],
  resolve: {
    extensions: ['', '.jsx', '.scss', '.js', '.json'],
    root: path.resolve(__dirname, srcPath),
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },
  plugins: [
    new Clean(['build'], {
      root: rootPath,
    }),
    new HtmlWebpackPlugin({
      title: pkg.title,
      favicon: `${srcPath}/assets/icons/gf-logo-color.ico`,
      template: `${srcPath}/index.html`,
      hash: true,
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      '@@APP_TITLE@@': JSON.stringify(config[process.env.NODE_ENV].APP_TITLE),
      '@@UI-VERSION@@': JSON.stringify(`${pkg.version}-${execSync('git rev-parse --short=8 HEAD')}`),
    })
  ].concat(plugins),
  devServer: {
    port: 8081,
    historyApiFallback: true,
  },
};
