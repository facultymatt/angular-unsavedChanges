module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        scope: ['dependencies', 'devDependencies']
    });

    grunt.initConfig({
        // end 2 end testing with protractor
        protractor: {
            options: {
                keepAlive: false,
                configFile: './protractor.conf.js'
            },
            singlerun: {},
            travis: {
                configFile: './protractor_travis.conf.js'
            },
            auto: {
                keepAlive: true,
                options: {
                    args: {
                        seleniumPort: 4444
                    }
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    open: 'http://localhost:9001/demo',
                    keepalive: true
                }
            },
            // our protractor server
            testserver: {
                options: {
                    port: 9999
                }
            },
        },
        // watch tasks
        // Watch specified files for changes and execute tasks on change
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['<%= yeoman.test %>/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer']
            },
            lessDev: {
                files: ['<%= yeoman.app %>/{,*/}*.less'],
                tasks: ['less:dev']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/css/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
        },
        shell: {
            options: {
                stdout: true
            },
            selenium: {
                command: './selenium/start',
                options: {
                    stdout: true,
                    async: true
                }
            },
            seleniumStop: {
                command: 'curl -s http://localhost:4444/selenium-server/driver/?cmd=shutDownSeleniumServer'
            },
            protractorInstall: {
                command: 'node ./node_modules/protractor/bin/install_selenium_standalone'
            },
            npmInstall: {
                command: 'npm install'
            },
            bowerInstall: {
                command: 'node ./node_modules/bower/bin/bower install'
            },
        },
        karma: {
            plugins: [
                'karma-osx-reporter'
            ],
            unit: {
                configFile: 'karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unitAuto: {
                configFile: 'karma-unit.conf.js',
                autoWatch: true,
                singleRun: false
            }
        },
        'min': {
            'dist': {
                'src': ['dist/mm.unsavedChanges.js'],
                'dest': 'dist/mm.unsavedChanges.min.js'
            }
        },
        jshint: {
            all: ['src/*.js']
        },
        strip: {
            main: {
                src: 'src/mm.unsavedChanges.js',
                dest: 'dist/mm.unsavedChanges.js'
            }
        }
        // connect: {
        //     server: {
        //         options: {
        //             port: 9001,
        //             open: true,
        //             keepalive: true
        //         }
        //     }
        // }

    });

    grunt.registerTask('test', [
        'test:unit', // - run unit tests
    ]);

    grunt.registerTask('test:unit', [
        'karma:unit'
    ]);

    grunt.registerTask('autotest', [
        'autotest:unit'
    ]);

    grunt.registerTask('autotest:unit', [
        'karma:unitAuto'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'strip:main',
        'min'
    ]);

    grunt.registerTask('autotest:e2e', [
        'connect:testserver', // - starts the app so the test runner can visit the app
        'shell:selenium', // - starts selenium server in watch mode
        'watch:protractor' // - watches scripts and e2e specs, and starts tests on file change
    ]);

    grunt.registerTask('test:e2e', [
        'connect:testserver', // - run concurrent tests
        'protractor:singlerun' // - single run protractor
    ]);

    grunt.registerTask('test:travis', [
        'connect:testserver', // - run concurrent tests
        'protractor:travis' // - single run protractor
    ]);

    grunt.registerTask('test:end2end', [
        'selenium:start', // - run concurrent tests
        'protractor:singlerun' // - single run protractor
    ]);

    grunt.registerTask('selenium', [
        'selenium:start' // - starts selenium server in watch mode
    ]);

    grunt.registerTask('selenium:start', [
        'shell:selenium' // - starts selenium server in watch mode
    ]);

    grunt.registerTask('selenium:stop', [
        'shell:seleniumStop' // - stops server
    ]);

    // initial install
    grunt.registerTask('install', [
        'update', // - Runs grunt update task, which runs `bower` and `npm` install 
        'shell:protractorInstall' // - install protractor, seleium, et el.
    ]);

    // update
    grunt.registerTask('update', [
        'shell:npmInstall',
        'shell:bowerInstall'
    ]);

};
