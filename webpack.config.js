'use strict';
const path = require('path');
const webpack = require('webpack');
const nodeModules = path.resolve(__dirname, 'node_modules');
const pathToAngular = path.resolve(nodeModules, 'angular/angular.min.js');


module.exports = {
    resolve: {
        extensions: ['','.js','.json','.scss']
    },
    entry: {
        geoFenceActivity: path.resolve(__dirname, 'src/apps/geoFenceActivity')
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        publicPath: './build/'
    },
    module: {
        noParse: [pathToAngular],
        loaders: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src/apps'),
            loaders: ['babel-loader', 'ng-annotate', 'eslint-loader']
        },{
            test: /\.html$/,
            include: path.resolve(__dirname, 'src/apps'),
            loader: 'html'
        },{
            test: /\.scss$/,
            include: [
                path.resolve(__dirname, 'src/apps'),
                path.resolve(__dirname, 'src/scss')
            ],
            loader: 'style!css!sass'
        },{
            test: /\.css$/,
            loader: 'style!css'
        },{
            test: /\.(jpg|gif|png|svg)$/,
            include: [
                path.resolve(__dirname, 'src/apps')
            ],
            loader: 'url-loader'
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js')
    ]
}