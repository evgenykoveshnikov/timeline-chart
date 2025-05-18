const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Entry point for the application (Точка входа для приложения)
  entry: './src/index.tsx',
  // Output configuration (Настройка выходных файлов)
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  // Module rules for handling different file types (Правила для обработки различных типов файлов)
  module: {
    rules: [
      {
        // Rule for TypeScript and JavaScript files (Правило для файлов TypeScript и JavaScript)
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        // Rule for SCSS files (using CSS Modules) (Правило для файлов SCSS с использованием CSS Modules)
        test: /\.module\.scss$/,
        use: [
          'style-loader', // Injects styles into the DOM (Внедряет стили в DOM)
          'css-modules-typescript-loader', // Generates TypeScript definitions for CSS Modules (Генерирует определения типов TypeScript для CSS Modules)
          {
            loader: 'css-loader', // Handles CSS files (Обрабатывает CSS файлы)
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]', // Configures CSS Modules naming (Настраивает именование CSS Modules)
              },
              importLoaders: 2, // Ensures sass-loader is applied (Убеждается, что sass-loader применяется)
            },
          },
          'sass-loader', // Compiles SCSS to CSS (Компилирует SCSS в CSS)
        ],
      },
      {
        // Rule for regular SCSS/CSS files (if any, without CSS Modules) (Правило для обычных файлов SCSS/CSS без CSS Modules)
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        // Rule for handling images (Правило для обработки изображений)
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  // Resolve extensions for importing modules (Разрешение расширений для импорта модулей)
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  // Plugins for Webpack (Плагины Webpack)
  plugins: [
    // Generates an HTML file for the application (Генерирует HTML файл для приложения)
    new HtmlWebpackPlugin({
      template: './public/index.html', // Path to the HTML template (Путь к HTML шаблону)
      filename: 'index.html',
    }),
  ],
  // Development server configuration (Настройка сервера для разработки)
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve static files from dist (Обслуживать статические файлы из папки dist)
    },
    compress: true, // Enable gzip compression (Включить сжатие gzip)
    port: 8080, // Port for the dev server (Порт для сервера разработки)
    historyApiFallback: true, // Fallback to index.html for SPA routing (Перенаправление на index.html для SPA маршрутизации)
  },
};
