module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        scope: ['dependencies', 'devDependencies']
    });

    grunt.initConfig({

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
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    open: true,
                    keepalive: true
                }
            }
        }

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

};
