// run 'npm install' and 'gulp'

var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var handlebars = require('gulp-handlebars');
var emberHandlebars = require('ember-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

var paths = {
  styles: {
    src:  'app/scss/**/*.scss',
    dest: 'app/css'
  },
  scripts: {
    src:  'app/coffee/**/*.coffee',
    dest: 'app/js'
  },
  templates: {
    src:  'app/templates/**/*.hbs',
    dest: 'app/js'
  }
};

gulp.task('styles', function() {
  return gulp.src(paths.styles.src)
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer(['last 2 versions', "ie 8"]))
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts.src)
    .pipe(coffee())
    .on('error', gutil.log)
    .on('error', gutil.beep)
    .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('templates', function(){
  gulp.src(paths.templates.src)
    .pipe(handlebars({
      handlebars: emberHandlebars
    }))
    .pipe(wrap('Ember.Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Ember.TEMPLATES',
      noRedeclare: true,
      processName: function(filePath) {
        return declare.processNameByPath(filePath.replace('app/templates/', ''));
      }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(paths.templates.dest));
});


gulp.task('watch', function() {
  gulp.watch(paths.scripts.src, ['scripts']);
  gulp.watch(paths.styles.src, ['styles']);
  gulp.watch(paths.templates.src, ['templates']);
});

gulp.task('default', ['styles', 'scripts', 'templates', 'watch']);

