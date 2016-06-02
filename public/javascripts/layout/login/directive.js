angular.module('mainApp').directive('loginDiv', function(){
   return {
      restrict: "E",
      controller: 'login-cont',
      templateUrl: "/templates/layout/login"
   }
});
