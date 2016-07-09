angular.module('mainApp').controller('create-cont', ['$scope', '$http', function($scope, $http){

   $scope.gameDetails = {
      questions: [],
      name: ""
   };
   $scope.dataRecieved = false;
   $scope.error =

   $scope.create = function(){
      $http.post("/services/create/game", $scope.gameDetails).then(function(result){
         if(result.data.error!=null){
            $scope.error = result.data.error.message;
            return;
         }
         if(result.status===200){
            window.location.href = "/gameScreen/gamestart"
         }else{
            $scope.error = result.data;
         }
      }, function(err){
         $scope.error = err;
      })
   }

   window.onbeforeunload = function(event) {
      //TODO - exit game function.
      // needs to be timed for the user to have time to return to the game.
   }

   $scope.continue = function(){

   }

}]);
