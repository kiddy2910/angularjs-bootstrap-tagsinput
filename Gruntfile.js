module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-bump');

    var userConfig = require('./build.config.js');

    var taskConfig = {
        pkg: grunt.file.readJSON("package.json"),
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.name %>\n' +
                ' * Version: <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
                ' *\n' +
                ' * Author: <%= pkg.authors[0] %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> \n' +
                ' */\n'
        },

        clean: {
            dist_dir: [ '<%= build_dir %>' ],
            temp_dir: [ '<%= build_dir %>/temp/' ]
        },

        copy: {
            build: {
                files: [
                    {
                        src: [ '*.js' ],
                        dest: '<%= build_dir %>/temp/',
                        cwd: 'src/',
                        expand: true
                    }
                ]
            },
            compile: {
                files: [
                    {
                        src: [ '*.js' ],
                        dest: '<%= build_dir %>/temp/',
                        cwd: '<%= build_dir %>/',
                        expand: true
                    }
                ]
            }
        },

        concat: {
            build: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: [ '<%= build_dir %>/temp/*.js' ],
                dest: '<%= build_dir %>/<%= pkg.name %>.js'
            }
        },

        ngmin: {
            build: {
                files: [
                    {
                        src: [ '*.js' ],
                        cwd: '<%= build_dir %>/',
                        dest: '<%= build_dir %>/',
                        expand: true
                    }
                ]
            }
        },

        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    '<%= build_dir %>/<%= pkg.name %>.js': '<%= build_dir %>/<%= pkg.name %>.js'
                }
            }
        },

        recess: {
            options: {
                compile: true,
                compress: false,
                noUnderscores: false,
                noIDs: false,
                zeroUnits: false
            },

            build: {
                src: [ '<%= src_files.less %>'],
                dest: '<%= build_dir %>/<%= pkg.name %>.css'
            }
        },

        jshint: {
            src: [
                '<%= src_files.js %>'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            options: {
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true
            },
            globals: {}
        },

        html2js: {
			build: {
				options: {
					base: 'src',
					module: 'angularjs.bootstrap.tagsinput.template',
                    rename: function(module) {
                        return "angularjs/bootstrap/tagsinput/" + module;
                    }
				},
				src: [ '<%= src_files.tpl %>' ],
				dest: '<%= build_dir %>/temp/tagsinput-template.js'
			}
		}
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    grunt.renameTask('watch');
    grunt.registerTask('watch', [ 'build', 'delta']);
    grunt.registerTask('deploy', [ 'build', 'compile' ]);
    grunt.registerTask('build', [
        'clean:dist_dir', 'jshint', 'recess',
        'html2js', 'copy:build', 'concat', 'ngmin',
        'clean:temp_dir'
    ]);
    grunt.registerTask('compile', [ 'uglify' ]);
};