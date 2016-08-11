angular.module('mainApp').controller('game-start-cont', ['$scope', '$http', '_','$window', function($scope, $http, _, $window){

   $scope.colors = ['#cbbeb5', '#68ebd4','#f9e796', '#90ceff', '#33ff88', '#f0ddf0', '#ffe0e0', '#f08080', '#ff00ff'];

   $scope.playersLogged = [];

   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

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
            $scope.addMsg(result.data.error.message);
         }else{
            $scope.playersLogged = result.data;
            _.forEach($scope.playersLogged, function(player){
               player.color = _.sample($scope.colors);
            });
         }
      });
   }

   $scope.startGame = function(){
      $http.get('/gamescreen/startgame/'+$scope.gameid).then(function(result){
         if(result.data.error){
            $scope.addMsg(result.data.error.message);
         }
         else{
            $window.location = "/gamescreen/"+$scope.gameid;
         }
      });
   }

}]);
