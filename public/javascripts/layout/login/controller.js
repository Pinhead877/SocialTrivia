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
         $scope.user.nickname = result.data.nickname;
         $scope.loggedin = true;
      }else{
         console.log("Unknown server response");
      }
   });
   $scope.$watch('upper', function(){
      if($scope.upper===true){

      }
   });

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
      }
   }
   $scope.logout = function(){
      $http.get("/users/logout").then(function(result){
         if(result.status===200){
            $window.location.reload();
         }
      });
   }
}]);
