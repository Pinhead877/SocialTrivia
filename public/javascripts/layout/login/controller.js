angular.module('mainApp').controller('login-cont',['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window){
   $scope.loggedin = false;
   if($cookies.getObject("user")){
      $scope.user = $cookies.getObject("user");
      $scope.loggedin = true;
   }
   $scope.login = function(){
      $cookies.putObject("user",{name: "Test", _id: 1234});
      $window.location.reload();
   }
   $scope.logout = function(){
      $cookies.remove("user");
      $window.location.reload();
   }
}]);
