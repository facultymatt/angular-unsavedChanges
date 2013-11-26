module.exports = function(grunt) {

    // tasks
    grunt.registerTask('default', ['jshint', 'strip:main', 'min']);
    //grunt.registerTask('server', ['connect:server']);

    // config
    grunt.initConfig({
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
                    open: 'http://127.0.0.1:9001/demo',
                    keepalive: true
                }
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-yui-compressor');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-strip');

};
