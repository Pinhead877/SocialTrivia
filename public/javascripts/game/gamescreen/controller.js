socket = io();
angular.module('mainApp').controller('main-game-ctrl', ["$scope","$window","$http","QuestionsStatuses", function($scope, $window, $http, queServices){

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
      $scope.checkForBlockedQuestion();
   });

   socket.on('wrong', function(num){
      $('#num'+num).removeClass("selected");
      $('#num'+num).addClass("wrong");
   });

   socket.on('blocked', function(num){
      $('#num'+num).removeClass("selected");
      $('#num'+num).removeClass("wrong");
      $('#num'+num).addClass("blocked");
      $scope.checkForBlockedQuestion();
   });

   $scope.showEndGame = function(){
      $scope.showEnd = true;
      $http.get("/services/endgame/"+$scope.gameid);
   }

   $scope.goToResultsPage = function(){
      $window.location.href = "/gamescreen/results/"+$scope.gameid;
   }

   $scope.init = function(gameID){
      $scope.gameid = gameID;
      socket.emit('room', $scope.gameid);
   }

   $scope.checkForBlockedQuestion = function(){
      queServices.isQuestionHaveEnded($scope.gameid).then(function(result){
         if(result){
            $scope.showEndGame();
         }
      });
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
         if($scope.isGameOver===true){
            clearInterval(timer);
            $scope.timeOver = true;
            $scope.endGame();
            $scope.$apply();
         }else{
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
         }
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

angular.module('mainApp').controller('game-screen-ques', ["$scope","$http","QuestionsStatuses", function($scope, $http, queServices){
   queServices.GetStatuses($scope.gameId).then(function(result){
      $scope.questionsStatuses = result;
   });
   queServices.isQuestionHaveEnded($scope.gameId).then(function(result){
      if(result){
         $scope.endGame();
      }
   });
   // $http.get('/services/getQuestionsStatuses/'+$scope.gameId).then(function(result){
   //    if(result.data.error){
   //       alert(result.data.error.massege);
   //    }else{
   //       $scope.questionsStatuses = result.data;
   //       countBlockedQuestions().then(function(numOfBlocked){
   //          if(numOfBlocked==$scope.questionsStatuses.length){
   //             $scope.endGame();
   //          }
   //       });
   //    }
   // });
   // function countBlockedQuestions(){
   //    var defered = $q.defer();
   //    var blockedNums = _.filter($scope.questionsStatuses, function(status){
   //       return status === "blocked" || status === "answered";
   //    });
   //    defered.resolve((blockedNums==null)?0:blockedNums.length);
   //    return defered.promise;
   // }
}]);
