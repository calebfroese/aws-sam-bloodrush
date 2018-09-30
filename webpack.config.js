const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/lambdas.ts',
    mode: 'production',
    target: 'node',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': 'process.env'
        })
    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    // Ignore size warnings, we are not compiling for the web
    performance: {
        hints: false
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        libraryTarget: "commonjs",
        filename: 'lambdas.js',
        path: path.resolve(__dirname, 'dist', 'prod')
    }
};