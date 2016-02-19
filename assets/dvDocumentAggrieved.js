'use strict';

// app
angular.module( 'dvDocumentApp' )
.controller( 'DvaDocumentAggrievedController', function() {

})

.directive( 'dvaFAggrieved', [function() {
	return {
		restrict: 'C',
		scope: true,
		controller: 'DvaDocumentAggrievedController as aggrieved',
		templateUrl: 'dva-f-aggrieved.html'
	};
}]);
