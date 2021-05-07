const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMimimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const esLintPlugin = (isDevevelopment) => (isDevevelopment ? [new ESLintPlugin({extensions: ['ts', 'js']})] : []);
console.log('esLintPlugin = ', esLintPlugin(isDev));
const optimization = () => {
  const config = {
    splitChunks: {chunks: 'all'},
  };
  if (isProd) {
    config.minimize = true;
    config.minimizer = [
      new CssMimimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }
  return config;
};
const jsLoaders = (preset) => {
  const loaders = [{
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
    },
  }];

  if (preset) loaders[0].options.presets.push(preset);

  return loaders;
};

module.exports = {
  /* context points to the folder with source files,
  if context is defined, source folder should be removed
  from the rest paths */
  target: 'web',
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './app.ts'],
  },
  /* to exclude extensions from the paths, and for
  possibility to write shorthand paths */
  resolve: {
    extensions: ['.ts', '.js', '.json', '.png'],
    alias: {
      '@scripts': path.resolve(__dirname, 'src/scripts'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    // sourceMapFilename: "[name].js.map"
  },
  devtool: isDev ? 'source-map' : false,
  /* to exclude bundling the same libraries into several
  entry points */
  optimization: optimization(),
  devServer: {
    port: 4200,
    open: true,
    contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [
    ...esLintPlugin(isDev),
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: isProd,
    }),
    new CleanWebpackPlugin(),
    /* new CopyWebpackPlugin({
       patterns: [
         {
           from: path.resolve(__dirname, 'src/user-oskar-icon.png'),
           to: path.resolve(__dirname, 'dist')
         }
       ]
     }), */
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  /* connect loaders */
  module: {
    rules: [
      {
        test: /\.css$/,
        /* webpack runs loaders from right to left! */
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(ico|png|jpg|jpeg|svg|gif)/,
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader'],
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: jsLoaders('@babel/preset-typescript', false),
      },
    ],
  },
};
