const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    prefetch: "./prefetch-ip.js",
    popup: "./popup.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
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
    new CopyWebpackPlugin({
      patterns: [
        { from: "./popup.html", to: "popup.html" },
        { from: "./popup.css", to: "popup.css" },
        { from: "./manifest.json", to: "manifest.json" },
        { from: "./assets", to: "assets" },
      ],
    }),
  ],
};
