angular.module("mainApp").directive('userHighScores',function(){
   return {
      restrict: "E",
      controller: "user-high-scores-ctrl",
      scope: {
         gameId: "@?"
      },
      templateUrl: "/templates/mainscreen/highscoreslist"
   }
})
