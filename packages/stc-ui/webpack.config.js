const path = require('path');

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
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'stc-ui-bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: path.resolve(__dirname, 'build'),
        library: 'stcUI',
    },
};
