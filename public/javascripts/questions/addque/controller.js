angular.module("mainApp").controller('que-add-ctrl', ['$scope', '$http', function($scope, $http){
   $scope.queDetails = {
      isPrivate: false
   };

   $scope.clearQue = function(){
      $scope.queDetails.question = "";
      $scope.queDetails.answer = "";
      $scope.queForm.$setPristine();
   }

   $scope.back = function(){
      window.location.href = "/questions/list";
   }

   $scope.addQuetion = function(){
      if($scope.queForm.$valid){
         $http.post('/questions/create', $scope.queDetails).then(function(result){
            if(result.data.error) alert(result.data.error.message);
            else{
               alert("Added!");
               $scope.added = !$scope.added;
               $scope.clearQue();
            }
         });
      }
   };

}]);
