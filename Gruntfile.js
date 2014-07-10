module.exports = function(grunt)
{
    'use strict';

    require('time-grunt')(grunt);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        shell: {
            patternlab: {
                command: 'php <%= pkg.filepaths.patternlab %>/core/builder.php -gp'
            }
        },

        sass: {
            dist: {
                options: {
                    cacheLocation: '.sass-cache',
                    lineNumbers: true,
                    sourcemap: true,
                    style: 'expanded'
                },
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: '<%= pkg.filepaths.src %>/styles/', // Src matches are relative to this path
                    src: ['*.scss'], // Actual pattern(s) to match
                    dest: '<%= pkg.filepaths.dist %>/styles/', // Destination path prefix
                    ext: '.css' // File extension for file output
                }]
            }
        },

        svgmin: {
            options: {},
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.filepaths.src %>/svg/',
                    src: ['*.svg'],
                    dest: '<%= pkg.filepaths.src %>/svg/'
                }]
            }
        },

        grunticon: {
            icons: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.filepaths.src %>/svg/',
                    src: ['*.svg'],
                    dest: '<%= pkg.filepaths.dist %>/svg/'
                }],
                options: {
                    cssprefix: '.',
                    colors: {
                        orange: '#de5226'
                    }
                }
            }
        },

        copy: {
            src: {
                expand: true,
                cwd: '<%= pkg.filepaths.src %>/',
                src: [
                    'images/*',
                    'images/**/*',
                    'fonts/*'
                ],
                dest: '<%= pkg.filepaths.dist %>'
            },
            dist: {
                expand: true,
                cwd: '<%= pkg.filepaths.dist %>/styles',
                src: ['styleguide.css'],
                dest: '.tmp'
            },
            patternlab: {
                expand: true,
                cwd: '<%= pkg.filepaths.patternlab %>/source/css',
                src: ['style.css'],
                dest: '.tmp'
            }
        },

        jshint: {
            options: {
                jshintrc: '<%= pkg.filepaths.src %>/scripts/.jshintrc'
            },
            files: ['Gruntfile.js', '<%= pkg.filepaths.src %>/scripts/*.js']
            // files: {
            //     src: ['Gruntfile.js', '<%= pkg.filepaths.src %>/scripts/*.js']
            // }
        },

        clean: {
            patternlab: {
                src: ['.tmp']
            }
        },

        concat: {
            patternlab: {
                src: ['.tmp/styleguide.css', '.tmp/style.css'],
                dest: '<%= pkg.filepaths.patternlab %>/public/css/style.css',
            },
        },

        connect: {
            patternlab: {
                options: {
                    open: true,
                    base: '<%= pkg.filepaths.patternlab %>/public',
                    port: 9001,
                    // Change this to '0.0.0.0' to access the server from outside.
                    hostname: 'localhost',
                    livereload: 35729
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            dist: {
                files: [
                    '<%= pkg.filepaths.src %>/styles/**/*.scss',
                    '<%= jshint.files %>'
                ],
                tasks: ['sass', 'merge', 'jshint']
            },
            patternlab: {
                files: [
                    '<%= pkg.filepaths.patternlab %>/source/_patterns/**/*.mustache',
                    '<%= pkg.filepaths.patternlab %>/source/**/*.json',
                    '<%= pkg.filepaths.patternlab %>/source/css/style.css',
                    '<%= pkg.filepaths.src %>/styles/**/*.scss'],
                tasks: ['shell:patternlab', 'styles'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.registerTask('default', ['styles', 'watch:dist']);
    grunt.registerTask('styles', ['sass', 'merge']);
    grunt.registerTask('scripts', ['jshint']);
    grunt.registerTask('icon', ['svgmin', 'grunticon']);
    grunt.registerTask('dist', ['styles', 'scripts', 'icon', 'copy:src']);
    grunt.registerTask('merge', ['copy:dist', 'copy:patternlab', 'concat:patternlab', 'clean:patternlab']);
    grunt.registerTask('patternlab', ['shell:patternlab', 'styles', 'connect:patternlab', 'watch:patternlab']);
};
