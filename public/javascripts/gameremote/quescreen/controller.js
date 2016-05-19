//TODO Remmeber to minify the file!!!

app.controller('quescreen-cont',["$scope","$location", "$http", function($scope, $location, $http){
  $scope.sendok = function(){
    //TODO maybe post that sends the user details
    $scope.answer = 1;
    $http.get("/services/answers/"+$scope.params.gameId+"/"+$scope.params.queId+"/"+$scope.answer).then(function(res){
      $scope.respond = res.data;
    });
  };
  $scope.sendno = function(){
    $scope.answer = 0;
    $http.get("/services/answers/"+$scope.params.gameId+"/"+$scope.params.queId+"/"+$scope.answer).then(function(res){
      $scope.respond = res.data;
    });
  };

  $scope.$on('$locationChangeStart', function(event) {
    $http.get('/services/back/'+$scope.gameid+'/'+$scope.numin);
  });

}]);
