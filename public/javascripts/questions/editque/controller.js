angular.module("mainApp").controller('que-edit-ctrl', ["$scope",'$uibModalInstance','que', function($scope, $uibModalInstance, que){

   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

   $scope.que = que;
   $scope.close = function (quetionUpdated) {
      $uibModalInstance.close(quetionUpdated);
   };

   $scope.updated = function(){
      $scope.close(true);
   }

}]);
