'use strict';

// app
angular.module( 'dvDocumentApp' )
.controller( 'DvaDocumentForm1Controller', function() {

	let f1 = this;

	// first question
	f1.pages = [
		{ number: 1 },
		{ number: 2 },
		{ number: 3 },
		{ number: 4 },
		{ number: 5 },
		{ number: 6 },
		{ number: 7 },
		{ number: 8 },
		{ number: 9 },
		{ number: 10 },
		{ number: 11 },
		{ number: 12 }
	];

	f1.gotoPage = function( pageNumber ) {
		f1.page = f1.pages[ pageNumber - 1 ];
	};

	f1.gotoPage( 1 );

	return f1;
})


.directive( 'dvaF1', [function() {
	return {
		restrict: 'C',
		scope: true,
		controller: 'DvaDocumentForm1Controller as f1',
		templateUrl: 'dva-f-1.html'
	};
}]);
