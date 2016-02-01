/*global module, require */
module.exports = function( grunt ) {

	// var pkg = grunt.file.readJSON( 'package.json' );

	// config
	grunt.initConfig({

		// local web server
		connect: {
			options: {
				base: './',
				middleware: require( './lib/connect-middleware-swe-include' ).sweInclude
			},
			devserver: {
				options: {
					directory: './',
					port: 8888
				}
			}
		},

		// code qa
		eslint: {
			app: { src: 'assets/*.js' }
		},

		// watch
		watch: {
			options: {
				spawn: false
			},
			lint: {
				files: 'assets/*.js',
				tasks: [ 'eslint:app' ]
			}
		}
	});


	// plugins
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-eslint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );


	// helpers
	grunt.registerTask( 'test', [ 'eslint' ]);
	// grunt.registerTask( 'build', [ '' ]);
	grunt.registerTask( 'default', [ 'test', 'connect:devserver', 'watch' ]);
};
