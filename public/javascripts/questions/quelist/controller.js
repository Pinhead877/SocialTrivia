angular.module("mainApp").controller('que-list-ctrl', ['$scope', '$http', function($scope, $http){

   $scope.getQuestions = function(){
      $http.get('/questions/list/public').then(function(result){
         $scope.questions = result.data;
      });
      // var userIds = [];
      // for(i=0;i<questions.length;i++){
      //    var userId = questions[i].userid;
      //    if(!isArrayContains(userIds, userId)){
      //       userIds.push(userId);
      //    }
      // }
      // var specs = {
      //    ids: userIds
      // }
      // $http.post('/users/list', specs).then(function(result){
      //    $scope.usersDetails = result.data;
      //    console.log($scope.usersDetails);
      // });

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
