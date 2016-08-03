angular.module('mainApp').controller('create-cont', ['$scope', '$http', '_', '$uibModal', function($scope, $http, _, $uibModal){

   $scope.gameDetails = {
      questions: [],
      name: "",
      minutes: 60
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
         $scope.$spply();
      });
};


   $scope.create = function(){
      _.forEach($scope.gameDetails.questions, function(que){
         delete que.$$hashKey;
         delete que.isSelected;
      });
      $http.post("/services/create/game", $scope.gameDetails).then(function(result){
         if(result.data.error!=null){
            $scope.error = result.data.error.message;
            return;
         }else{
             window.location.href = "/gameScreen/gamestartscreen"+result.data.gameid;
         }
      }, function(err){
         $scope.error = err;
      })
   }

}]);
