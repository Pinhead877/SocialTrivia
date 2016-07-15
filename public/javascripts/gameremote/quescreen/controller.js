//TODO Remmeber to minify the file!!!
var back;
//TODO - put the yellow paint in this page when the page is starting
angular.module('mainApp').controller('quescreen-cont',["$scope","$location", "$http", function($scope, $location, $http){
  $scope.sendok = function(){
    //TODO maybe post that sends the user details
    $scope.answer = 1;
    $http.get("/gamescreen/answers/"+$scope.params.gameId+"/"+$scope.params.queId+"/"+$scope.answer).then(function(res){
      $scope.respond = res.data;
      back = true;
      goBack();
    });
  };
  $scope.sendno = function(){
    $scope.answer = 0;
    $http.get("/gamescreen/answers/"+$scope.params.gameId+"/"+$scope.params.queId+"/"+$scope.answer).then(function(res){
      $scope.respond = res.data;
      back = true;
      goBack();
    });
  };
  window.onbeforeunload = function(event) {
    $http.get('/gamescreen/back/'+$scope.params.gameId+'/'+$scope.params.queId);
    if(!back)
      return "Do you really want to leave?";
  }

}]);

function goBack(){
  setTimeout(function(){
    window.onbeforeunload = undefined;
    window.history.back();
  },1000);
}
