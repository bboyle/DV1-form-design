'use strict';


const PRONOUN = {
	G: {
		they: 'they',
		their: 'their',
		them: 'them'
	},
	F: {
		they: 'she',
		their: 'her',
		them: 'her'
	},
	M: {
		they: 'he',
		their: 'his',
		them: 'him'
	}
};
const GENDER = {
	F: 'Female',
	G: 'Unknown',
	M: 'Male',
	// keys
	FEMALE: 'F',
	GENERIC: 'G',
	MALE: 'M',
	// regexes
	FEMALE_RELATIONSHIPS: /mother|daughter|sister|neice|aunt|wife|girl/,
	MALE_RELATIONSHIPS: /father|son|brother|nephew|uncle|husband|boy/,
};


angular
.module( 'dv1-pathway', [] )
.controller( 'MadLibController', function() {
	let vm = this;


	vm.applicantIsAggrieved = true;
	vm.respondent = {
		pronoun: PRONOUN.G
	};
	vm.aggrieved = {
		pronoun: PRONOUN.G
	};
	vm.applicant = {};


	// set gender based on "idenfied as"
	// example: setGender( vm.aggrieved, 'their wife' );
	// wife is in GENDER.FEMALE_RELATIONSHIPS so will set them as female.
	function setGender( party, relationship ) {
		var gender = GENDER.GENERIC;
		if ( GENDER.FEMALE_RELATIONSHIPS.test( relationship )) {
			gender = GENDER.FEMALE;
		} else if ( GENDER.MALE_RELATIONSHIPS.test( relationship )) {
			gender = GENDER.MALE;
		}

		party.gender = GENDER[ gender ];
		party.pronoun = PRONOUN[ gender ];
	}


	// track pronouns
	vm.updateParties = function() {
		vm.applicant.isAggrieved = vm.applicant.relationship === 'me';

		switch ( vm.applicant.relationship ) {
		case 'girlfriend':
		case 'daughter':
		case 'mother':
			vm.aggrieved.pronoun = PRONOUN.F;
			break;
		case 'boyfriend':
		case 'son':
		case 'father':
			vm.aggrieved.pronoun = PRONOUN.M;
			break;
		default:
			vm.aggrieved.pronoun = PRONOUN.G;
		}

		if ( vm.party ) {
			if ( vm.party.indexOf( 'family' ) !== -1 ) {
				setGender( vm.respondent, vm.partyFamily );
			} else if ( /partner|ex/.test( vm.party )) {
				setGender( vm.respondent, vm.partyIntimate );
			} else {
				setGender( vm.respondent );
			}
		}
	};

	return vm;
});
