'use strict';

// app
angular.module( 'dvDocumentApp' )
.controller( 'DvaDocumentForm1Controller', function() {

})

.directive( 'dvaF1', [function() {
	return {
		restrict: 'C',
		scope: true,
		controller: 'DvaDocumentForm1Controller as aggrieved',
		templateUrl: 'dva-f-1.html'
	};
}]);
