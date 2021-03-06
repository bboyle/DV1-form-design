'use strict';

// app
angular.module( 'dvDocumentApp' )
.controller( 'DvaDocumentForm1Controller', function( $scope ) {

	let f1 = this;

	// first question
	f1.pages = [
		{ number:  1, url: 'assets/partials/dva-f-1-aggrieved.html' },
		{ number:  2, url: 'assets/partials/dva-f-1-respondent.html' },
		{ number:  3, url: 'assets/partials/dva-f-1-applicant.html' },
		{ number:  4 },
		{ number:  5 },
		{ number:  6 },
		{ number:  7 },
		{ number:  8 },
		{ number:  9 },
		{ number: 10 },
		{ number: 11 },
		{ number: 12 }
	];

	f1.meta = {
		dateCreated: new Date()
	};
	f1.aggrieved = {
		address: {
			state: 'QLD',
			country: 'Australia'
		},
		parent: {
			address: {
				state: 'QLD',
				country: 'Australia'
			}
		}
	};
	f1.respondent = {
		address: {
			state: 'QLD',
			country: 'Australia'
		},
		parent: {
			address: {
				state: 'QLD',
				country: 'Australia'
			}
		}
	};
	f1.applicant = {
		address: {
			state: 'QLD',
			country: 'Australia'
		}
	};


	// age and date of birth
	function under18( party ) {
		return function( dob ) {
			if (! angular.isDate( dob )) {
				return;
			}
			// http://www.romcartridge.com/2010/01/javascript-function-to-calculate-age.html
			var today = f1.meta.dateCreated;
			var age = today.getFullYear() - dob.getFullYear();
			if (today.getMonth() < dob.getMonth() - 1 || (dob.getMonth() - 1 == today.getMonth() && today.getDate() < dob.getDate() )) {
				age--;
			}
			f1[ party ].under18 = age < 18;
		};
	}

	$scope.$watch( 'f1.aggrieved.dateOfBirth',  under18( 'aggrieved'  ));
	$scope.$watch( 'f1.respondent.dateOfBirth', under18( 'respondent' ));


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
