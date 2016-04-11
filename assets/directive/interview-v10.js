'use strict';


// app
angular.module( 'dv1' )
// controller for interview
.controller( 'InterviewController', [ 'application', '$scope', '$http', 'opendata', '$document',
 function(                             application ,  $scope ,  $http ,  opendata ,  $document ) {

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
		// next steps
		COURT: 15,
		DOWNLOAD: 16
	};
	vm.pageUnlocked = 0;


	vm.updateParties = function() {
		if ( vm.applicant.relationship ) {
			application.setGender( vm.aggrieved, vm.applicant.relationship.aggrieved );
		}

		if ( vm.aggrieved.relationship ) {
			if ( vm.party ) {
				if ( vm.party.indexOf( 'family' ) !== -1 ) {
					vm.aggrieved.relationship.family = true;
					application.setGender( vm.respondent, vm.partyFamily );
				} else if ( /partner|ex/.test( vm.party )) {
					vm.aggrieved.relationship.intimate = true;
					application.setGender( vm.respondent, vm.partyIntimate );
					switch ( vm.partyIntimate ) {
					case 'husband':
					case 'wife':
						vm.aggrieved.relationship.type.married = ! /ex/.test( vm.party );
						vm.aggrieved.relationship.type.formerSpouse = /ex/.test( vm.party );
						break;
					default:
						vm.aggrieved.relationship.type.married = false;
						vm.aggrieved.relationship.type.formerSpouse = false;
					}
				} else {
					application.setGender( vm.respondent, vm.party );
				}
				vm.saveRespondent();
			}
		}

		vm.saveAggrieved();
	};

	vm.saveAggrieved = function() {
		application.setGender( vm.aggrieved, vm.aggrieved.genderIdentity );
		application.saveAggrieved( vm.aggrieved, vm.applicantIsAggrieved );
	};
	vm.saveApplicant = function() {
		application.saveApplicant( vm.applicant );
		application.setGender( vm.applicant, vm.applicant.genderIdentity );
	};
	vm.saveRespondent = function() {
		application.setGender( vm.respondent, vm.respondent.genderIdentity );
		application.saveRespondent( vm.respondent );
	};


	// applicant is aggrieved?
	vm.checkApplicant = function() {
		vm.saveAggrieved();
		vm.saveApplicant();
	};
	vm.checkLodger = vm.checkApplicant;


	// check if party identifies as
	vm.identifyAs = function( party, identity ) {
		var value = vm[ party ].identifyAs;
		return value && value.toLowerCase().indexOf( identity.toLowerCase() ) > -1;
	};

	vm.getApplicantRelationship = function() {
		switch ( vm.applicant.part ) {
			case 'A': return 'Authorised';
			case 'B': return 'Acting';
			case 'C': return 'Police';
			case 'D': return 'Child Protection';
		}
	};


	vm.aggrievedAddressChanged = function() {
		delete vm.aggrieved.addressGeo;
		delete vm.nearby;

		var address = vm.aggrieved.address;
		// remove any duplicate country
		address = address.replace( /\b(AU|AUS|Australia)\b/i, '' );

		// test we have more than whitespace
		if ( ! /\W/.test( address )) {
			return;
		}

		$http.get( '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates', {
			params: {
				f: 'json',
				countryCode: 'AU',
				singleLine: address
			},
			cache: true
		}).then(function( response ) {
			if ( response.data.candidates.length ) {
				vm.aggrieved.addressGeo = response.data.candidates[ 0 ].location;
			}
		})
	};

	function findNearbyServices( geo ) {
		vm.nearby = {};

		opendata.getCourtsNear( geo )
		.then(function( response ) {
			var dummyData = [
				{ hours: 'Mon–Fri, 9:00am–4:00pm', DV: 'Monday' },
				{ hours: 'Mon–Fri, 9:00am–4:00pm', DV: 'Thursday' },
				{ hours: 'Mon–Fri, 9:00am–4:00pm', DV: 'Tuesday' }
			];

			if ( response.data && response.data.result && response.data.result.records.length > 0 ) {
				vm.nearby.magistratesCourt = response.data.result.records;
				angular.forEach( vm.nearby.magistratesCourt, function( court, i ) {
					angular.merge( court, dummyData[ i ]);
				});
			}
		});
		opendata.getJPsNear( geo )
		.then(function( response ) {
			if ( response.data && response.data.result && response.data.result.records.length > 0 ) {
				vm.nearby.jp = response.data.result.records;
			}
		});
		opendata.getVictimServicesNear( geo )
		.then(function( response ) {
			if ( response.data && response.data.result && response.data.result.records.length > 0 ) {
				vm.nearby.victimServices = response.data.result.records;
			}
		});
	}

	$scope.$watch(function() { return vm.aggrieved.addressGeo; }, function( geo ) {
		if ( geo && geo.x && geo.y ) {
			findNearbyServices({ lat: geo.y, lng: geo.x });
		}
	});


	// temporary protection orders
	vm.updateTemporaryProtection = function() {
		application.saveTemporaryProtection( vm.temporaryProtection );
	};

	// add another child
	vm.addChild = function( i ) {
		vm.children.splice( i + 1, 0, {
			confidential: {
				address: vm.children[ 0 ].confidential.address
			},
			livesWith: vm.children[ 0 ].livesWith
		});
	};
	vm.removeChild = function( i ) {
		vm.children.splice( i, 1 );
	};
	vm.addAssociate = function( i ) {
		vm.associates.splice( i + 1, 0, {
			confidential: {
				address: vm.associates[ 0 ].confidential.address
			},
		});
	};
	vm.removeAssociate = function( i ) {
		vm.associates.splice( i, 1 );
	};
	vm.addEvent = function( i ) {
		vm.event.splice( i + 1, 0, {} );
	};
	vm.removeEvent = function( i ) {
		vm.event.splice( i, 1 );
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


	vm.existingProtectionOrders = function() {
		vm.orders.exist = vm.orders.exist || vm.existingProtection;
		vm.orders.interstateDVO = /^(ACT|NSW|NT|Sa|Tas|Vic|WA)$/.test( vm.existingProtectionFrom );
		vm.orders.NZ_DVO = vm.existingProtectionFrom === 'NZ';
		vm.ordersOther = vm.existingProtectionFrom === 'Other';
	};

	vm.getGrounds = function() {
		// TODO format grounds for form submission
		return JSON.stringify({
			grounds: vm.abuse,
			events: vm.event
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
		vm.aggrieved = {
			name: {
				short: 'the aggrieved',
				shortCap: 'The aggrieved'
			},
			confidential: {
				address: true,
				contact: true
			},
			relationship: {
				type: {}
			}
		};
		vm.saveAggrieved();

		vm.applicant = {
			name: {
				short: 'the applicant' ,
				shortCap: 'The applicant'
			},
			confidential: {
				address: true
			},
			relationship: {}
		};
		vm.saveApplicant();

		vm.respondent = {
			name: {
				short: 'the respondent' ,
				shortCap: 'The respondent'
			}
		};
		vm.saveRespondent();

		vm.children = [{
			confidential: {
				address: true
			}
		}];
		vm.associates = [{
			confidential: {
				address: true
			}
		}];
		vm.event = [ {} ];
		vm.grounds = {};
		vm.conditions = {};
		vm.orders = {};
		vm.pageUnlocked = 1;

		vm.applicantIsAggrieved = undefined;
		vm.applicantInDanger = undefined;
		vm.safe = undefined;
		vm.party = undefined;
		vm.partyIntimate = undefined;
		vm.partyFamily = undefined;

		vm.goto( 1 );
	};

	vm.quickExit = function() {
		var exitButton = $( '#quick-exit a' );
		if ( exitButton.length ) {
			exitButton[0].click();
		}
	};

	vm.downloadPrepared = function() {
		// activate download form
		$('#download-prepared').submit();
	};


	vm.prefill = function(situation) {
		if (situation === 'Lannister') {
			vm.legalAdvice = 'later';

			vm.aggrieved = {
				name: {
					given: 'Jamie',
					family: 'Lannister'
				},
				genderIdentity: 'Man',
				address: 'Casterly Rock, Lannisport, Westeros',
				dateBirth: '11 June 1974',
				under18: false,
				identifyAs: 'N/A',
				requiresInterpreter: false,
				hasDisability: true,
				disabilityNeeds: 'Jamie has lost his right hand and has difficulty signing documents.',
				relationship: {
					family: true,
					intimate: true,
					type: 'Former Couple',
					partyFamily: 'She is my sister',
					couple: 'They have been a secret couple since they were teenagers. Jamie is the biological father of Joffrey, Myrcella and Tommen.'
				}
			};
			vm.party = 'their family';
			vm.partyFamily = 'sister';
			vm.saveAggrieved();
			vm.applicantIsAggrieved = false;

			vm.applicant = {
				name: {
					given: 'Tyrion',
					family: 'Lannister',
				},
				confidential: {
					address: true
				},
				genderIdentity: 'Man',
				dateBirth: '28 September 1978',
				address: 'Meereen, Slaver\'s Bay, Essos',
				relationship: {
					aggrieved: 'brother'
				}
			};
			vm.saveApplicant();

			vm.respondent = {
				name: {
					given: 'Cersei',
					family: 'Lannister'
				},
				genderIdentity: 'Woman',
				address: 'King\'s Landing, Westeros',
				dateBirth: '11 June 1974',
				under18: false,
				identifyAs: 'N/A',
				requiresInterpreter: false,
				hasDisability: false,
				employment: 'Queen Regent',
				weapon: {
					access: false,
					licence: false
				}
			};
			vm.saveRespondent();

			vm.relationship = {
				home: 'known'
			};

			vm.abuse = {
				emotional: true,
				threat: true,
				coercive: true,
				liberty: true,
				threatenPerson: true,
				selfHarm: true,
				stalking: true,
			};

			vm.conditions = { nameChildren: true };
			vm.grounds = { children: 'Cersei uses her children as pawns in political games.' };
			vm.children = [
			// deceased
			// {
			// 	name: { full: 'Joffrey Baratheon' },
			// 	genderIdentity: 'Boy',
			// 	dateBirth: '1 April 2006',
			// 	address: vm.aggrieved.address
			// },
			{
				name: { full: 'Myrcella Baratheon' },
				genderIdentity: 'Girl',
				dateBirth: '9 May 2006',
				livesWith: 'other',
				confidential: { address: true },
				address: 'Sunspear, Dorne, Westeros'
			}, {
				name: { full: 'Tommon Baratheon' },
				genderIdentity: 'Boy',
				dateBirth: '29 February 2015',
				livesWith: 'respondent',
				address: vm.respondent.address
			}];

		} else {
			vm.aggrieved = {
				name: {
					given: 'Marjorie',
					family: 'Simpson'
				},
				genderIdentity: 'Female',
				address: '742 Evergreen Terrace, Springfield QLD 4300',
				dateBirth: '19 March 1980',
				relationship: {
					intimate: true,
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
		}
	};

	// init
	angular.merge( vm, application.getData() );
	vm.reset();

	return vm;
}])

.directive( 'dvInterview', [function() {
	return {
		restrict: 'C',
		scope: true,
		controller: 'InterviewController as interview',
		templateUrl: 'assets/directive/interview-v10.html'
	};
}]);
