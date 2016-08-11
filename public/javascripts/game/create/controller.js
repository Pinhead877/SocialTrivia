angular.module('mainApp').controller('create-cont', ['$scope', '$http', '_', '$uibModal', '$window', function($scope, $http, _, $uibModal, $window){

   $scope.messages = [
   ];

   $scope.addMsg = function(type, msg) {
      $scope.messages.push({show: true,type: type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

   $scope.gameDetails = {
      questions: [],
      name: ""
   };
   $scope.dataRecieved = false;
   $scope.error = "";

   $scope.openQuestionsList = function(){
      var quesPopup = $uibModal.open({
         animation: true,
         templateUrl: '/templates/questions/queslistpopup',
         controller: 'que-list-popup-ctrl',
         size: "lg",
         resolve: {
            ques: function(){
               return $scope.gameDetails.questions;
            }
         }
      });
      quesPopup.result.then(function(questions){
         $scope.gameDetails.questions = questions;
      });
   };


   $scope.create = function(){
      $http.post("/services/create/game", $scope.gameDetails).then(function(result){
         if(result.data.error!=null){
            $scope.addMsg('danger', result.data.error.message);
            return;
         }else{
            //  window.location.href = "/gameScreen/gamestartscreen/"+result.data.gameid;
            $window.location = "/profile/games";
         }
      }, function(err){
         $scope.error = err;
      })
   }

}]);
