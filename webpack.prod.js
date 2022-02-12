const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
	entry: '/src/index.tsx',
	output: {
		path: path.resolve(__dirname, 'prod'),
	},
    mode: 'production',
    devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
					},
				},
			},
			{
				test: /\.css$/,
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'node_modules/react-toastify/dist'),
					path.resolve(
						__dirname,
						'node_modules/bootstrap/dist/css/bootstrap.min.css'
					),
					path.resolve(
						__dirname,
						'node_modules/react-grid-layout/css/styles.css'
					),
					path.resolve(
						__dirname,
						'node_modules/react-resizable/css/styles.css'
					),
				],
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: 'ts-loader',
			},
		],
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './src/index.html',
		}),
		new FaviconsWebpackPlugin('./src/logo.png'),
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
}
