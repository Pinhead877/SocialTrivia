angular.module('mainApp').controller('create-cont', ['$scope', '$http', '$cookies', function($scope, $http, $cookies){
   $scope.data = {};
   $scope.dataRecieved = false;
   $scope.create = function(){
      $http.post("/services/create/game", $scope.data).then(function(result){
         if(result.data._id){
            $scope.data = result.data;
            $scope.log = "Game Number: "+$scope.data._id;
            $cookies.put("gameid", $scope.data._id);
            $scope.dataRecieved = true;
         }else{
            $scope.log = result.data;
         }
      }, function(err){
         $scope.log = err;
      })
   }
   $scope.continue = function(){

   }
}]);
