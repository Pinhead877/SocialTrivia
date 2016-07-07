angular.module("mainApp").controller('que-list-ctrl', ['$scope', '$http', function($scope, $http){

   $scope.gridOptions = {
      columnDefs: [
         { field: "question", displayName: "Question" },
         { field: "answer", displayName: "Answer" },
         { field: "isPrivate", displayName: "Public" },
         { field: "nickname", displayName: "Created By" }
      ],
      enableGridMenu: true,
      enableRowSelection: true,
      enableFullRowSelection: true,
      enableSelectAll: true,
      onRegisterApi: function(gridApi) {
         $scope.gridApi = gridApi;
         gridApi.selection.on.rowSelectionChanged($scope,function(row){
            $scope.ques = gridApi.selection.getSelectedRows();
         });
      }
   };

   $scope.clearAll = function() {
      $scope.gridApi.selection.clearSelectedRows();
   };

   $scope.getQuestions = function(type){
      $http.get('/questions/list/'+type).then(function(result){
         $scope.gridOptions.data = result.data;
      });
   };

   $scope.goToAddQuestion = function(){
      window.location.href = "/questions/add";
   }

   $scope.selectedItems = 0;
   $scope.getQuestions('public');

}]);
