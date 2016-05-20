//TODO Remmeber to minify the file!!!

app.controller('quescreen-cont',["$scope","$location", "$http", function($scope, $location, $http){
  $scope.sendok = function(){
    //TODO maybe post that sends the user details
    $scope.answer = 1;
    $http.get("/services/answers/"+$scope.params.gameId+"/"+$scope.params.queId+"/"+$scope.answer).then(function(res){
      $scope.respond = res.data;
      goBack();
    });
  };
  $scope.sendno = function(){
    $scope.answer = 0;
    $http.get("/services/answers/"+$scope.params.gameId+"/"+$scope.params.queId+"/"+$scope.answer).then(function(res){
      $scope.respond = res.data;
      goBack();
    });
  };
  window.onbeforeunload = function(event) {
    $http.get('/services/back/'+$scope.params.gameId+'/'+$scope.params.queId);
  }

}]);

function goBack(){
  setTimeout(function(){
    window.onbeforeunload = undefined;
    window.history.back();
  },1000);
}
