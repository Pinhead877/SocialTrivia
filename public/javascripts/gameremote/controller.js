app.controller('remote-cont', ["$scope", "$location", "$http" ,function($scope, $location, $http){
  $scope.numin = 0;
  $scope.gameid = 1234;
  $scope.sendnum = function(){
    console.log("Clicked: "+$scope.numin);
    $http.get('/services/'+$scope.gameid+'/'+$scope.numin)
    .then(function(res){
      if(res.status==200){
        window.location = "/gamecontroller/quescreen/"+$scope.gameid+"/"+$scope.numin;
      }
    }, function(res){
      console.log(res);
    });
  }

}]);
