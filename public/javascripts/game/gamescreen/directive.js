angular.module('mainApp').directive("clockDiv", function(){
   return {
      restrict: "E",
      controller: "game-screen-clock",
      scope: {
         endGame: '&onTimeOver',
         isGameOver: "=?"
      },
       link: function(scope, element, attrs){
         scope.time.hours = scope.$eval(attrs.hours);
         scope.time.minutes = scope.$eval(attrs.minutes);
         scope.time.seconds = scope.$eval(attrs.seconds);
       },
      templateUrl: "/templates/gamescreen/clockview"
   }
});

angular.module('mainApp').directive('highScoresDiv', function(){
   return {
      restrict: "E",
      scope: {
         gameId: '@'
      },
      controller: "game-screen-high",
      templateUrl: "/templates/gamescreen/highview"
   }
});

angular.module('mainApp').directive('quesDiv', function(){
   return {
      restrict: "E",
      scope: {
         endGame: '&onGameOver',
         gameId: '@'
      },
      controller: "game-screen-ques",
      templateUrl: "/templates/gamescreen/quesview"
   }
});
