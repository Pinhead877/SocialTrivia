angular.module('mainApp').controller('game-start-cont', ['$scope', '$http', '$interval','$window', function($scope, $http, $interval, $window){
   $scope.playersLogged = [];

   $scope.getPlayers = function(){
      $http.get('/users/loggedToGameList').then(function(result){
         if(result.data.error){
            alert(result.data.error.message);
            return;
         }else{
            $scope.playersLogged = result.data;
         }
      });
   }

   $scope.startGame = function(){
      $http.get('/gamescreen/startgame').then(function(result){
         if(result.data.error){
            if(result.data.error.code==2010){
               //redirect to the game result screen
               $window.location.href = "/";
            }else{
               alert(result.data.error.message);
               return;
            }
         }
         else{
            $window.location = "/gamescreen/"+$scope.gameid;
         }
      });
   }

   //chagne to socket!
   var updatePlayersInterval = $interval(function(){
      $scope.getPlayers();
   } ,1000);
}]);
