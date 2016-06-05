angular.module('mainApp').controller('login-cont',['$scope', '$http', '$cookies', '$window', '$location', function($scope, $http, $cookies, $window, $location){

   $scope.loggedin = false;
   $scope.userDetails = {
      username: "Admin2",
      password: "123456"
   }
   $scope.user = {};
   $http.get("/services/session").then(function(result){
      if(result.data.username){
         console.log("Session: "+result.data.username);
         $scope.user.username = result.data.username;
         $scope.loggedin = true;
      }else{
         console.log("No Session");
      }
   });

   $scope.login = function(){
      $http.post("/users/login", $scope.userDetails).then(function(result){
         if(result.status===200){
            console.log($location.search().last);
            if($location.search().last){
               $window.location.href = $location.search().last;
            }else{
               $window.location.reload();
            }
         }
      });
   }
   $scope.logout = function(){
      $http.get("/users/logout").then(function(result){
         if(result.status===200){
            $window.location.reload();
         }
      });
   }
}]);
