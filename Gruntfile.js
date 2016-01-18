/*global module */
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

		// watch
		watch: {
			options: {
				spawn: false
			},
			httpd: {
				files: '*.html',
				tasks: [ '' ]
			}
		}
	});


	// plugins
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );


	// helpers
	// grunt.registerTask( 'test', [ '' ]);
	// grunt.registerTask( 'build', [ '' ]);
	grunt.registerTask( 'default', [ 'connect:devserver', 'watch' ]);
};
