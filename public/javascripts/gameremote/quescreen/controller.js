var back;
angular.module('mainApp').controller('quescreen-cont',["$scope","$location", "$http", function($scope, $location, $http){
   $scope.sendAnswer = function(){
      $http.get("/gamescreen/answers/"+$scope.params.gameId+"/"+$scope.params.queId+"/"+$scope.answer).then(function(res){
         $scope.respond = (res.data===true)?"Correct":"Wrong";
         back = true;
         goBack();
      });
   };
   window.onbeforeunload = function(event) {
      $http.get('/gamescreen/back/'+$scope.params.gameId+'/'+$scope.params.queId);
      if(!back)
      return "Do you really want to leave?";
   }

   $scope.selectQuestion = function(){
      $http.get('/gamescreen/select/'+$scope.params.gameId+"/"+$scope.params.queId);
   }

   $scope.init = function(params){
      $scope.params = params;
      $scope.selectQuestion();
   }

}]);

function goBack(){
   setTimeout(function(){
      window.onbeforeunload = undefined;
      window.history.back();
   },1000);
}
