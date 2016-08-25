var back;
angular.module('mainApp').controller('quescreen-cont',["$scope","$location", "$http", "$window", "$interval", function($scope, $location, $http, $window, $interval){

   $scope.messages = [];
   $scope.answers = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

   $scope.sendAnswer = function(){
      var joinedAnswer = "";
      for(var i = 0; i<$scope.answers.length;i++){
         joinedAnswer+=$scope.answers[i].join("")+" ";
      }
      joinedAnswer = joinedAnswer.substring(0, joinedAnswer.length-1);
      var answer = {
         gameid: $scope.params.gameId,
         queid: $scope.params.queId,
         answers: joinedAnswer
      }
      $http.post("/gamescreen/answers", answer).then(function(res){
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
      for(var i=0; i<params.count.length;i++){
         $scope.answers.push([]);
         for(var j=0;j<params.count[i];j++){
            var letterObj = {value: null};
            letterObj.toString = function(){return this.value;}
            $scope.answers[i].push(letterObj);
         }
      }
      $scope.selectQuestion();
      // $timeout($scope.sendAnswer,1000*60*2);
      var timer = $interval(reduceTimeLeft, 1000);
      function reduceTimeLeft(){
         $scope.params.timeleft--;
         if($scope.params.timeleft==0){
            $interval.cancel(timer);
            $scope.sendAnswer();
            timer = undefined;
         }
      }
   }

   $scope.chooseLetter = function(letter){
      for(var i = 0; i<$scope.answers.length;i++){
         for(var j = 0; j<$scope.answers[i].length;j++){
            if($scope.answers[i][j].value==null){
               $scope.answers[i][j].value = letter;
               return;
            }
         }
      }
   }
   function goBack(){
      setTimeout(function(){
         window.onbeforeunload = undefined;
         $window.location = "/gamecontroller/quepick/"+$scope.params.gameId;
      },1000);
   }

}]);
