angular.module('mainApp').controller('login-cont',['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location){
   $scope.upper = true;
   $scope.loggedin = false;
   $scope.userDetails = {};
   $scope.user = {};
   $scope.enc = CryptoJS.SHA3;
   $scope.requiredField = false;

   $http.get("/services/session").then(function(result){
      if(result.data.error){
         console.log(result.data.error.message);
      }else if(result.data.nickname){
         $scope.user = result.data;
         $scope.loggedin = true;
         if($scope.upper==false){
            $window.location = "/";
         }
      }else{
         console.log("Unknown server response");
      }
   });
   $scope.$watch('upper', function(){
      if($scope.upper===true){

      }
   });

   $scope.goToRegisterPage = function(){
      $window.location.href = "/register";
   }

   $scope.login = function(){
      if($scope.loginForm.$valid){
         var encPass = $scope.enc($scope.unprotectedPassword, { outputLength: 256 });

         $scope.userDetails.password = encPass.toString();

         $http.post("/users/login", $scope.userDetails).then(function(result){
            if(result.data.error){
               alert(result.data.error.message);
            }else if(result.status===200){
               if($location.search().last){
                  $window.location.href = $location.search().last;
               }else{
                  $window.location.href = '/';
               }
            }
         });
      }else{

      }
   }
   $scope.logout = function(){
      $window.location.href = "/users/logout";
   }

   $scope.goToProfilePage = function () {
      $window.location.href = "/profile";
   }
}]);
