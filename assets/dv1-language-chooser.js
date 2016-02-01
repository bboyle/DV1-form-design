'use strict';

// app
angular.module( 'dv1' )
.controller( 'LanguageChooserController', [ '$element', '$interval',
   function(                                 $element ,  $interval ) {
	let vm = this;
	let i;

	vm.languages = $element.find( 'aside' ).map(function( i, domElement ) {
		return {
			code: domElement.lang,
			dir: domElement.dir || 'ltr',
			title: angular.element( 'h2', domElement ).text()
		};
	});

	vm.showChooser = function( langCode ) {
		vm.show = true;
		vm.lang = langCode;
	};

	function cycleLanguages() {
		i = ( i + 1 ) % vm.languages.length;
		vm.preview = vm.languages[ i ];
	}


	// init
	vm.lang = 'en';
	i = 0;
	vm.preview = vm.languages[ i ];
	$interval( cycleLanguages, 2400 );

	return vm;
}])
.directive( 'languageChooser', [function() {
	return {
		restrict: 'C',
		scope: true,
		controller: 'LanguageChooserController as vm',
		templateUrl: 'language-chooser.html'
	};
}]);
