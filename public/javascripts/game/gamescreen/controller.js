
angular.module('mainApp').controller('game-screen-clock', ["$scope", function($scope){
   var timer;

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
                  return;
               }
            }
         }
         $scope.$apply();
      },1000);
   }
   startTimeUpdate();
}]);

angular.module('mainApp').controller('game-screen-high', ["$scope", "$log", function($scope, $log){
   $scope.players = [
      {  name: "Alex", points: 90  },
      {  name: "Alex2", points: 50  },
      {  name: "Alex3", points: 30  }
   ];
}]);

angular.module('mainApp').controller('game-screen-ques', ["$scope", "$log", function($scope, $log){
   $scope.numofques = 0;

}]);
