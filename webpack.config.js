const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const copyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
require('@babel/polyfill')

module.exports = (env, opts) => {
  const config = {
    // 개발, 제품 빌드에 중복되는 옵션들

    // 임포트 시 확장자를 생략하기 위한 옵션
    resolve: {
      extensions: ['.vue', '.js'],
      alias: {
        '~': path.join(__dirname),
        'scss': path.join(__dirname, './scss') // css 용 절대 경로를 따로 관리해주는게 좋다.
      }
    },
    // 진입점 - java의 메인 메서드라고 생각하자.
    entry: {
      app: [ // 짐입점의 별칭을 'app'으로 지정하고 파일을 지정한다.
        '@babel/polyfill',
        path.join(__dirname, 'main.js')
      ]
    },
    // 결과물에 대한 설정
    output: {
      // filename: 'app.js', 아래와 동일
      filename: '[name].js',
      path: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            'babel-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [ // 로더가 여러개인 경우는 loader 대신 use를 사용한다.
            'vue-style-loader',
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new copyWebpackPlugin(
        [
          {
            from: 'assets/',
            to: ''
          }
        ]
      ),
      new CleanWebpackPlugin()
    ]
  }
  // 개발용
  if (opts.mode === 'development') {
    return merge(config, {
      // 추가 개발용 옵션
      // devtool: 'eval' = 빌드 시간이 빠르고 디버깅에 용이하나, 용량이 크고 최적화가 부족함.(개발용)
      devtool: 'eval',
      devServer: {
        // 개발모드로 빌드하면 바로 브라우저가 열린다.
        open: false,
        // 핫리로드 설정
        hot: true
      }
    })
  } else {
    return merge(config, {
      // 추가 제품용 옵션
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}
