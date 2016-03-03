'use strict';


// app
angular.module( 'dv1' )
// controller for interview
.controller( 'CheckListFormController', [ 'application', '$scope', '$element',
 function(                                 application ,  $scope ,  $element ) {

	let vm = this;

	return vm;
}])

.directive( 'checklistForm', [function() {
	return {
		restrict: 'C',
		scope: true,
		controller: 'CheckListFormController as checklist',
		templateUrl: 'assets/directive/checklist-form.html'
	};
}]);
