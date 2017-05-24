var HtmlWebpackPlugin = require('html-webpack-plugin');

var prodOutput = {
  path: __dirname + '/dist',
  filename: 'bundle.commonjs.js',
  // export itself to a global var
  libraryTarget: "commonjs"
}

var devOutput = {
  path: __dirname + '/dist',
  filename: 'bundle.var.js',
  // export itself to a global var
  libraryTarget: "var",
  // name of the global var: "Foo"
  library: "abstracts"
}

module.exports = {
  watch: false,
  entry: [
    './source/index.js'
  ],
  module: {
	  loaders: [
	    {
	      test: /\.js?$/,
	      exclude: /node_modules/,
	      loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015']
        }
	    }
	  ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ],
  watch: process.env.DESTINATION != 'prod',
  output: process.env.DESTINATION == 'prod' ? prodOutput : devOutput
};
