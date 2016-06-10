angular.module('mainApp').controller('login-cont',['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location){
   $scope.upper = true;
   $scope.loggedin = false;
   $scope.userDetails = {};
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
   $scope.$watch('upper', function(){
      if($scope.upper===true){

      }
   });

   $scope.login = function(){
      $http.post("/users/login", $scope.userDetails).then(function(result){
         if(result.status===200){
            console.log($location.search().last);
            if($location.search().last){
               $window.location.href = $location.search().last;
            }else{
               $window.location.href = '/';
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
