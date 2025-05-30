"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript");

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
//* CHANGE DIRECTORY
//******************************************************************************
gulp.task("changeDirectory", function () {
    return gulp
    .src(["src/utils/pg/**.seed.yml"])
    .pipe(gulp.dest("./dist/utils/pg"))
});

//******************************************************************************
//* CHANGE DIRECTORY FOR JS
//******************************************************************************
gulp.task("changeDirectoryJS", function () {
    return gulp
    .src(["src/utils/handler/pay.js"])
    .pipe(gulp.dest("./dist/utils/handler"))
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
//* DEFAULT
//******************************************************************************
gulp.task("default", gulp.series(
    "lint",
    "changeDirectory",
    "changeDirectoryJS",
    // "build",
));
