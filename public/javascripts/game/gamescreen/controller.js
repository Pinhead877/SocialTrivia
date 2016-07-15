angular.module('mainApp').controller('main-game-ctrl', ["$scope", function($scope){
   socket = io();

   window.onload = function(){
      console.log($scope.gameid);
      socket.emit('room', $scope.gameid);
   }

   socket.on('selected', function(num){
     console.log('selected: '+num);
     $('#num'+num).removeClass("unanswered");
     $('#num'+num).addClass("selected");
   });

   socket.on('unanswered', function(num){
     console.log("unanswered: "+num);
     $('#num'+num).removeClass("selected");
     $('#num'+num).addClass("unanswered");
   });

    socket.on('correct', function(num){
      console.log("correct: "+num);
      $('#num'+num).removeClass("selected");
      $('#num'+num).addClass("correct");
    });

    socket.on('wrong', function(num){
      console.log("wrong: "+num);
      $('#num'+num).removeClass("selected");
      $('#num'+num).addClass("wrong");
    });

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
                  clearInterval(timer);
                  $scope.timeOver = true;
                  return;
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
      $http.get('/gamescreen/gethighscores').then(function(result){
         $scope.players = result.data;
      });
   }
   $scope.getPlayers();

}]);

angular.module('mainApp').controller('game-screen-ques', ["$scope", function($scope){
   $scope.numofques = 0;

}]);
