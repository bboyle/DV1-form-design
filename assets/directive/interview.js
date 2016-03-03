'use strict';


// app
angular.module( 'dv1' )
// controller for interview
.controller( 'InterviewController', [ 'application', '$scope', '$document',
 function(                             application ,  $scope ,  $document ) {

	let vm = this;

	vm.PAGE = {
		PREAMBLE: 1,
		STORY: 2,
		AGGRIEVED: 3,
		RESPONDENT: 4,
		RELATIONSHIP: 5,
		ORDERS: 6,
		GROUNDS: 7,
		URGENT: 8,
		CHILDREN: 9,
		ASSOCIATES: 10,
		CONDITIONS: 11,
		WEAPONS: 12,
		APPLICANT: 13,
		NEXT: 14
	};
	vm.pageUnlocked = 0;

	var backupAggrieved;


	vm.updateParties = function() {
		vm.applicantIsAggrieved = vm.applicant.relationship === 'me';
		application.setGender( vm.aggrieved, vm.applicant.relationship );
		application.saveAggrieved( vm.aggrieved, vm.applicantIsAggrieved );

		if ( vm.party ) {
			if ( vm.party.indexOf( 'family' ) !== -1 ) {
				application.setGender( vm.respondent, vm.partyFamily );
			} else if ( /partner|ex/.test( vm.party )) {
				application.setGender( vm.respondent, vm.partyIntimate );
			} else {
				application.setGender( vm.respondent, vm.party );
			}
			application.saveRespondent( vm.respondent );
		}
	};

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
		} else if ( backupAggrieved ) {
			vm.aggrieved = backupAggrieved;
		}

		vm.saveAggrieved();
	};


	// temporary protection orders
	vm.updateTemporaryProtection = function() {
		application.saveTemporaryProtection( vm.temporaryProtection );
	};


	// page navigation
	vm.goto = function( dest, event ) {
		if (event && $scope[event.target.name].$invalid) {
			return;
		}
		vm.page = dest;
		vm.pageUnlocked = Math.max( vm.pageUnlocked, dest );
		$document.scrollTop( 0 );
	};

	// move through interview
	vm.completePreamble = function() {
		vm.saveApplicant();
		vm.goto( vm.page + 1 );
	};

	// init
	angular.merge( vm, application.getData() );
	vm.goto( 1 );

	return vm;
}])

.directive( 'dvInterview', [function() {
	return {
		restrict: 'C',
		scope: true,
		controller: 'InterviewController as interview',
		templateUrl: 'assets/directive/interview.html'
	};
}]);
