angular.module('mainApp').directive("clockDiv", function(){
  return {
    restrict: "E",
    controller: "game-screen-clock",
    templateUrl: "/templates/gamescreen/clockview"
  }
});

angular.module('mainApp').directive('highScoresDiv', function(){
  return {
    restrict: "E",
    controller: "game-screen-high",
    templateUrl: "/templates/gamescreen/highview"
  }
});

angular.module('mainApp').directive('quesDiv', function(){
  return {
    restrict: "E",
    controller: "game-screen-ques",
    templateUrl: "/templates/gamescreen/quesview"
  }
});
