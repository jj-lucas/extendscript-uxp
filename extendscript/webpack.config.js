const path = require('path')

module.exports = {
	entry: './src/selectObjectsByAttributes.ts', // Specify your entry TypeScript file
	output: {
		filename: 'bundle.js', // Output bundle filename
		path: path.resolve(__dirname, 'dist'), // Output directory
		chunkFormat: 'commonjs', // Specify the chunk format
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	target: 'es5', // Set the target to ES5
	optimization: {
		minimize: false, // Disable JavaScript minification
	},
}
