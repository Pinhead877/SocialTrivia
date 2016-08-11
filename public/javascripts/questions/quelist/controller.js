angular.module("mainApp").controller('que-list-ctrl', ['$scope', '$http', '_', '$uibModal', function($scope, $http, _, $uibModal){
   $scope.showPrivate = 'public';
   $scope.addedQuestion = false;
   $scope.addQuesText = "Add New Question";
   $scope.showAddQue = false;

   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

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
         // $scope.getQuestions(($scope.quesType==null)?'public':$scope.quesType);
         $scope.refreshGrid();
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
            $scope.refreshGrid();
            alert("Question Deleted Successfully!");
         }
      });
   }

   $scope.editQuestion = function(question){
      var queEditPopup = $uibModal.open({
         animation: true,
         templateUrl: '/templates/questions/questionedit',
         controller: 'que-edit-ctrl',
         size: "lg",
         resolve: {
            que: function(){
               return question;
            }
         }
      });
      queEditPopup.result.then(function(result){
         if(result){
            $scope.refreshGrid();
            $scope.addMsg("Question updated successfully!", 'success');
         }
      });
   }
   $scope.refreshGrid = function(){
      $scope.getQuestions(($scope.quesType==null)?'public':$scope.quesType);
   }
}]);
