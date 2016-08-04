angular.module('mainApp').controller('que-list-popup-ctrl',['$scope', '$http', '$uibModalInstance', 'ques', function($scope, $http, $uibModalInstance, ques){
   $scope.quesToReturn = [];

   $scope.questions = ques;

   $scope.ok = function () {
      $uibModalInstance.close($scope.questions);
    };

   $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
   };

}]);
