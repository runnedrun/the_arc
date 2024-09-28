import CopyPlugin from "copy-webpack-plugin"
import path from "path"
import * as url from "url"
import webpack from "webpack"
import nodeExternals from "webpack-node-externals"
// import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

const isProd = process.env.WEBPACK_MODE === "production"
console.log("mode", process.env.WEBPACK_MODE)
const config = {
  devtool: "source-map",
  mode: process.env.WEBPACK_MODE || "development",
  entry: "./functions/src/index",
  target: "node18",

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/preset-env"],
            "@babel/preset-react",
            "@babel/preset-typescript",
          ],
          plugins: ["@babel/plugin-transform-runtime"],
        },
      },
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /segmentit|nodejieba/,
      path.resolve(__dirname, "./functions/src/helpers/stub")
    ),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./package.json"),
          to: path.resolve(__dirname, "./dist/package.json"),
        },
        {
          from: path.resolve(__dirname, "./patch-package-if-needed.sh"),
          to: path.resolve(__dirname, "./dist/patch-package-if-needed.sh"),
        },
        {
          from: path.resolve(__dirname, "./.puppeteerrc.cjs"),
          to: path.resolve(__dirname, "./dist/.puppeteerrc.cjs"),
        },
        {
          from: path.resolve(__dirname, "./.env.local"),
          to: path.resolve(__dirname, "./dist/.env.local"),
        },
        {
          from: path.resolve(__dirname, "./.env.xqchinese-325dd"),
          to: path.resolve(__dirname, "./dist/.env.xqchinese-325dd"),
        },
        {
          from: path.resolve(__dirname, "./.env.yomuya-prod"),
          to: path.resolve(__dirname, "./dist/.env.yomuya-prod"),
        },
      ].filter(Boolean),
    }),
    // new BundleAnalyzerPlugin(),
    isProd && {
      apply: (compiler: webpack.Compiler) => {
        compiler.hooks.afterEmit.tapPromise("AfterEmitPlugin", async () => {
          return
        })
      },
    },
  ].filter(Boolean),
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "."),
      segmentit: path.resolve(__dirname, "./functions/src/stub"),
    },
  },
  experiments: {
    outputModule: true,
  },
  externals: [
    nodeExternals({
      importType: "module",
      allowlist: [/segmentit/, /pinyin/, /nodejieba/],
    }),
  ],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "module", // <-- Important
    chunkFormat: "module",
  },
}

export default config
