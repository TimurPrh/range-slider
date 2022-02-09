const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require("webpack");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log('is DEV: ', isDev);

const optimization = () => {
    const config = {};

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin(),
        ];
    }

    return config;
};

const filename = (ext) => {
    let name;
    if (ext === 'html') {
        name = isDev ? `[name]/index.${ext}` : `[name]/index.${ext}`;
    } else {
        name = isDev ? `[name]/[name].${ext}` : `[name]/[name].${ext}`;
    }
    return name;
};

const cssLoaders = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        "css-loader",
    ];
    if (extra) {
        loaders.push(extra);
    }
    return loaders;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        'demo-page': ['@babel/polyfill/noConflict', './index.ts'],
        'range-slider': ['@babel/polyfill/noConflict', './slider-plugin/index.ts'],
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: 'js/[name].js',
        library: isDev ? undefined : 'RangeSlider',
        libraryTarget: isDev ? undefined : 'umd',
        libraryExport: isDev ? undefined : 'default',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    optimization: optimization(),
    devServer: {
        port: 4201,
    },
    devtool: isProd ? false : 'source-map',
    plugins: [
        new HTMLWebpackPlugin({
            inject: true,
            chunks: ['demo-page'],
            template: './index.pug',
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist'),
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource',
            },
            {
                test: /\.xml$/,
                use: ['xml-loader'],
            },
            {
                test: /\.csv$/,
                use: ['csv-loader'],
            },
            {
                test: /\.css$/i,
                use: cssLoaders(),
            },
            {
                test: /\.less$/i,
                use: cssLoaders('less-loader'),
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders('sass-loader'),
            },
            {
                test: /\.m?ts$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-typescript'],
                    },
                },
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.(pug|jade)$/,
                loader: 'pug-loader',
                options: {
                    pretty: true,
                },
            },
        ],
    },
    externals: {
        jquery: isProd ? 'jquery' : 'jQuery',
    },
};
