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


// app
angular.module( 'dv1', [] )


// common data service
.factory( 'application', [function() {
	let data = {};

	this.saveAggrieved = function( aggrievedData, isApplicant ) {
		data.aggrieved = aggrievedData;
		data.aggrievedIsApplicant = isApplicant === true;
		if ( data.aggrieved.gender && ! /^[MFG]$/.test( data.aggrieved.gender )) {
			data.aggrieved.gender = 'G'; // default
		}
		data.aggrieved.pronoun = PRONOUN[ data.aggrieved.gender ];
		if ( isApplicant ) {
			this.saveApplicant( aggrievedData );
		}

		return data.aggrieved;
	};
	this.saveApplicant = function( applicantData ) {
		data.applicant = applicantData;
		return data.applicant;
	};
	this.saveRespondent = function( respondentData ) {
		data.respondent = respondentData;
		if ( data.respondent.gender && ! /^[MFG]$/.test( data.respondent.gender )) {
			data.respondent.gender = 'G'; // default
		}
		data.respondent.pronoun = PRONOUN[ data.respondent.gender ];

		return data.respondent;
	};

	this.saveTemporaryProtection = function( tpoData ) {
		data.temporaryProtection = tpoData;
	};

	this.getData = function() {
		return data;
	};

	return this;
}]);
