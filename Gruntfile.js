module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'jshint': {
            all: [
                'app/js/main.js',
                'app/js/app.js',
                'app/js/services.js',
                'app/js/controllers.js',
                'app/js/filters.js',
                'app/js/directives.js'
            ],
            options: {
                "curly": true,
                "eqnull": true,
                "eqeqeq": true,
                "undef": true,
                "browser": true,
                "node": true,
                "devel": true,
                "strict": true,
                "globals": {
                    "jQuery": true,
                    "$": true,
                    "angular": true,
                    "ace": true,
                    "Showdown": true,
                    "clipboard": true
                }
            }
        },
        concat_sourcemap: {
            default_options: {
                options: {
                    sourcesContent: true
                },
                files: {
                    'app/js/gisto.min.js': [
                        'app/lib/jquery/jquery-2.0.0.js',
                        'app/lib/angular/angular.js',
                        'app/lib/angular-ui/ui-utils.min.js',
                        'app/js/*/*.js',
                        'app/js/app.js',
                        'app/lib/showdown.js',
                        'app/js/main.js'
                    ]
                }
            }
        },
        watch: {
            scripts: {
                files: '**/*.js',
                tasks: ['concat_sourcemap'],
                options: {
                    interrupt: true
                }
            }
        },
        dev_prod_switch: {
            options: {
                environment: grunt.option('env') || 'dev' // 'prod' or 'dev'
            },
            all: {
                files: {
                    'app/index.html': 'app/index.html' // source: destination
                }
            }
        },
        removelogging: {
            dist: {
                src: 'app/js/<%= pkg.name %>.min.js',
                dest: 'app/js/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dev-prod-switch');
    // grunt.loadNpmTasks('grunt-contrib-jshint'); // Later
    grunt.loadNpmTasks("grunt-remove-logging");

    /**
     * The default task.
     */
    grunt.registerTask('default', [
        // 'grunt-contrib-jshint', // Later
        'concat_sourcemap',
        'removelogging',
        'dev_prod_switch'
    ]);

    /**
     * Can be used as `grunt env --env=prod` or `grunt env --env=dev`
     * or with default task as `grunt --env=dev`
     */
    grunt.registerTask('env', ['dev_prod_switch']);

};
