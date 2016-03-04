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
			your: 'their'
		},
		F: {
			they: 'she',
			their: 'her',
			them: 'her',
			your: 'her'
		},
		M: {
			they: 'he',
			their: 'his',
			them: 'him',
			your: 'his'
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
	data.respondent = {
		name: { short: 'the respondent' },
		pronoun: PRONOUN.G
	};
	data.aggrieved  = {
		name: { short: 'the aggrieved' },
		pronoun: PRONOUN.G,
		relationship: {}
	};
	data.aggrieved.pronoun.you = data.aggrieved.name.short;
	data.applicant  = {
		name: { short: 'the applicant' },
		pronoun: PRONOUN.G
	};

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
	};


	this.saveAggrieved = function( aggrievedData, isApplicant ) {
		data.aggrieved = aggrievedData;
		data.aggrievedIsApplicant = isApplicant === true;
		data.aggrieved.name.short = data.aggrieved.name.given || 'the aggrieved';
		if ( isApplicant ) {
			this.saveApplicant( aggrievedData );
			data.aggrieved.pronoun.you = 'you';
			data.aggrieved.pronoun.your = 'your';
		} else {
			data.aggrieved.pronoun.you = data.aggrieved.name.short;
			data.aggrieved.pronoun.your = PRONOUN[ data.aggrieved.gender ].your || PRONOUN.G.your;
		}
	};
	this.saveApplicant = function( applicantData ) {
		data.applicant = applicantData;
		data.applicant.name.short = data.applicant.name.given || 'the applicant';
	};
	this.saveRespondent = function( respondentData ) {
		data.respondent = respondentData;
		data.respondent.name.short = data.respondent.name.given || 'the respondent';
	};

	this.saveTemporaryProtection = function( tpoData ) {
		data.temporaryProtection = tpoData;
	};

	this.getData = function() {
		return data;
	};

	return this;
}]);