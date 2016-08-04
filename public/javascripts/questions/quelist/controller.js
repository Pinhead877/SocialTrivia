angular.module("mainApp").controller('que-list-ctrl', ['$scope', '$http', '_', function($scope, $http, _){
   $scope.showPrivate = 'public';
   $scope.addedQuestion = false;
   $scope.addQuesText = "Add New Question";
   $scope.showAddQue = false;

   $scope.clearAll = function() {
      if($scope.isLocalMode!=null){
         $scope.ques = [];
      }else{
         _.forEach($scope.questionsList, function(que){
            $scope.removeFromGame(que);
         });
      }
   };

   $scope.$watch('ques', function(){
      $scope.questionsList = $scope.ques;
   });

   $scope.$watch('addedQuestion',function(newValue, oldValue){
      if($scope.isLocalMode!=null){
         $scope.questionsList = $scope.ques
      }else{
         $scope.getQuestions(($scope.quesType==null)?'public':$scope.quesType);
      }
   });

   $scope.getQuestions = function(type){
      $http.get('/questions/list/'+type).then(function(result){
         if(result.data.error){
            alert(result.data.error.message);
         }else{
            $scope.questionsList = result.data;
            if($scope.ques != null){
               _.forEach($scope.questionsList, function(que){
                  _.forEach($scope.ques, function(localQue){
                     if(que._id==localQue._id) que.isSelected = true;
                  });
               });
            }
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

   $scope.deleteQuestion = function(question){
      $http.post('/questions/delete', question).then(function(result){
         if(result.data.error){
            alert(result.data.error.message);
         }else{
            $scope.getQuestions(($scope.quesType==null)?'public':$scope.quesType);
            alert("Question Deleted Successfully!");
         }
      });
   }

   $scope.editQuestion = function(question){

   }

}]);
