/* eslint-disable no-return-assign, no-console, strict, no-underscore-dangle */

'use strict';

// Emitter Fix
require('events').EventEmitter.defaultMaxListeners = 25;

const path = require('path');
const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const useref = require('gulp-useref');
const changed = require('gulp-changed');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const size = require('gulp-size');
const uglify = require('gulp-uglify');
const nunjucks = require('gulp-nunjucks');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const revDelete = require('gulp-rev-delete-original');
const revCSS = require('gulp-rev-css-url');
const filter = require('gulp-filter');
const browserSync = require('browser-sync').create();
const purify = require('gulp-purifycss');
const plumber = require('gulp-plumber');
const inline = require('gulp-inline-source');
const critical = require('critical').stream;
const htmlmin = require('gulp-htmlmin');


// Image Handling Plugins
const unusedImages = require('gulp-unused-images');
const imagemin = require('gulp-imagemin');


// SASS, CSS, PostCSS
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');


// Build Configuration
const config = require('./config');

const ENV = process.env.NODE_ENV || 'development';
const DEV = !((ENV === 'staging') || (ENV === 'production'));
const VERBOSE = process.env.VERBOSE ? (process.env.VERBOSE.toLowerCase() === 'true') : false;

console.log(
  '\n\n',
  `Building with NODE_ENV: ${ENV}`,
  '\n',
  `Development Mode: ${DEV}`,
  '\n',
  `Verbose: ${VERBOSE}`,
  '\n\n'
);


gulp.task('clean', () => del('./public/**/*'));

gulp.task('sprites-svg', () => gulp.src()

);


gulp.task('styles', () => gulp.src(config.assets.styles)
  .pipe(plumber())
  .pipe(size({ showFiles: VERBOSE, title: '[styles] IN:' }))
  .pipe(sourcemaps.init(config.sourcemaps.init))
  .pipe(sass(config.sass).on('error', sass.logError))
  .pipe(postcss(config.postcss))
  .pipe(size({ showFiles: VERBOSE, title: '[styles] OUT:' }))
  .pipe(sourcemaps.write(config.sourcemaps.write))
  .pipe(gulp.dest('./public'))
  .pipe(browserSync.stream({ once: true }))
);

gulp.task('purecss', () => gulp.src('./public/*.css')
  .pipe(purify(...config.purifycss))
  .pipe(gulp.dest('./public/'))
);

gulp.task('useref', () => {
  const excludeVendorJSFilter = filter(['**/*.js', '!**/vendor.js'], { restore: true });

  return gulp.src(config.assets.html)
  .pipe(plumber())
  .pipe(sourcemaps.init(config.sourcemaps.init))
  .pipe(nunjucks.compile(config.nunjucks))
  .pipe(useref())
  .pipe(excludeVendorJSFilter)
    .pipe(babel())
  .pipe(excludeVendorJSFilter.restore)
  .pipe(sourcemaps.write(config.sourcemaps.write))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: VERBOSE, title: 'USEREF OUTPUT:' }))
  .pipe(browserSync.stream({ once: true }));
});


// Uglify JS Minification Task
gulp.task('uglify', () => gulp.src('./public/**/*.js')
  .pipe(plumber())
  .pipe(size({ showFiles: VERBOSE, title: '[uglifyJS] ORIGINAL:' }))
  .pipe(uglify(config.uglify))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: VERBOSE, title: '[uglifyJS] COMPRESSED:' }))
  .pipe(browserSync.stream({ once: true }))
);


