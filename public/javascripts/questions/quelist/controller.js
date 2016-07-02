angular.module("mainApp").controller('que-list-ctrl', ['$scope', '$http', function($scope, $http){

   $scope.gridOptions = {
      columnDefs: [
         { field: "question", displayName: "Question" },
         { field: "answer", displayName: "Answer" },
         { field: "isPrivate", displayName: "Public" },
         { field: "nickname", displayName: "Created By" }
      ]
   }

   $scope.getQuestions = function(){
      $http.get('/questions/list/public').then(function(result){
         $scope.gridOptions.data = result.data;
      });
   }


   $scope.getQuestions();

}]);

//=============== Private Methods ===============

function isArrayContains(array, item){
   for(i=0;i<array.length;i++){
      if(item == array[i]) return true;
   }
   return false;
}
