angular.module("mainApp").controller('que-list-ctrl', ['$scope', '$http', '_', function($scope, $http, _){
   $scope.showPrivate = 'public';
   $scope.addedQuestion = false;
   $scope.addQuesText = "Add New Question";
   $scope.showAddQue = false

   $scope.clearAll = function() {

   };

   $scope.$watch('addedQuestion',function(newValue, oldValue){
      $scope.getQuestions($scope.showPrivate);
   });

   $scope.getQuestions = function(type){
      $http.get('/questions/list/'+type).then(function(result){
         if(result.data.error){
            alert(result.data.error.message);
         }else{
            $scope.questionsList = result.data;
         }
      });
   };

   $scope.addQuestionToGame = function(row){
      row.isSelected = true;
      $scope.ques.push(row);
   };

   $scope.removeFromGame = function(row){
      row.isSelected = false;
      _.remove($scope.ques, function(que){
         return que._id==row._id;
      });
   };

   $scope.toggleAddQues = function(){
      $scope.showAddQue = !$scope.showAddQue;
      if($scope.showAddQue){
         $scope.addQuesText = "Close";
      }else{
         $scope.addQuesText = "Add New Question";
      }
   };

   $scope.getQuestions('public');

}]);
