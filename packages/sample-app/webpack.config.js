const path = require('path');
const WebpackCopy = require('copy-webpack-plugin');
const WebpackTsPaths = require('tsconfig-paths-webpack-plugin');

module.exports = {
    context: __dirname,
    mode: 'development',
    target: 'web',
    devtool: 'source-map',
    entry: {
        index: './src/index.ts'
    },
    module: {
        rules: [
            {
                // Typescript files
                test: /\.ts$/,
                exclude: '/node_modules',
                use: [{
                    loader: 'ts-loader',
                    options: {
                        projectReferences: true
                    }
                }]
            },
            {
                // CSS files
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                // Imagery and data files
                test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
                use: [ 'url-loader' ]
            }
        ]
    },
    resolve: {
        modules: [
            '../../node_modules',
            path.resolve(__dirname)
        ],
        extensions: [".js", ".ts", ".tsx"],
        extensionAlias: {
            ".js": [".js", ".ts"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        }
    },
    plugins: [
        // Resolve tsconfig pathing
        new WebpackTsPaths({
            logLevel: 'info',
            mainFields: 'module',
            extensions: ['.js', '.ts', '.tsx']
        }),

        // Copy public directory
        new WebpackCopy({
            patterns: [
                { from: './public', to: './' }
            ]
        })
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        sourcePrefix: ''
    }
}