"use strict";

const gulp = require('gulp');
const del = require('del');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const gzip = require('gulp-gzip');
const tar = require('gulp-tar');
const webpack = require('webpack-stream');
const liveServer = require('gulp-live-server');
const mocha = require('gulp-mocha');
const spawnMocha = require('gulp-spawn-mocha');
const babel = require('babel-register');
const downloader = require('gulp-downloader');
const unzip = require('gulp-unzip');
const hash = require('gulp-hash');
const sourcemaps = require('gulp-sourcemaps');
const merge = require("merge-stream");
const mirror = require("gulp-mirror");
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const pkg = require('./package.json');
const sassLint = require('gulp-sass-lint');
const drakov = require('drakov');


gulp.task('scss:dev', ['clean:css'], () => {
  return gulp.src('./src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [require("bourbon").includePaths]
    }).on('error', sass.logError))
    .pipe(rename('./public/css/main-dev.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'));
});

gulp.task('clean:tmp', (done) => {
  return del([
    './tmp/*',
    './log/*',
    './generated'
  ], done);
});

gulp.task('clean:css', (done) => {
  return del([
    './public/css/*'
  ], done);
});

gulp.task('clean:img', (done) => {
  return del([
    './public/img/*'
  ], done);
});

gulp.task('clean:js', (done) => {
  return del([
    './public/js/*'
  ], done);
});

gulp.task('clean:dist', (done) => {
  return del([
    './dist/*'
  ], done);
});

gulp.task('mockBff', (done) => {
  var argv = {
    sourceFiles: './test/fixtures/*.md',
    serverPort: 8001
  };
  drakov.run(argv);
});



gulp.task('clean:public', ['clean:css', 'clean:js', 'clean:img']);

gulp.task('clean', ['clean:dist', 'clean:tmp', 'clean:public']);

const webpackConfig = {
  entry: {
    main: './src/js/client',
    vendor: ['react', 'react-router', 'lodash', 'events', 'history', 'classnames']
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        exclude: /node_modules/
      }
    ]
  },
  //amd: {
  //  jQuery: true
  //},
  resolve: {
    extensions: ['', '.js', '.json'],
    modulesDirectories: [
      './node_modules',
      './node_modules/spin.js/',
      './node_modules/jquery/dist/jquery.min.js'
    ]
  }
};

gulp.task('webpack:dev', (done) => {

  return gulp.src('./src/client.js')
    .pipe(
      webpack(
        _.assign(webpackConfig, {
          devtool: 'eval-source-map',
          output: {
            filename: 'main-dev.js'
          },
          plugins: [
            //new webpack.webpack.ProvidePlugin({
            //  jQuery: 'jquery',
            //  $: 'jquery',
            //  "window.jQuery": 'jquery'
            //}),
            new webpack.webpack.optimize.CommonsChunkPlugin('vendor', 'vendor-dev.js', Infinity)
          ]
        })
      ).on('error', done))
    .pipe(gulp.dest('./public/js'));
});

function cssminRelease() {
  return gulp.src('./src/scss/main.scss')
    .pipe(sass({includePaths: [require("bourbon").includePaths]}))
    .pipe(cleanCss({keepSpecialComments: 0}))
    .pipe(rename('css/main.css'));
}

function webpackRelease() {
  const plugins = [
    new webpack.webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify('production')
      }
    }),
    new webpack.webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity),
    new webpack.webpack.optimize.DedupePlugin(),
    new webpack.webpack.optimize.UglifyJsPlugin()
  ];

  return gulp.src('./src/js/client.js')
    .pipe(webpack(
      _.assign(webpackConfig, {
        plugins: plugins,
        output: {
          filename: 'main.js'
        }
      })
    ))
    .pipe(rename({dirname: 'js'}));
}

function copyImage() {
  return gulp.src('./src/img/**/*').pipe(rename(filePath => {
    filePath.dirname = 'public/img/' + filePath.dirname;
  }));
}

function dist() {
  const jsAndCss =
    merge(
      cssminRelease(),
      webpackRelease()
    )
      .pipe(hash())
      .pipe(mirror(
        hash.manifest('generated/assets.json'),
        rename(
          function (path) {
            path.dirname = `public/${path.dirname}`;
          }
        )
      ));
  const src = gulp.src(['./src/**/*.js', './src/favicon.ico'], {base: '.'});
  const nodeModules = gulp.src('./node_modules/**', {base: '.'});
  const pkgJson = gulp.src('./package.json');
  return merge(jsAndCss, copyImage(), src, nodeModules, pkgJson);
}

gulp.task('dist', () => {
  return dist().pipe(gulp.dest("dist"));
});

