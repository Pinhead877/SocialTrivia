angular.module('mainApp').controller('game-start-cont', ['$scope', '$http', '$interval', function($scope, $http, $interval){
   $scope.playersLogged = [];

   $scope.getPlayers = function(){
      $http.get('/users/loggedToGameList').then(function(result){
         console.log(result.data);
         if(result.data.error){
            alert(result.data.error.message);
            return;
         }else{
            $scope.playersLogged = result.data;
         }
      })
   }

   var updatePlayersInterval = $interval(function(){
      $scope.getPlayers();
   } ,1000);
}]);
