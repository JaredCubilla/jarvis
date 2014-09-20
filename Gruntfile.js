module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({
		sass: {
			dist: {
				files: {
					'build/styles/main.css': 'assets/styles/main.scss'
				}
			}
		},

		cssmin: {
			dist: {
				files: {
					'build/styles/main.css': ['build/styles/main.css']
				}
			}
		},

		jshint: {
			options: {
				reporter: require('jshint-stylish'),
				jshintrc: '.jshintrc'
			},

			dist: ['Gruntfile.js', 'assets/scripts/**/*.js']
		},

		uglify: {
			dist: {
				files: {
					'build/scripts/main.js': ['assets/scripts/main.js']
				}
			}
		},

		imagemin: {
			dist: {
				options: {
					optimizationLevel: 7
				},

				files: [{
					cwd: 'assets/images/',
					src: ['**/*.{png, jpg, gif}'],
					dest: 'build/images/'
				}]
			}
		},

		watch: {
			scripts: {
				options: {
					livereload: true
				},

				files: ['assets/scripts/**/*.js', 'index.html'],
				tasks: ['newer:jshint', 'newer:uglify'],
			},

			sass: {
				options: {
					livereload: true
				},

				files: ['assets/styles/main.scss'],
				tasks: ['newer:sass']
			},

			css: {
				options: {
					livereload: true
				},

				files: ['build/styles/main.css'],
				tasks: ['newer:cssmin']
			}
		},

		connect: {
			test: {
				options: {
					port: 9001,
					open: true,
					livereload: true
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('css', ['newer:sass', 'newer:cssmin']);
	grunt.registerTask('js', ['newer:jshint', 'newer:uglify']);
	grunt.registerTask('default', ['css', 'js', 'connect', 'watch']);
};