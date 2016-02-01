'use strict';


// app
angular.module( 'dv1' )
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
}]);
