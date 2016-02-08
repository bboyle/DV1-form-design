'use strict';


// app
angular.module( 'dv1' )
// controller for gazetted form UI
.controller( 'DV1FormController', [ 'application', function( application ) {
	let gazetteData = {
		aggrieved: {
			name: {
				given: 'Aggrieved',
				family: '',
				the: 'the Aggrieved'
			},
			pronoun: {
				them: 'the Aggrieved'
			},
			gender: ''
		},
		applicant: {
			name: {
				given: 'Applicant',
				family: '',
				the: 'the Applicant'
			},
			pronoun: {
				them: 'the Applicant'
			},
			gender: ''
		},
		respondent: {
			name: {
				given: 'Respondent',
				family: '',
				the: 'the Respondent'
			},
			pronoun: {
				them: 'the Respondent'
			},
			gender: ''
		}
	};

	// view model
	let vm = this;
	angular.merge( vm, gazetteData );
	angular.merge( vm, {
		view: {
			gazette: true
		}
	});


	// switch between names and gazette view
	vm.showGazettedForm = function() {
		angular.merge( vm, gazetteData );
		vm.view.gazette = true;
	};

	vm.showNames = function() {
		let dummyNames = {
			aggrieved: {
				name: {
					given: 'Kim',
					family: 'Smith'
				},
				pronoun: {
					them: 'them'
				},
				gender: ''
			},
			respondent: {
				name: {
					given: 'Ashley',
					family: 'Smith'
				},
				pronoun: {
					them: 'them'
				},
				gender: ''
			}
		};

		angular.merge( vm, dummyNames );
		angular.merge( vm, application.getData() );

		// pronouns and stuff
		// vm.applicant.name.the = vm.applicant.name.given;
		vm.aggrieved.name.the = vm.aggrieved.name.given;
		vm.respondent.name.the = vm.respondent.name.given;

		vm.view.gazette = false;
	};


	vm.gender = function( abbr ) {
		switch ( abbr ) {
		case 'F':
			return 'Female';
		case 'M':
			return 'Male';
		case '':
		case undefined:
			return 'Not specified';
		default:
			return 'Other';
		}
	};

	return vm;
}])



.directive( 'dv1Forms', [function() {
	return {
		restrict: 'C',
		scope: true,
		controller: 'DV1FormController as dv1',
		templateUrl: 'dv1-forms.html'
	};
}]);
