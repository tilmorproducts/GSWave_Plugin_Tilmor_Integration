const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

module.exports = {
    //entry: './src/js/main.js',
    mode: 'development',
    entry: './src/js/main.js',
    output: {
        filename: 'js/main.js',
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
                test: /\.(scss)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
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
                    {
                        loader: 'sass-loader'
                    }
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
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new HtmlWebpackTagsPlugin({ tags: ['js/pluginSDK.js'], append: false })
    ]
}