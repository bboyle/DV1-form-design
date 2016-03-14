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
		GROUNDS: 6,
		CONDITIONS: 7,
		URGENT: 8,
		// other details needed by court
		// your details
		AGGRIEVED2: 9,
		CHILDREN: 10,
		ASSOCIATES: 11,
		// respondent details
		RESPONDENT2: 12,
		// WEAPONS: 12,
		// shared (aggrieved + respondent)
		ORDERS: 13,
		// applicant
		APPLICANT: 14,
		NEXT: 15
	};
	vm.pageUnlocked = 0;

	var backupApplicant;


	vm.updateParties = function() {
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
			vm.saveRespondent();
		}

		vm.saveAggrieved();
	};

	vm.saveAggrieved = function() {
		application.setGender( vm.aggrieved, vm.aggrieved.genderIdentity );
		application.saveAggrieved( vm.aggrieved, vm.applicantIsAggrieved );
		if ( vm.applicantIsAggrieved ) {
			vm.applicant = vm.aggrieved;
		}
	};
	vm.saveApplicant = function() {
		if ( vm.applicantIsAggrieved ) {
			application.saveAggrieved( vm.aggrieved, vm.applicantIsAggrieved );
		} else {
			application.setGender( vm.applicant, vm.applicant.genderIdentity );
			application.saveApplicant( vm.applicant );
		}
	};
	vm.saveRespondent = function() {
		application.setGender( vm.respondent, vm.respondent.genderIdentity );
		application.saveRespondent( vm.respondent );
	};


	// applicant is aggrieved?
	vm.checkApplicant = function() {
		if ( vm.applicantIsAggrieved ) {
			backupApplicant = angular.copy( vm.applicant );
			vm.applicant = vm.aggrieved;
		} else if ( backupApplicant ) {
			vm.applicant = backupApplicant;
		} else {
			vm.applicant = { name: { short: 'the applicant' }};
		}

		vm.saveAggrieved();
	};
	vm.checkLodger = function() {
		vm.applicantIsAggrieved = vm.whoWillLodge === 'aggrieved';
		vm.checkApplicant();
	};


	// temporary protection orders
	vm.updateTemporaryProtection = function() {
		application.saveTemporaryProtection( vm.temporaryProtection );
	};

	// add another child
	vm.addChild = function( i ) {
		vm.children.splice( i + 1, 0, {} );
	};
	vm.removeChild = function( i ) {
		vm.children.splice( i, 1 );
	};
	vm.addAssociate = function( i ) {
		vm.associates.splice( i + 1, 0, {} );
	};
	vm.removeAssociate = function( i ) {
		vm.associates.splice( i, 1 );
	};


	vm.childLivesWith = function( child ) {
		if ( /^(aggrieved|applicant|respondent)$/.test( child.livesWith ) && typeof vm[ child.livesWith ] === 'object') {
			child.address = vm[ child.livesWith ].address;
			child.confidential = vm[ child.livesWith ].confidential;
		}
	};

	vm.updateConfidentiality = function( party ) {
		$.each( vm.children, function( i, child ) {
			if ( child.livesWith === party ) {
				child.confidential = vm[ party ].confidential;
			}
		});
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

	vm.reset = function() {
		// wipe all application data
		vm.aggrieved  = {
			name: { short: 'the aggrieved' },
			relationship: {}
		};
		vm.saveAggrieved();

		vm.applicant  = { name: { short: 'the applicant' }};
		vm.saveApplicant();

		vm.respondent = { name: { short: 'the respondent' }};
		vm.saveRespondent();

		vm.children = [ {} ];
		vm.associates = [ {} ];
		vm.grounds = {};
		vm.conditions = {};
		vm.pageUnlocked = 1;
		vm.goto( 1 );
	};

	vm.downloadPrepared = function() {
		// activate download form
		$('#download-prepared').submit();
	};


	vm.prefill = function() {
		vm.aggrieved = {
			name: {
				given: 'Marjorie',
				family: 'Simpson'
			},
			genderIdentity: 'Female',
			address: '742 Evergreen Terrace, Springfield QLD 4300',
			dateBirth: '19 March 1980',
			relationship: {
				category: 'Intimate personal',
				type: 'Past Couple',
				couple: 'We dated in high school and went to prom.'
			}
		};
		vm.applicantIsAggrieved = true;
		vm.saveAggrieved();
		vm.aggrieved.name.short = 'Marge';

		vm.respondent = {
			name: {
				given: 'Artie',
				family: 'Ziff'
			},
			genderIdentity: 'Male',
			address: '5 Helicopter Boulevard, Springfield 4300',
			dateBirth: '5 May 1980'
		};
		vm.saveRespondent();

		vm.conditions = { nameChildren: true };
		vm.grounds = { children: 'Artie put a hidden camera inside our home.' };
		vm.children = [{
			name: { full: 'Bartholomew J Simpson' },
			genderIdentity: 'Male',
			dateBirth: '1 April 2006',
			address: vm.aggrieved.address
		}, {
			name: { full: 'Lisa Marie Simpson' },
			genderIdentity: 'Female',
			dateBirth: '9 May 2006',
			address: vm.aggrieved.address
		}, {
			name: { full: 'Margaret Simpson' },
			genderIdentity: 'Female',
			dateBirth: '29 February 2015',
			address: vm.aggrieved.address
		}];
	};

	// init
	angular.merge( vm, application.getData() );
	vm.children = [ {} ];
	vm.associates = [ {} ];

	vm.goto( 1 );

	return vm;
}])

.directive( 'dvInterview', [function() {
	return {
		restrict: 'C',
		scope: true,
		controller: 'InterviewController as interview',
		templateUrl: 'assets/directive/interview2.html'
	};
}]);
