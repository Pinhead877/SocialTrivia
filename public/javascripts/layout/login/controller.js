angular.module('mainApp').controller('login-cont',['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window){
   $scope.loggedin = false;
   $scope.userDetails = {
      username: "Admin",
      password: "1234567"
   }
   if(/** Get Session **/){

      $scope.loggedin = true;
   }
   $scope.login = function(){
      $http.post("/users/login", $scope.userDetails).then(function(result){
         console.log(result);
         if(result.data.id){
            var session = {
               id: result.data.id,
               username: $scope.userDetails.username
            }

            $window.location.reload();
         }
      });
   }
   $scope.logout = function(){
      $http.get("/users/logout").then(function(result){
         console.log(result);
         
         $window.location.reload();
      });
   }
}]);
