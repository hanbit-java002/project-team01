var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var all = require('gulp-all');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

var pkg = require('./package.json');
var dirs = pkg['pkjs-configs'].directories;

var eslint = require('gulp-eslint');

var pump = require('pump');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-html-minifier');

var handlebars = require('gulp-compile-handlebars');
var hbsGlobalConfig = pkg['pkjs-configs'].globals;

var less = require('gulp-less');
var autoprefix = require('less-plugin-autoprefix');

var nginxer = require('gulp-nginxer');

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('archive:create_archive_dir', function () {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
});

gulp.task('archive:zip', function (done) {

    var archiveName = path.resolve(dirs.archive, pkg.name + '_v' + pkg.version + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {

        var filePath = path.resolve(dirs.dist, file);

        // `archiver.bulk` does not maintain the file
        // permissions, so we need to add files individually
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath).mode
        });

    });

    archiver.pipe(output);
    archiver.finalize();

});

gulp.task('clean', function (done) {
    require('del')([
        dirs.archive,
        dirs.dist
    ]).then(function () {
        done();
    });
});

gulp.task('lint', function() {
    return gulp.src(dirs.src + '/js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        // Brick on failure to be super strict
        .pipe(eslint.failAfterError());
});

gulp.task('copy', [
	'copy:requirejs',
	'copy:url-search-params',
    'copy:jquery',
    'copy:normalize',
    'copy:bootstrap',
	'copy:font-awesome',
    'copy:clipboard',
    'copy:license',
    'copy:img',
    'copy:misc'
]);

gulp.task('copy:requirejs', function() {
    return all(
        gulp.src(['node_modules/requirejs/require.js'])
            .pipe(uglify())
            .pipe(plugins.rename('require.min.js'))
            .pipe(gulp.dest(dirs.dist + '/plugins/requirejs')),
        gulp.src([dirs.src + '/plugins/requirejs/**/*.js'])
            .pipe(uglify())
            .pipe(gulp.dest(dirs.dist + '/plugins/requirejs')),
        gulp.src([dirs.src + '/js/require.config.js'])
            .pipe(uglify())
            .pipe(gulp.dest(dirs.dist + '/js'))
    );
});

gulp.task('copy:url-search-params', function() {
	return gulp.src('node_modules/url-search-params/build/url-search-params.js')
		.pipe(gulp.dest(dirs.dist + '/plugins/url-search-params'));
});

gulp.task('copy:jquery', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
               .pipe(gulp.dest(dirs.dist + '/plugins/jquery'));
});

gulp.task('copy:font-awesome', function() {
	return all(
		gulp.src(['node_modules/font-awesome/css/font-awesome.min.css'])
			.pipe(gulp.dest(dirs.dist + '/plugins/font-awesome/css')),
		gulp.src(['node_modules/font-awesome/fonts/*'])
			.pipe(gulp.dest(dirs.dist + '/plugins/font-awesome/fonts'))
	) ;
});

gulp.task('copy:normalize', function () {
    return gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(gulp.dest(dirs.dist + '/plugins/normalize'));
});

gulp.task('copy:bootstrap', function () {
    return all(
        gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(gulp.dest(dirs.dist + '/plugins/bootstrap/css')),
        gulp.src(['node_modules/bootstrap/dist/js/bootstrap.js'])
            .pipe(uglify())
            .pipe(plugins.rename('bootstrap.min.js'))
            .pipe(gulp.dest(dirs.dist + '/plugins/bootstrap/js')),
        gulp.src(['node_modules/bootstrap/dist/fonts/*'])
            .pipe(gulp.dest(dirs.dist + '/plugins/bootstrap/fonts'))
    );
});

gulp.task('copy:clipboard', function () {
    return gulp.src('node_modules/clipboard/dist/clipboard.min.js')
        .pipe(gulp.dest(dirs.dist + '/plugins/clipboard'));
});

gulp.task('copy:license', function () {
    return gulp.src('LICENSE.txt')
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:img', function () {
    return gulp.src(dirs.src + '/img/**/*')
        .pipe(gulp.dest(dirs.dist + "/img"));
});

gulp.task('copy:misc', function () {
    return gulp.src([
        // Copy all files
        dirs.src + '/**/*',

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        '!' + dirs.src + '/**/*.html',
        '!' + dirs.src + '/img/**/*',
        '!' + dirs.src + '/js/**/*.js',
        '!' + dirs.src + '/styles',
        '!' + dirs.src + '/styles/**/*',
        '!' + dirs.src + '/templates',
        '!' + dirs.src + '/templates/**/*',
        '!' + dirs.src + '/plugins/requirejs/**/*',
        '!' + dirs.src + '/**/.editorconfig'
    ], {

        // Include hidden files by default
        dot: true

    })
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('html', [
    'html:static',
    'html:dynamic'
]);

gulp.task('html:static', function() {
    return gulp.src(dirs.src + '/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
			minifyCSS: true,
			minifyJS: true,
            removeComments: true
        }))
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('html:dynamic', function() {
    var options = {
        batch: [dirs.src + '/templates/partials'],
		helpers: {
        	set: function(options) {
        		for (var attr in options.hash) {
        			this[attr] = options[attr];
				}
			},
			eq: function(left, right) {
				return left === right;
			}
		}
    };

    return gulp.src([dirs.src + '/templates/**/*.hbs',
        '!' + dirs.src + '/templates/partials/**/*.hbs',
        '!' + dirs.src + '/templates/template.hbs'])
        .pipe(handlebars(hbsGlobalConfig, options))
        .pipe(plugins.rename(function(path) {
            path.extname = '.html';
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
			minifyCSS: true,
			minifyJS: true,
            removeComments: true
        }))
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('css', function () {
    return gulp.src([dirs.src + '/styles/**/*.less',
        '!' + dirs.src + '/styles/lib/**/*.less'])
        .pipe(less({
            compress: true,
			plugins: [new autoprefix({
				browsers: ['last 2 versions', 'ie >= 8', '> 1%']
			})]
        }))
        .pipe(plugins.rename(function(path) {
            path.extname = '.css';
        }))
        .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('script', function (cb) {
    pump([
            gulp.src([dirs.src + '/js/**/*.js',
                '!' + dirs.src + '/js/require.config.js']),
            uglify(),
            gulp.dest(dirs.dist + "/js")
        ],
        cb
    );
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('archive', function (done) {
    runSequence(
        'build',
        'archive:create_archive_dir',
        'archive:zip',
    done);
});

gulp.task('nginx', function() {
	return gulp.src('nginx.json')
		.pipe(nginxer())
		.pipe(gulp.dest(''));
});

gulp.task('build', function (done) {
    runSequence(
        ['clean', 'lint'],
        'copy',
        ['html', 'css', 'script'],
        done);
});

gulp.task('default', ['build']);
