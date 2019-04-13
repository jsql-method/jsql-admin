'use strict';

var options = {

    appFiles: [
        './src/app/en.js',
        './src/app/modules.js',
        './src/app/constants.js',
        './src/app/modals/**/*.js',
        './src/app/controllers/**/*.js',
        './src/app/components/**/*.js',
        './src/app/directives/**/*.js',
        './src/app/factories/**/*.js',
        './src/app/services/**/*.js',
        './src/app/app.js'
    ],

    libsJsFiles: [
        './bower_components/js-cookie/src/js.cookie.js',
        './bower_components/angular/angular.js',
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/ngstorage/ngStorage.min.js',
        './bower_components/angular-animate/angular-animate.js',
        './bower_components/angular-cookies/angular-cookies.js',
        './bower_components/angular-i18n/angular-locale_en.js',
        './bower_components/angular-resource/angular-resource.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/angular-sanitize/angular-sanitize.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js',
        './bower_components/bootstrap/dist/js/bootstrap.js',
        './bower_components/lodash/dist/lodash.min.js',
        './node_modules/ui-bootstrap4/dist/ui-bootstrap.js',
        './node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js',
        './bower_components/selectize/dist/js/standalone/selectize.min.js',
    ],

    libsCssFiles: [
        './bower_components/selectize/dist/css/selectize.bootstrap3.css',
        './bower_components/bootstrap/dist/css/bootstrap.css',
        './bower_components/normalize.css/normalize.css',
    ],

    bundleFilesJs: [
        './dist/vendor.min.js',
        './dist/templates.min.js',
        './dist/app.min.js'
    ],

    bundleFilesCss: [
        './dist/vendor.min.css',
        './dist/style.min.css'
    ]

};

function generatePaths(begin, extension) {
    var paths = [];

    var path = begin;
    for (var i = 0; i < 5; i++) {
        path += '/**';
        paths.push(path + '/*.' + extension);
    }

    return paths;
}

options.html2js = generatePaths('./src/app', 'html');
options.htmls = generatePaths('./src/app', 'html');
options.htmls.push('./src/index.html');
options.jss = generatePaths('./src/app', 'js');
options.styles = generatePaths('./src/app', 'scss');

