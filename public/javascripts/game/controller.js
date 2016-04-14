app.controller('game-screen-clock', ["$scope", "$log", function($scope, $log){
  var timer;

  $scope.time = {
    hours: 0,
    minutes: 1,
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
            return;
          }
        }
      }
      $scope.$apply();
    },1000);
  }
  startTimeUpdate();
}]);

app.controller('game-screen-high', ["$scope", "$log", function($scope, $log){
  $scope.players = [
    {  name: "Alex", points: 90  },
    {  name: "Alex2", points: 50  },
    {  name: "Alex3", points: 30  }
  ];
}]);

app.controller('game-screen-ques', ["$scope", "$log", function($scope, $log){
  $scope.numOfQues = 50;
}]);
