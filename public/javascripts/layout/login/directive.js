angular.module('mainApp').directive('loginDiv', function(){
   return {
      restrict: "E",
      link: function(scope, element, attrs){
         scope.upper = scope.$eval(attrs.upper);
      },
      controller: 'login-cont',
      templateUrl: "/templates/layout/login"
   }
});
