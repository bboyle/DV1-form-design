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
	vm.label = {};
	angular.merge( vm.label, gazetteData );
	angular.merge( vm, {
		view: {
			gazette: true
		}
	});


	// switch between names and gazette view
	vm.showGazettedForm = function() {
		angular.merge( vm.label, gazetteData );
		vm.view.gazette = true;
		vm.invalid = false;
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

		var data = application.getData();
		angular.merge( vm.label, dummyNames );
		angular.merge( vm.label, data );
		angular.merge( vm, data );

		// pronouns and stuff
		// vm.applicant.name.the = vm.applicant.name.given;
		vm.label.aggrieved.name.the = vm.label.aggrieved.name.given;
		vm.label.respondent.name.the = vm.label.respondent.name.given;

		vm.view.gazette = false;
		if ( vm.aggrieved.relationship.category === 'Commercial care' ) {
			vm.issues = [ 'Commercial Care relationships are not covered by the Act.' ];
			vm.invalid = true;
		}
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


	// expand/collapse form
	vm.collapsed = false;
	vm.toggle = function() {
		vm.collapsed = ! vm.collapsed;
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
