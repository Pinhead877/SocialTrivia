angular.module('mainApp').controller('game-start-cont', ['$scope', '$http', '$interval','$window', function($scope, $http, $interval, $window){
   $scope.playersLogged = [];

   var socket = io();
   $scope.init = function(gameid){
      $scope.gameid = gameid;
      socket.emit('room', $scope.gameid);
      socket.on('playersLogged',function(){
         $scope.getPlayers();
      });
      $scope.getPlayers();
   }

   $scope.getPlayers = function(){
      $http.get('/gamescreen/loggedToGameList/'+$scope.gameid).then(function(result){
         if(result.data.error){
            alert(result.data.error.message);
            return;
         }else{
            $scope.playersLogged = result.data;
         }
      });
   }

   $scope.startGame = function(){
      $http.get('/gamescreen/startgame/'+$scope.gameid).then(function(result){
         if(result.data.error){
               alert(result.data.error.message);
               return;
         }
         else{
            $window.location = "/gamescreen/"+$scope.gameid;
         }
      });
   }
   // var updatePlayersInterval = $interval(function(){
   //    $scope.getPlayers();
   // } ,5000);
}]);
