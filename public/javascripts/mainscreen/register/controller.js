angular.module('mainApp').controller('register',['$scope','$http', function($scope, $http){
   $scope.userDetails = {
      birthday: {}
   };

   $scope.currentYear = moment().year();

   $scope.regiterUser = function(){
      $http.post('/users/create',$scope.userDetails).then(function(result){
         if(result.status===200){
            console.log($scope.userDetails);
         }else{
            console.log("Error");
         }
      });
   }
}]);
