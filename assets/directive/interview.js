'use strict';


// app
angular.module( 'dv1' )
// controller for interview
.controller( 'InterviewController', [ 'application', '$scope', '$document',
 function(                             application ,  $scope ,  $document ) {

	let vm = this;

	vm.PAGE = {
		PREAMBLE: 1,
		// aggrieved story
		STORY: 2,
		AGGRIEVED: 3,
		RESPONDENT: 4,
		RELATIONSHIP: 5,
		// what happened and what you want
		GROUNDS: 5,
		CONDITIONS: 6,
		URGENT: 7,
		// other details needed by court
		// your details
		AGGRIEVED2: 8,
		CHILDREN: 9,
		ASSOCIATES: 10,
		// respondent details
		RESPONDENT2: 11,
		// WEAPONS: 12,
		// shared (aggrieved + respondent)
		ORDERS: 12,
		// applicant
		APPLICANT: 13,
		NEXT: 14
	};
	vm.pageUnlocked = 0;

	var backupAggrieved;


	vm.updateParties = function() {
		vm.applicantIsAggrieved = vm.applicant.relationship === 'me';
		application.setGender( vm.aggrieved, vm.applicant.relationship );

		if ( vm.party ) {
			if ( vm.party.indexOf( 'family' ) !== -1 ) {
				vm.aggrieved.relationship.category = 'Family';
				application.setGender( vm.respondent, vm.partyFamily );
			} else if ( /partner|ex/.test( vm.party )) {
				vm.aggrieved.relationship.category = 'Intimate personal';
				application.setGender( vm.respondent, vm.partyIntimate );
				switch ( vm.partyIntimate ) {
				case 'husband':
				case 'wife':
					vm.aggrieved.relationship.type = /ex/.test( vm.aggrieved.relationship.party ) ? 'Past Spouse' : 'Married';
					break;
				}
			} else {
				application.setGender( vm.respondent, vm.party );
			}
			application.saveRespondent( vm.respondent );
		}

		application.saveAggrieved( vm.aggrieved, vm.applicantIsAggrieved );
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

	// add another child
	vm.addChild = function( i ) {
		vm.aggrieved.children.splice( i + 1, 0, {} );
	};
	vm.removeChild = function( i ) {
		vm.aggrieved.children.splice( i, 1 );
	};
	vm.addAssociate = function( i ) {
		vm.aggrieved.associates.splice( i + 1, 0, {} );
	};
	vm.removeAssociate = function( i ) {
		vm.aggrieved.associates.splice( i, 1 );
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

	vm.continue = function( event ) {
		vm.goto( vm.page + 1, event );
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