// Image Compression/Copy Tasks
gulp.task('imagemin-jpeg', () => gulp.src('./public/images/**/*.{jpg,jpeg}', { base: './public/' })
  .pipe(plumber())
  .pipe(size({ showFiles: VERBOSE, title: '[imagemin] [jpeg] ORIGINAL:' }))
  .pipe(imagemin(config.imagemin.jpeg, config.imagemin.options))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: VERBOSE, title: '[imagemin] [jpeg] COMPRESSED:' }))
  .pipe(browserSync.stream({ once: true }))
);
gulp.task('imagemin-png', () => gulp.src('./public/images/**/*.png', { base: './public/' })
  .pipe(plumber())
  .pipe(size({ showFiles: VERBOSE, title: '[imagemin] [png] ORIGINAL:' }))
  .pipe(imagemin(config.imagemin.png, config.imagemin.options))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: VERBOSE, title: '[imagemin] [png] COMPRESSED:' }))
  .pipe(browserSync.stream({ once: true }))
);
gulp.task('imagemin-gif', () => gulp.src('./public/images/**/*.gif', { base: './public/' })
  .pipe(plumber())
  .pipe(size({ showFiles: VERBOSE, title: '[imagemin] [gif] ORIGINAL:' }))
  .pipe(imagemin(config.imagemin.gif, config.imagemin.options))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: VERBOSE, title: '[imagemin] [gif] COMPRESSED:' }))
  .pipe(browserSync.stream({ once: true }))
);
gulp.task('imagemin-svg', () => gulp.src('./public/images/**/*.svg', { base: './public/' })
  .pipe(plumber())
  .pipe(size({ showFiles: VERBOSE, title: '[imagemin] [svg] ORIGINAL:' }))
  .pipe(imagemin(config.imagemin.svg, config.imagemin.options))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: VERBOSE, title: '[imagemin] [svg] COMPRESSED:' }))
  .pipe(browserSync.stream({ once: true }))
);
gulp.task('imagemin', gulp.parallel(['imagemin-jpeg', 'imagemin-png', 'imagemin-gif', 'imagemin-svg']));

// Delete Unused Images (https://www.npmjs.com/package/gulp-unused-images)
gulp.task('unused-images', () => gulp.src([
  'public/images/**/*',
  'public/*.{css,htm,html}',
  '!**/open-graph/**',
])
  .pipe(plumber())
  .pipe(unusedImages({}).on('error', error => console.log(error.message)))
  .pipe(plumber.stop())
);


// Misc Asset Copy Tasks
gulp.task('assets-images', () => gulp.src(config.assets.images, { base: './source/' })
  .pipe(plumber())
  .pipe(changed('./public'))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: VERBOSE, title: '[assets] [images] COPY:' }))
  .pipe(browserSync.stream({ once: true }))
);
gulp.task('assets-fonts', () => gulp.src(config.assets.fonts)
  .pipe(plumber())
  .pipe(changed('./public'))
  .pipe(gulp.dest('./public/fonts'))
  .pipe(size({ showFiles: VERBOSE, title: '[assets] [fonts] COPY:' }))
  .pipe(browserSync.stream({ once: true }))
);
gulp.task('assets-videos', () => gulp.src(config.assets.videos, { base: './source/' })
  .pipe(plumber())
  .pipe(changed('./public'))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: VERBOSE, title: '[assets] [videos] COPY:' }))
  .pipe(browserSync.stream({ once: true }))
);
gulp.task('assets-favicons', () => gulp.src(config.assets.favicons, { base: './source/' })
  .pipe(plumber())
  .pipe(changed('./public'))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: VERBOSE, title: '[assets] [favicons] COPY:' }))
  .pipe(browserSync.stream({ once: true }))
);
gulp.task('assets', gulp.parallel('assets-images', 'assets-fonts', 'assets-videos', 'assets-favicons'));


// Cache busting (https://github.com/sindresorhus/gulp-rev and https://github.com/jamesknelson/gulp-rev-replace)
gulp.task('rev', () => gulp.src(config.revision.globs)
  .pipe(plumber())
  .pipe(rev(config.revision.rev))
  .pipe(revCSS(config.revision.revCSS))
  .pipe(revDelete(config.revision.revDelete))
  .pipe(size({ showFiles: VERBOSE, title: '[revision] RENAMING:' }))
  .pipe(gulp.dest('./public'))
  .pipe(rev.manifest())
  .pipe(gulp.dest('./public'))
);
gulp.task('rev-replace', () => gulp.src('./public/**/*.{htm,html}')
  .pipe(plumber())
  .pipe(revReplace({ manifest: gulp.src('./public/rev-manifest.json') }))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: VERBOSE, title: '[revision] REPLACING REVISIONED REFERENCES:' }))
  .pipe(browserSync.stream({ once: true }))
);
gulp.task('revision', gulp.series(['rev', 'rev-replace']));