module.exports = function (grunt) {

    var history = require('connect-history-api-fallback');

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ng-constant');

    grunt.initConfig({

        connect: {
            options: {
                port: 9090,
                hostname: 'localhost',
                middleware: function (connect, options, middleware) {
                    middleware.unshift(history());
                    return middleware;
                }
            },
            dist: {
                options: {
                    open: true,
                    base: 'dist'
                }
            }
        },

        clean: {
            dist: {
                files: [{
                    src: ['dist/*']
                }]
            },
            prod: {
                files: [{
                    src: ['dist/app.min.js', 'dist/templates.min.js', 'dist/vendor.min.js', 'dist/style.min.scss', 'dist/style.min.css', 'dist/vendor.min.css', 'dist/vendor.min.css', 'dist/style.css.map', 'dist/libs']
                }]
            }
        },

        preprocess: {
            options: {
                context: {
                    ENV: null
                }
            },
            index: {
                src: './dist/index.html',
                dest: './dist/index.html'
            }
        },

        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/style.min.css': 'dist/style.min.scss'
                }
            }
        },

        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/style.min.css': 'dist/style.min.css',
                    'dist/vendor.min.css': 'dist/vendor.min.css'
                }
            }
        },

        concat: {
            options: {
                separator: ''
            },
            bundleCss: {
                src: options.bundleFilesCss,
                dest: './dist/bundle.min.css'
            },
            bundleJs: {
                src: options.bundleFilesJs,
                dest: './dist/bundle.min.js'
            },
            scss: {
                src: ['./src/app/settings.scss', './src/app/mixins.scss', '.src/app/style.scss'].concat(options.styles),
                dest: './dist/style.min.scss'
            },
            js: {
                src: options.appFiles,
                dest: './dist/app.min.js'
            },
            libsJs: {
                src: options.libsJsFiles,
                dest: './dist/vendor.min.js'
            },
            libsCss: {
                src: options.libsCssFiles,
                dest: './dist/vendor.min.css'
            }
        },

        html2js: {
            options: {},
            main: {
                src: options.html2js,
                dest: 'dist/templates.min.js'
            }
        },

        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: '*.js',
                    dest: 'dist'
                }]
            }
        },

        copy: {

            index: {
                files: [

                    {
                        expand: true,
                        dot: true,
                        cwd: 'src',
                        dest: 'dist',
                        src: 'index.html'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'src',
                        dest: 'dist',
                        src: 'loader.js'
                    }

                ]
            },

            dist: {
                files: [

                    {
                        expand: true,
                        dot: true,
                        cwd: 'src',
                        dest: 'dist',
                        src: 'images/**/*'
                    },

                    {
                        expand: true,
                        dot: true,
                        cwd: 'src',
                        dest: 'dist',
                        src: 'robots.txt'
                    }

                ]

            },

            svg: {
                files: [

                    {
                        expand: true,
                        dot: true,
                        cwd: 'src',
                        dest: 'dist',
                        src: 'svg/*'
                    },

                    {
                        expand: true,
                        dot: true,
                        cwd: 'src',
                        dest: 'dist',
                        src: 'robots.txt'
                    }

                ]

            },

            fonts: {

                files: [
                    // {
                    //     expand: true,
                    //     cwd: './bower_components/slick-carousel/slick/fonts/',
                    //     src: ['**'],
                    //     dest: './dist/fonts/'
                    // }
                ]
            }
        },

        concurrent: {

            options: {
                logConcurrentOutput: true
            },

            server: [
                'watch:js',
                'watch:css',
                'watch:html'
            ]

        },

        uglify: {
            dist: {
                options: {
                    mangle: false,
                    preserveComments: true
                },
                files: {
                    './dist/templates.min.js': ['./dist/templates.min.js'],
                    './dist/vendor.min.js': ['./dist/vendor.min.js'],
                    './dist/app.min.js': ['./dist/app.min.js']
                }
            }
        },

        watch: {
            options: {
                spawn: false
            },
            html: {
                files: options.htmls,
                tasks: ['watch-html']
            },
            js: {
                files: options.jss,
                tasks: ['concat:js', 'ngAnnotate']
            },
            css: {
                files: options.styles,
                tasks: ['concat:scss', 'sass', 'cssmin']
            }
        },
        ngconstant: {
            // Options for all targets
            options: {
                space: '  ',
                wrap: '\'use strict\';\n\n {\%= __ngModule %}',
                name: 'constants'
            },
            // Environment targets
            local: {
                options: {
                    dest: './src/app/constants.js'
                },
                constants: {
                    SERVER_URL : 'http://localhost:9191'
                    // PORT: 9026
                }
            },
            dev: {
                options: {
                    dest: './src/app/constants.js'
                },
                constants: {
                    SERVER_URL : 'https://dev-api.jsql.it'
                    // PORT: 9026
                }
            },
            test: {
                options: {
                    dest: './src/app/constants.js'
                },
                constants: {
                    SERVER_URL : 'https://test-api.jsql.it'
                    // PORT: 9024
                }
            },
            prod: {
                options: {
                    dest: './src/app/constants.js'
                },
                constants: {
                    SERVER_URL : 'https://api.jsql.it'
                    // PORT: 9027
                }
            }
        }
    });

    grunt.registerTask('build', [
        'clean',
        'copy:index',
        'copy:dist',
        'copy:svg',
        'copy:fonts',
        'concat:libsJs',
        'concat:libsCss',
        'html2js',
        'concat:js',
        'ngAnnotate',
        'concat:scss',
        'sass',
        'cssmin',
        'preprocess:index'
    ]);

    grunt.registerTask('watch-html', function () {

        grunt.config('preprocess.options.context.ENV', 'development');

        grunt.task.run(['ngconstant:local',
            'copy:index', 'html2js', 'preprocess:index'
        ]);

    });

    grunt.registerTask('dev', function () {

        grunt.config('preprocess.options.context.ENV', 'production');

        grunt.task.run([
            'ngconstant:dev',
             'build',
            'concat:bundleCss',
            'concat:bundleJs',
            'clean:prod'
        ]);

    });

    grunt.registerTask('test', function () {

        grunt.config('preprocess.options.context.ENV', 'production');

        grunt.task.run([
            'ngconstant:test',
             'build',
            'concat:bundleCss',
            'concat:bundleJs',
            'clean:prod'
        ]);

    });

	  grunt.registerTask('prod', function () {

        grunt.config('preprocess.options.context.ENV', 'production');

        grunt.task.run([
            'ngconstant:prod',
            'build',
            'concat:bundleCss',
            'concat:bundleJs',
            'clean:prod'
        ]);

    });
	
    grunt.registerTask('default', function () {

        grunt.config('preprocess.options.context.ENV', 'development');

        grunt.task.run([
            'ngconstant:local',
            'build',
            'connect:dist',
            'concurrent:server'
        ]);

    });

};
