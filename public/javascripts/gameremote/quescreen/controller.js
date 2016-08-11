var back;
angular.module('mainApp').controller('quescreen-cont',["$scope","$location", "$http", function($scope, $location, $http){

   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

   $scope.sendAnswer = function(){
      $http.get("/gamescreen/answers/"+$scope.params.gameId+"/"+$scope.params.queId+"/"+$scope.answer).then(function(res){
         $scope.addMsg((res.data===true)?"Correct answer!":"Wrong answer!", (res.data===true)?"success":"danger");
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
