const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProd = process.env.DESTINATION === "prod";

module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./source/app-index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProd ? "bundle.commonjs.js" : "bundle.var.js",
    libraryTarget: isProd ? "commonjs" : "var",
    library: isProd ? undefined : "abstracts",
  },
  resolve: {
    extensions: [".js", ".jsx", ".glsl"], // <- lets you omit file extensions in imports
  },
  module: {
    rules: [
      {
        test: /\.glsl$/,
        use: 'raw-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-optional-chaining"],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true,
    }),
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
    open: true,
  },
};
