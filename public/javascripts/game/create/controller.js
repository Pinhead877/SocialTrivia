angular.module('mainApp').controller('create-cont', ['$scope', '$http', '_', function($scope, $http, _){

   $scope.gameDetails = {
      questions: [],
      name: "",
      minutes: 60
   };
   $scope.dataRecieved = false;
   $scope.error = "";

   $scope.create = function(){
      _.forEach($scope.gameDetails.questions, function(que){
         delete que.$$hashKey;
         delete que.isSelected;
      });
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
