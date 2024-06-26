/**
 * Define pages in the const pages array
 * Each page must have a corresponding .html file in the src/html/pages folder and a corresponding .js file in the src/js/pages folder
 */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const _ = require('lodash');

// Define your pages
const pages = ['index'];

module.exports = {
    mode: 'development',
    entry: _.fromPairs([...pages.map(page => [page, `./src/js/pages/${page}.js`]), ['master', './src/js/master.js']]),
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 8080,
        hot: true
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
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "./src/js/wave-add-in-kit.js", to: "js/pluginSDK.js" },
                { from: "./src/img/logopng.png", to: "logopng.png" },
                { from: "./src/manifest.json", to: "manifest.json" },
            ],
        }),
        ..._.map(pages, page => new HtmlWebpackPlugin({
            template: `src/html/pages/${page}.html`,
            filename: `${page}.html`,
            chunks: ['master', page] // Include master.js in each HTML file
        })),
        new HtmlWebpackTagsPlugin({ tags: ['js/pluginSDK.js'], append: false })
    ]
};
