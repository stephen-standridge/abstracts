module.exports = {
  entry: [
    './source/spacetree.js'
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
  watch: true,
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    // export itself to a global var
    libraryTarget: "var",
    // name of the global var: "Foo"
    library: "Tree"    
  }
};