const gulp = require("gulp")
const sass = require("gulp-sass")
const autoprefixer = require('gulp-autoprefixer')
const notify = require("gulp-notify")
const stripCssComments = require('gulp-strip-css-comments')
const browserSync = require('browser-sync').create()
const htmlmin = require('gulp-htmlmin');
const reload = browserSync.reload

//copia webfonts
function fonts(){
     gulp.src([
        'node_modules/@fortawesome/fontawesome-free/webfonts/**/*',        
    ])
    .pipe(gulp.dest('./dist/webfonts'))
}


//Gera Arquivo css
function css() { 
    fonts()   
    return (
        
        gulp
            .src("./src/scss/*.scss")
            .pipe(sass({
                outputStyle: 'compressed'
                //outputStyle: 'expanded'
            }))
            .on("error", sass.logError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
            }))
            .pipe(stripCssComments())
            .pipe(gulp.dest("./dist/css"))
            .pipe(notify("dist/css/<%= file.relative %> gerado com sucesso!"))
    );
}

// Escuta Arquivos
function watch() {    
    gulp.watch("./src/scss/**/*", css)    
    gulp.watch("./src/*.html", minificaHTML)
    gulp.watch(['./src/*.html', './dist/css/*.css']).on("change", reload)
}

//Minificar o html
function minificaHTML() {
    return gulp.src('./src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('./dist'))
        .pipe(notify("dist/<%= file.relative %> minificado com sucesso!"))
}

// Executa o browsersync com autoreload
function dev() {
    watch();
    browserSync.init({
        server: {
            baseDir: "./dist",
        }
    });
    browserSync.stream();    
}



exports.watch = watch;
exports.dev = dev;