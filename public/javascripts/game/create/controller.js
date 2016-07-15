angular.module('mainApp').controller('create-cont', ['$scope', '$http', function($scope, $http){

   $scope.gameDetails = {
      questions: [],
      name: "",
      minutes: 60
   };
   $scope.dataRecieved = false;
   $scope.error = "";

   $scope.create = function(){
      $http.post("/services/create/game", $scope.gameDetails).then(function(result){
         if(result.data.error!=null){
            $scope.error = result.data.error.message;
            return;
         }
         if(result.status===200){
            window.location.href = "/gameScreen/gamestartscreen"
         }else{
            $scope.error = result.data;
         }
      }, function(err){
         $scope.error = err;
      })
   }

}]);
