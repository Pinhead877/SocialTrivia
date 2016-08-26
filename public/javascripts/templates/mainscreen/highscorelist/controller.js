angular.module("mainApp").controller("user-high-scores-ctrl", ["$scope", "$http", function($scope, $http){

   $scope.messages = [
   ];

   $scope.addMsg = function(type, msg) {
      $scope.messages.push({show: true,type: type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

   $scope.getHighScores = function(){
      var url = ($scope.gameId==null)?'/users/gethighscores':'/services/gethighscores/'+$scope.gameId;
      $http.get(url).then(function(result){
         if(result.data.error){
            $scope.addMsg(result.data.error.message);
         }else{
            $scope.highscores = result.data;
         }
      });
   }

   $scope.getHighScores();

}]);
