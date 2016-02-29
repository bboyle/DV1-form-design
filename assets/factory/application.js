'use strict';

angular.module( 'dv1' )

// common data service
.factory( 'application', [function() {
	// gender handling for natural language
	const PRONOUN = {
		G: {
			they: 'they',
			their: 'their',
			them: 'them',
		},
		F: {
			they: 'she',
			their: 'her',
			them: 'her',
		},
		M: {
			they: 'he',
			their: 'his',
			them: 'him',
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
		FEMALE_RELATIONSHIPS: /Woman|Female|mother|daughter|sister|neice|aunt|wife|girl/,
		MALE_RELATIONSHIPS: /Man|Male|father|son|brother|nephew|uncle|husband|boy/,
	};


	let data = {};
	data.respondent = { pronoun: PRONOUN.G };
	data.aggrieved  = { pronoun: PRONOUN.G };
	data.applicant  = { pronoun: PRONOUN.G };

	// set gender based on "idenfied as"
	// example: setGender( vm.aggrieved, 'their wife' );
	// wife is in GENDER.FEMALE_RELATIONSHIPS so will set them as female.
	this.setGender = function( party, relationship ) {
		var gender = GENDER.GENERIC;
		if ( GENDER.FEMALE_RELATIONSHIPS.test( relationship )) {
			gender = GENDER.FEMALE;
		} else if ( GENDER.MALE_RELATIONSHIPS.test( relationship )) {
			gender = GENDER.MALE;
		}

		party.gender = GENDER[ gender ];
		party.pronoun = PRONOUN[ gender ];
	}


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
}]);