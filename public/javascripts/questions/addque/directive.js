angular.module('mainApp').directive('addQues', function(){
   return {
      restrict: "E",
      controller: "que-add-ctrl",
      scope: {
         added: "="
      },
      templateUrl: "/templates/questions/addques"
   }
});
