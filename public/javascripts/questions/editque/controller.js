angular.module("mainApp").controller('que-edit-ctrl', ["$scope",'$uibModalInstance','que', function($scope, $uibModalInstance, que){

   $scope.que = que;
   $scope.close = function (quetionUpdated) {
      $uibModalInstance.close(quetionUpdated);
   };

   $scope.updated = function(){
      alert("Updated");
      $scope.close(true);
   }

}]);
