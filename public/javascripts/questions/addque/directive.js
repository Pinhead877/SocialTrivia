angular.module('mainApp').directive('addQues', function(){
   return {
      restrict: "E",
      controller: "que-add-ctrl",
      scope: {
         added: "=",
         question: "@?",
         onUpdate: "&?"
      },
      templateUrl: "/templates/questions/addques"
   }
});
