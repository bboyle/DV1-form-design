'use strict';


// app
angular.module( 'dv1', [] )



// common data service
.factory( 'application', [function() {
	let data = {};

	this.saveAggrieved = function( aggrievedData, isApplicant ) {
		data.aggrieved = aggrievedData;
		data.aggrievedIsApplicant = isApplicant === true;
		if ( isApplicant ) {
			this.saveApplicant( aggrievedData );
		}
	};
	this.saveApplicant = function( applicantData ) {
		data.applicant = applicantData;
	};
	this.saveRespondent = function( respondentData ) {
		data.respondent = respondentData;
	};

	this.saveTemporaryProtection = function( tpoData ) {
		data.temporaryProtection = tpoData;
	};

	this.getData = function() {
		return data;
	};

	return this;
}])



// controller for interview
.controller( 'InterviewController', [ 'application', function( application ) {

	let vm = this;

	vm.PAGE = {
		PREAMBLE: 1,
		APPLICANT: 2,
		AGGRIEVED: 3,
		RESPONDENT: 4,
		CONDITIONS: 5,
		GROUNDS: 6
	};
	vm.pageUnlocked = 0;

	let backupAggrieved = {};

	vm.saveAggrieved = function() {
		application.saveAggrieved( vm.aggrieved, vm.applicantIsAggrieved );
	};
	vm.saveApplicant = function() {
		if ( vm.applicantIsAggrieved ) {
			application.saveAggrieved( vm.aggrieved, vm.applicantIsAggrieved );
		} else {
			application.saveApplicant( vm.applicant );
		}
	};
	vm.saveRespondent = function() {
		application.saveRespondent( vm.respondent );
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


	// temporary protection orders
	vm.updateTemporaryProtection = function() {
		application.saveTemporaryProtection( vm.temporaryProtection );
	};


	// page navigation
	vm.goto = function( dest ) {
		vm.page = dest;
		vm.pageUnlocked = Math.max( vm.pageUnlocked, dest );
	};

	// move through interview
	vm.completePreamble = function() {
		vm.saveApplicant();
		vm.goto( vm.page + 1 );
	};

	// init
	vm.goto( 1 );

	return vm;
}])



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
