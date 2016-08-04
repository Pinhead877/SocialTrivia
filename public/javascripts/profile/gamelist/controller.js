angular.module("mainApp").controller('game-list-ctrl', ['$scope', '$http', '$window', function($scope, $http, $window){
   $scope.gamesList = [];

   $scope.getGames = function(){
      if($scope.games == null){
         $http.get('/profile/getGames').then(function(result){
            if(result.data.error){
               alert(result.data.error.message);
            }else{
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
