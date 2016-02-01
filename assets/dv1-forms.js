'use strict';


// app
angular.module( 'dv1' )
// controller for gazetted form UI
.controller( 'DV1FormController', [ 'application', function( application ) {
	let gazetteData = {
		aggrieved: {
			name: {
				given: 'Aggrieved',
				the: 'the Aggrieved'
			}
		},
		applicant: {
			name: {
				given: 'Applicant',
				the: 'the Applicant'
			}
		},
		respondent: {
			name: {
				given: 'Respondent',
				the: 'the Respondent'
			}
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
					given: 'Kim'
				}
			},
			respondent: {
				name: {
					given: 'Ashley'
				}
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

	return vm;
}]);
