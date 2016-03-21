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
		FEMININE: /Woman|Female|mother|daughter|sister|neice|aunt|wife|girl/i,
		MASCULINE: /Man|Male|father|son|brother|nephew|uncle|husband|boy/i,
	};


	let data = {};
	data.respondent = {
		name: {
			short: 'the respondent',
			shortCap: 'The respondent'
		},
		pronoun: angular.copy( PRONOUN.G )
	};
	data.aggrieved  = {
		name: {
			short: 'the aggrieved',
			shortCap: 'The aggrieved'
		},
		pronoun: angular.copy( PRONOUN.G ),
		relationship: {},
		children: [ {} ],
		associates: [ {} ]
	};
	data.aggrieved.pronoun.you = data.aggrieved.name.short;
	data.aggrieved.pronoun.your = data.aggrieved.pronoun.my = data.aggrieved.name.short + '’s';
	data.applicant  = {
		name: {
			short: 'the applicant',
			shortCap: 'The applicant'
		},
		pronoun: angular.copy( PRONOUN.G )
	};


	// set gender based on "idenfied as"
	// example: setGender( vm.aggrieved, 'their wife' );
	// wife is in GENDER.FEMININE so will set them as female.
	this.setGender = function( party, relationship ) {
		relationship = relationship || party.gender;
		var gender = GENDER.GENERIC;
		if ( GENDER.FEMININE.test( relationship )) {
			gender = GENDER.FEMALE;
		} else if ( GENDER.MASCULINE.test( relationship )) {
			gender = GENDER.MALE;
		}

		party.gender = angular.copy( GENDER[ gender ]);
		party.pronoun = angular.copy( PRONOUN[ gender ]);
	};


	this.saveAggrieved = function( aggrievedData, isApplicant ) {
		data.aggrieved = aggrievedData;
		data.aggrievedIsApplicant = isApplicant === true;
		data.aggrieved.name.short = data.aggrieved.name.given || 'the aggrieved';
		data.aggrieved.name.shortCap = data.aggrieved.name.given || 'The aggrieved';
		if ( isApplicant ) {
			this.saveApplicant( aggrievedData );
			data.aggrieved.pronoun.you = 'you';
			data.aggrieved.pronoun.they = 'you';
			data.aggrieved.pronoun.your = 'your';
			data.aggrieved.pronoun.my = 'my';
			data.aggrieved.pronoun.me = 'me';
		} else {
			data.aggrieved.pronoun.you = data.aggrieved.name.short;
			data.aggrieved.pronoun.your = angular.copy( PRONOUN[ GENDER[ data.aggrieved.gender.toUpperCase() ] || GENDER.GENERIC ].your );
			data.aggrieved.pronoun.my = data.aggrieved.pronoun.your;
			data.aggrieved.pronoun.me = data.aggrieved.name.short;
			if ( data.aggrieved.name.given ) {
				data.aggrieved.pronoun.your = data.aggrieved.name.given + '’s';
			}
		}
	};
	this.saveApplicant = function( applicantData ) {
		data.applicant = applicantData;
		data.applicant.name.short = data.applicant.name.given || 'the applicant';
		data.applicant.name.shortCap = data.applicant.name.given || 'The applicant';
	};
	this.saveRespondent = function( respondentData ) {
		data.respondent = respondentData;
		data.respondent.name.short = data.respondent.name.given || 'the respondent';
		data.respondent.name.shortCap = data.respondent.name.given || 'The respondent';
	};

	this.saveTemporaryProtection = function( tpoData ) {
		data.temporaryProtection = tpoData;
	};

	this.getData = function() {
		return data;
	};

	return this;
}]);