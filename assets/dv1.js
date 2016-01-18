'use strict';


// app
angular.module( 'dv1', [] )



// common data service
.factory( 'application', function() {
	let data = {};

	this.saveAggrieved = function( aggrievedData, isApplicant ) {
		data.aggrieved = aggrievedData;
		data.aggrievedIsApplicant = isApplicant === true;
	};
	this.saveApplicant = function( applicantData ) {
		data.applicant = applicantData;
	};
	this.saveRespondent = function( respondentData ) {
		data.respondent = respondentData;
	};

	this.getData = function() {
		return angular.copy( data );
	};

	return this;
})



// controller for interview
.controller( 'InterviewController', function( application ) {
	let vm = this;
	vm.page = 1; // preamble
	let backupAggrieved = {};

	vm.saveAggrieved = function() {
		application.saveAggrieved( vm.aggrieved, vm.applicantIsAggrieved );
	};
	vm.saveApplicant = function() {
		application.saveApplicant( vm.applicant );
	};
	vm.saveRespondent = function() {
		application.saveRespondent( vm.Respondent );
	};


	// applicant is aggrieved?
	vm.checkApplicant = function() {
		if ( vm.applicantIsAggrieved ) {
			backupAggrieved = vm.aggrieved;
			vm.aggrieved = vm.applicant;
		} else {
			vm.aggrieved = backupAggrieved;
		}

		vm.saveAggrieved();
	};


	// move through interview
	vm.completePreamble = function() {
		vm.saveApplicant();
		vm.page = 2;
	};

	return vm;
})



// controller for gazetted form UI
.controller( 'DV1FormController', function( application ) {
	let gazetteData = {
		aggrieved: {
			name: {
				given: 'Aggrieved'
			}
		},
		applicant: {
			name: {
				given: 'Applicant'
			}
		},
		respondent: {
			name: {
				given: 'Respondent'
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

		vm.view.gazette = false;
	};

	return vm;
});