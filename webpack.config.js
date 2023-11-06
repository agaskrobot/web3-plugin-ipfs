const webpack = require('webpack');

module.exports = {
	mode: 'production',
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		path: __dirname + '/dist',
		filename: 'ipfs_plugin.min.js',
		library: 'IpfsPlugin',
		libraryExport: 'default',
		libraryTarget: 'umd',
		globalObject: 'this',
	},
	plugins: [
		new webpack.NormalModuleReplacementPlugin(/node:/, resource => {
			const mod = resource.request.replace(/^node:/, '');

			switch (mod) {
				case 'path':
					resource.request = 'path-browserify';
					break;
				default:
					throw new Error(`Not found ${mod}`);
			}
		}),
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [/node_modules/, '/test/'],
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		],
	},
};
