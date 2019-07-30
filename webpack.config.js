const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const path = require("path");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
  entry: {
    // bundle: ["./src/main.js"]
    ui: "./src/ui/index.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist/")
    // chunkFilename: "[name].[id].js"
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte")
    },
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"]
  },

  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: true,
            hotReload: true
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  mode,
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/ui/index.html",
      filename: "ui.html",
      inlineSource: ".(js|css)$",
      chunks: ["ui"]
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],
  devtool: prod ? false : "source-map"
};
