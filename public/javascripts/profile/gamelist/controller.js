angular.module("mainApp").controller('game-list-ctrl', ['$scope', '$http', '$window', function($scope, $http, $window){
   $scope.gamesList = [];

   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

   $scope.getGames = function(){
      if($scope.games == null){
         $http.get('/profile/getGames').then(function(result){
            if(result.data.error){
               $scope.addMsg(result.data.error.message);
            }else{
               _.forEach(result.data, function(game){
                  game.dateCreated = new Date(game.dateCreated).getTime();
               });
               $scope.gamesList = result.data;
            }
         });
      }else{
         $scope.gamesList = $scope.games;
      }
   }

   $scope.getGames();

   $scope.startGame = function(game){
      $window.location = "/gamescreen/gamestartscreen/"+game._id;
   }

   $scope.seeResults = function(game){
      $window.location = "/gamescreen/results/"+game._id;
   }

   $scope.goToGame = function(game){
      $window.location = "/gamescreen/"+game._id;
   }

}]);