gulp.task('package', () => {
  return dist()
    .pipe(rename(filePath => {
      filePath.dirname = path.join(pkg.name, filePath.dirname);
    }))
    .pipe(tar(`${pkg.name}.tar`))
    .pipe(gzip())
    .pipe(gulp.dest('./target'));
});

gulp.task('copy:img', () => {
  return copyImage().pipe(gulp.dest("."));
});

gulp.task('lint', () => {
  return gulp.src([
    '**/*.js',
    '!./node_modules/**',
    '!./target/**',
    '!./public/**',
    '!./tmp/**',
    '!./generated/**',
    '!./dist/**',
    '!./coverage/**'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// How to use a config file? https://github.com/sasstools/gulp-sass-lint/issues/34
gulp.task('sass-lint', function () {
  return gulp.src('./src/scss/**/*.s+(a|c)ss')
    .pipe(sassLint({
       configFile: '.sass-lint.yml'
     }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('watch:sass', () => {
  return gulp.watch('./src/scss/**/*', ['scss:dev']);
});

gulp.task('watch:img', () => {
  return gulp.watch('./src/img/**/*', ['copy:img']);
});

gulp.task('watch:js', () => {
  return gulp.watch('./src/**/*.js', ['webpack:dev']);
});

const server = liveServer('./src/serverEntry.js', {
  env: {NODE_ENV: 'local'}
});

gulp.task('express:start', ['mkdir', 'webpack:dev'], (done) => {
  server.start();
  const childStdout = server.server.stdout;
  const handler = () => {
    done();
    childStdout.removeListener('data', handler);
  };
  childStdout.on('data', handler);

  gulp.watch(['./public/css/*.css', './public/img/*.*'], (files) => {
    server.notify.apply(server, [files]);
  });

  gulp.watch('./public/js/*.js', (files) => {
    server.start.bind(server)();
    server.server.stdout.on('data', () => {
      server.notify.apply(server, [files]);
    });
  });
});

gulp.task('mkdir', () => {
  return gulp.src([])
    .pipe(rename('logs'))
    .pipe(gulp.dest('./target'));
});

// Workaround for https://github.com/airbnb/enzyme/issues/58 and https://github.com/airbnb/enzyme/issues/68
gulp.task('test:unit-jsdom', () => {
  return gulp.src('./test/unit-jsdom/**/*.js', {read: false})
    .pipe(spawnMocha({
      require: ['./test/initializers/unitJsdom','./test/helper/unitHelper']
    }));
});

gulp.task('test:unit', () => {
  return gulp.src('./test/unit/**/*.js', {read: false})
    .pipe(mocha({
      require: ['./test/initializers/unit','./test/helper/unitHelper']
    }));
});

// Currently we just get coverage report on unit test for reasons:
// 1. Jsdom use wire plugin, and it have coverage issue: https://github.com/speedskater/babel-plugin-rewire/issues/95
// 2. test:unit-jsdom and test:unit have different initialize script, will conflict each other if combine in test:coverage if use rewire.
gulp.task('test:coverage', require('gulp-jsx-coverage').createTask({
    src: ['test/unit/**/*.js','test/unit-jsdom/**/*.js'],  // will pass to gulp.src as mocha tests
    isparta: false,                                  // use istanbul as default
    istanbul: {                                      // will pass to istanbul or isparta
        preserveComments: true,                      // required for istanbul 0.4.0+
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules|.*Spec|.*spec/            // do not instrument these files
    },
    threshold: [                                     // fail the task when coverage lower than one of this array
        {
            type: 'lines',                           // one of 'lines', 'statements', 'functions', 'banches'
            min: 70
        }
    ],
    transpile: {                                     // this is default whitelist/blacklist for transpilers
        babel: {
            include: /\.jsx?$/,
            exclude: /node_modules/,
            omitExt: false                           // if you wanna omit file ext when require(), put an array
        }                                         // of file exts here. Ex: ['.cjsx'] (NOT RECOMMENDED)
    },
    coverage: {
        reporters: ['lcov'], // list of istanbul reporters
        directory: 'coverage'                        // will pass to istanbul reporters
    },
    mocha: {                                         // will pass to mocha
        reporter: 'spec',
        require: ['./test/initializers/unitJsdom','./test/helper/unitHelper']
    },
    // Recommend moving this to .babelrc
    babel: {                                         // will pass to babel-core
        presets: ['es2015', 'react','stage-0'],                // Use proper presets or plugins for your scripts
        sourceMap: 'both'                            // get hints in covarage reports or error stack
    },
    coffee: {                                        // will pass to coffee.compile
        sourceMap: true                              // true to get hints in HTML coverage reports
    }
}));

gulp.task('test', ['lint', 'sass-lint', 'test:coverage']);

gulp.task('watch:src', ['watch:sass', 'watch:js', 'watch:img']);

gulp.task('serve', ['scss:dev', 'copy:img', 'express:start', 'watch:src']);
