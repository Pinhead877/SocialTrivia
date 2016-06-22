angular.module("mainApp").controller('que-list-ctrl', ['$scope', '$http', function($scope, $http){

   $scope.getQuestions = function(){

      $http.get('/questions/list/public').then(function(result){
         $scope.questions = result.data;
         console.log($scope.questions);
      });

      var userIds;
      var config = {
         params: {
            ids: userIds
         }
      }
      $http.get('/users/list', config).then(function(result){
         $scope.usersDetails = result.data;
         console.log($scope.usersDetails);
      });
   }

   $scope.getQuestions();



}]);
