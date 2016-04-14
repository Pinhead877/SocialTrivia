app.directive("clockDiv", function(){
  return {
    restrict: "E",
    controller: "game-screen-clock",
    templateUrl: "/templates/gamescreen/clockview"
  }
});

app.directive('highScoresDiv', function(){
  return {
    restrict: "E",
    controller: "game-screen-high",
    templateUrl: "/templates/gamescreen/highview"
  }
});

app.directive('quesDiv', function(){
  return {
    restrict: "E",
    controller: "game-screen-ques",
    templateUrl: "/templates/gamescreen/quesview"
  }
});
