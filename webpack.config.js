module.exports = {
  entry: [
    './source/tree.js'
  ],
  module: {
	  loaders: [
	    {
	      test: /\.js?$/,
	      exclude: /node_modules/,
	      loader: 'babel' // 'babel-loader' is also a legal name to reference
	    }
	  ]
  },  
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    // export itself to a global var
    libraryTarget: "commonjs2",
    // name of the global var: "Foo"
    library: "Tree"    
  }
};