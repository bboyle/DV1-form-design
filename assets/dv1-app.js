'use strict';


// app
angular.module( 'dv1', [] )



// common data service
.factory( 'application', [function() {
	let data = {};

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
