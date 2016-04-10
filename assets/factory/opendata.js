'use strict';

angular.module( 'dv1' )

// data.qld.gov.au
.factory( 'opendata', [ '$http', '$interpolate',
 function(               $http ,  $interpolate ) {
	// dataset resource IDs
	const DATASETS = {
		court: '400eeff4-d3d4-4d5a-9e99-7f993e768daf',
		victim: '96d6b499-e402-409c-9c91-e8c02f2801c8'
	};
	// where clauses
	const WHERE = {
		court: '"Title" LIKE \'%Magistrates%\'',
		victim: '"Support services" LIKE \'%domestic violence%\''
	};


	function getGeoData( dataset, where, geo ) {
		var distance = $interpolate( '(3959*acos(cos(radians({{ lat }}))*cos(radians("Latitude"))*cos(radians("Longitude")-radians({{ lng }}))+sin(radians({{ lat }}))*sin(radians("Latitude"))))' )( geo );

		var select = [ '*' ];
		select.push( distance + ' AS "Distance"' );

		return $http.get( 'https://data.qld.gov.au/api/action/datastore_search_sql', {
			params: {
				sql: $interpolate( 'SELECT {{ select }} FROM "{{ from }}" WHERE {{ where }} ORDER BY "Distance" LIMIT 3' )({
					select: select.join( ',' ),
					from: dataset,
					where: where
				})
			},
			cache: true
		});
	}


	this.getCourtsNear = function( geo ) {
		return getGeoData( DATASETS.court, WHERE.court, geo );
	};


	this.getVictimServicesNear = function( geo ) {
		return getGeoData( DATASETS.victim, WHERE.victim, geo );
	};

	return this;
}]);