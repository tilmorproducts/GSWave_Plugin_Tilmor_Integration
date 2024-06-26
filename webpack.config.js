const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const _ = require('lodash');

module.exports = {
    mode: 'development',
    entry: {
        master: './src/js/master.js',
        router: './src/js/router.js',
        pages: './src/js/pages/index.js' // Entry point for all pages
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 8080,
        hot: true,
        historyApiFallback: true // Serve index.html for all 404 routes
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: () => [
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: _.compact([
        new CopyPlugin({
            patterns: [
                { from: "./src/js/wave-add-in-kit.js", to: "js/pluginSDK.js" },
                { from: "./src/img/logopng.png", to: "logopng.png" },
                { from: "./src/manifest.json", to: "manifest.json" },
                { from: "./src/html/pages", to: "html" }, // Copy html folder to dist
            ],
        }),
        new HtmlWebpackPlugin({
            template: 'src/html/index.html',
            filename: 'index.html'
        }),
        new HtmlWebpackTagsPlugin({ tags: ['js/pluginSDK.js'], append: false })
    ])
};
