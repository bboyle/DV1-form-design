'use strict';

// app
angular.module( 'dvDocumentApp' )
.controller( 'DvaDocumentSafetyController', function() {

})

.directive( 'dvaFSafety', [function() {
	return {
		restrict: 'C',
		scope: true,
		controller: 'DvaDocumentSafetyController as safety',
		templateUrl: 'dva-f-safety.html'
	};
}]);
