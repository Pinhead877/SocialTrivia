app.controller('create-cont', ['$scope', '$http', function($scope, $http){
  $scope.data = {
    gameName: "Test"
  }
  $scope.create = function(){
    console.log("Click");
    $http.post("/services/create/game", $scope.data).then(function(result){
      if(result.data.gameId){
        console.log("GameId: "+ result.data.gameId);
      }else{
        console.log("Error: "+ result.data.error);
      }
    }, function(err){
      console.log("Error");
    })
  }
}]);
