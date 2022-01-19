const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './lib/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        static: './build'
    },
    plugins: [
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { from: 'model', to: 'public/model' },
        //     ]
        // })
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'stc-bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: path.resolve(__dirname, 'build'),
        library: 'stc',
    },
};
