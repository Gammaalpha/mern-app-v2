const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');
// const WebpackShellPlugin = require('webpack-shell-plugin');
const {
    NODE_ENV = 'production',
} = process.env;
module.exports = {
    entry: './app/server.ts',
    mode: NODE_ENV,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'server.bundle.js',
        libraryTarget: 'commonjs' // IMPORTANT!
    },
    module: {
        rules: [
            { test: /\.node$/, loader: 'node-loader' },
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!simple-oauth2)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceType: "unambiguous",
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties', "@babel/plugin-transform-runtime"]
                    }
                }
            },
            {
                test: /\.ts$/,
                use: ['ts-loader']
            }
        ]
    },
    externals: [
        // webpackNodeExternals()
    ],
    watch: NODE_ENV === 'development',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        // new WebpackShellPlugin({
        //     onBuildEnd: ['npm run start:prod']
        // })
    ]
}