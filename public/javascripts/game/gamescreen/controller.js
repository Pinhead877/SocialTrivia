socket = io();
angular.module('mainApp').controller('main-game-ctrl', ["$scope","$window","$http", function($scope, $window, $http){

   $scope.showEnd = false;

   socket.on('selected', function(num){
      $('#num'+num).removeClass("unanswered");
      $('#num'+num).addClass("selected");
   });

   socket.on('unanswered', function(num){
      $('#num'+num).removeClass("selected");
      $('#num'+num).addClass("unanswered");
   });

   socket.on('correct', function(num){
      $('#num'+num).removeClass("selected");
      $('#num'+num).removeClass("wrong");
      $('#num'+num).addClass("correct");
   });

   socket.on('wrong', function(num){
      $('#num'+num).removeClass("selected");
      $('#num'+num).addClass("wrong");
   });

   $scope.showEndGame = function(){
      $scope.$apply(function(){
         $scope.showEnd = true;
      });
      $http.get("/services/endgame/"+$scope.gameid);
   }

   $scope.goToResultsPage = function(){
      $window.location.href = "/gamescreen/results/"+$scope.gameid;
   }

   $scope.init = function(gameID){
      $scope.gameid = gameID;
      socket.emit('room', $scope.gameid);
   }

}]);

angular.module('mainApp').controller('game-screen-clock', ["$scope", function($scope){
   var timer;

   $scope.timeOver = false;

   $scope.time = {
      hours: 1,
      minutes: 0,
      seconds: 0
   }

   $scope.$on("$destroy", function(){
      clearInterval(timer);
   });

   function startTimeUpdate(){

      timer = setInterval(function(){
         $scope.time.seconds--;
         if($scope.time.seconds<0){
            $scope.time.seconds=59;
            $scope.time.minutes--;
            if($scope.time.minutes<0){
               $scope.time.minutes=59;
               $scope.time.hours--;
               if($scope.time.hours<0){
                  $scope.time.hours = 0;
                  $scope.time.minutes = 0;
                  $scope.time.seconds = 0;
                  clearInterval(timer);
                  $scope.timeOver = true;
                  $scope.endGame();
               }
            }
         }
         $scope.$apply();
      },1000);
   }
   startTimeUpdate();

   window.onbeforeunload = function(event) {
      if(!$scope.timeOver)
      return "The game isn't over yet. Do you really want to go back?"
   }
}]);

angular.module('mainApp').controller('game-screen-high', ["$scope", "$http", function($scope, $http){
   $scope.getPlayers = function(){
      $http.get('/services/gethighscores/'+$scope.gameId).then(function(result){
         if(result.data.error){
            alert(result.data.error.massege);
         }else{
            $scope.players = result.data;
         }
      });
   }
   socket.on('pointsUpdated', function(){
      $scope.getPlayers();
   });
   $scope.getPlayers();
}]);

angular.module('mainApp').controller('game-screen-ques', ["$scope","$http", function($scope, $http){
   $http.get('/services/getQuestionsStatuses/'+$scope.gameId).then(function(result){
      if(result.data.error){
         alert(result.data.error.massege);
      }else{
         $scope.questionsStatuses = result.data;
      }
   });
}]);
