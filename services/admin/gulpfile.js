"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript"),
    cleanCss = require('gulp-clean-css'),
    uglify = require("gulp-uglify"),
    rename = require('gulp-rename');


//******************************************************************************
//* LINT
//******************************************************************************
gulp.task("lint", function () {
    var config = { formatter: "verbose" };
    return gulp.src([
        "src/**/**.ts"
    ])
        .pipe(tslint(config))
        .pipe(tslint.report());
});

//******************************************************************************
//* BUILD
//******************************************************************************
var tstProject = tsc.createProject("tsconfig.json", { typescript: require("typescript") });

gulp.task("build", function () {
    return gulp.src([
        "src/**/*.ts"
    ])
        .pipe(tstProject())
        .on("error", function (err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("dist/"));
});


//******************************************************************************
//* BUILD ASSETS
//******************************************************************************
gulp.task("buildAsset", function () {
    return gulp
    .src(["./src/public/css/argon.css"])
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`./src/public/css`));
})

//******************************************************************************
//* BUILD JS
//******************************************************************************
gulp.task("buildJs", function () {
    return gulp
    .src(["./src/public/js/argon.js"])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(`./src/public/js`));
})

//******************************************************************************
//* CHANGE DIRECTORY FOR VIEWS
//******************************************************************************
gulp.task("cdViews", function () {
    return gulp
    .src(["./views/**/*.ejs"])
    .pipe(gulp.dest("./dist/views"));
})


//******************************************************************************
//* CHANGE DIRECTORY FOR PUBLIC
//******************************************************************************
gulp.task("cdPublic", function () {
    return gulp
    .src(["./src/public/**"])
    .pipe(gulp.dest("./dist/public"));
})

//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task("default", gulp.series(
    // "lint",
    "build",
    "buildAsset",
    "buildJs",
    "cdViews",
    "cdPublic"
));
