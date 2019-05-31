const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const pages = ['main', 'login'];
var entry = {
  polyfill: '@babel/polyfill'
};
pages.forEach(p => entry[p] = path.resolve(__dirname, `src/${p}.js`));

module.exports = {
  entry,
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
      	test: /\.css$/,
      	use: [
      		'style-loader',
      		'css-loader',
          'postcss-loader'
      	]	
      },
      {
				test: /\.(png|svg|jpg|gif)$/,
				use: [
				 'file-loader'
				]
			},
			{
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
      new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['**/*', '!sftp-config.json'] }),
      new VueLoaderPlugin(),
      ...pages.map(p => {
        return new HtmlWebpackPlugin({
          template: path.resolve(__dirname, 'src/index.html'),
          filename: path.resolve(__dirname, `public/${p}.html`),
          chunks: [p]
        });
      })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  }
};