// Inline assets
gulp.task('inline-source', () => gulp.src('./public/**.{htm,html}')
  .pipe(plumber())
  .pipe(inline({
    // https://github.com/popeindustries/inline-source#usage
    attribute: 'inline',
    compress: true,
    rootpath: './public',
    svgAsImage: true,
  }))
  .pipe(size({ showFiles: VERBOSE, title: '[inline-source] INLINING ASSETS IN HTML:' }))
  .pipe(gulp.dest('./public'))
);

// Critical Path CSS
gulp.task('critical', () => gulp.src('./public/*.{htm,html}')
  .pipe(size({ showFiles: true, title: '[critical-css] CRITICAL CSS BEFORE:' }))
  .pipe(critical(config.critical))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: true, title: '[critical-css] CRITICAL CSS AFTER:' }))
);


// HTML Minification
gulp.task('htmlmin', () => gulp.src('./public/*.{htm,html}')
  .pipe(plumber())
  .pipe(size({ showFiles: true, title: '[htmlmin] BEFORE:' }))
  .pipe(htmlmin(config.htmlmin))
  .pipe(gulp.dest('./public'))
  .pipe(size({ showFiles: true, title: '[htmlmin] AFTER:' }))
);


// Size Reporter
gulp.task('size', () => gulp.src('./public/**')
  .pipe(plumber())
  .pipe(gulpif('**/*.map', size({ title: '[size] Sourcemaps' })))
  .pipe(gulpif('**/images/**', size({ title: '[size] Images' })))
  .pipe(gulpif('**/*.css', size({ title: '[size] Styles' })))
  .pipe(gulpif('**/*.js', size({ title: '[size] Scripts' })))
  .pipe(gulpif('**/fonts/**', size({ title: '[size] Fonts' })))
  .pipe(gulpif('**/favicons/**', size({ title: '[size] Favicons' })))
  .pipe(gulpif('**/video/**', size({ title: '[size] Videos' })))
  .pipe(gulpif('**/*.{htm,html,php}', size({ title: '[size] HTML' })))
  .pipe(gulpif('!**/*.map', size({ title: '[size] Total Compressed Size (no sourcemaps)', gzip: true })))
  .pipe(gulpif('!**/*.map', size({ title: '[size] Total Size (no sourcemaps)' })))
);


// BrowserSync Development Tool Tasks
gulp.task('browsersync', () => browserSync.init(config.browsersync));


// Standard Build
gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'assets'), 'useref'));

// Production Build
gulp.task('production', gulp.series([
  'build',
  gulp.parallel('uglify', 'imagemin'),
  'purecss',
  'critical',
  'htmlmin',
  'revision',
  'size',
]));


// File Watching
gulp.task('watch', () => {
  const assets = [
    config.assets.images,
    config.assets.videos,
    config.assets.fonts,
    config.assets.favicons,
  ];

  function unlinkHandler(filepath) {
    const pathArray = filepath.split(path.sep);
    if (pathArray[0] !== 'source') {
      console.log(`Unable to find '${filepath}' in public directory to delete!`);
      return;
    }
    pathArray.shift();
    const publicFilePath = path.resolve(path.join('./public'), pathArray.join(path.sep));
    console.log(`Removing '${publicFilePath}'`);
    del.sync(publicFilePath);
  }

  gulp.watch(config.assets.styles, gulp.series('styles'))
    .on('unlink', unlinkHandler);
  gulp.watch(['./source/**/*.{html,htm,nunjucks,njk}'], gulp.series('useref'))
    .on('unlink', unlinkHandler);
  gulp.watch(config.assets.scripts, gulp.series('useref'))
    .on('unlink', unlinkHandler);
  gulp.watch(assets, gulp.series('assets'))
    .on('unlink', unlinkHandler);
});

gulp.task('watch-production', () => {
  gulp.watch('./source/**', gulp.series('production'))
    .on('unlink', filepath => {
      console.log('File Unlink (not yet handled):', filepath);
    });
});


// Debug Standard Builds with Browser-Sync & Watch for changes
gulp.task('development', gulp.series('build', gulp.parallel('watch', 'browsersync')));

// Debug Production Builds with Browser-Sync
gulp.task('production-debug', gulp.series('production', gulp.parallel('watch-production', 'browsersync')));


// gulp & npm start 'default' task
gulp.task('default', done => {
  console.log('Please use npm scripts instead of calling gulp directly');
  return done();
});
