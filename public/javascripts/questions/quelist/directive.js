angular.module('mainApp').directive("quesList", function(){
   return {
      restrict: "E",
      controller: "que-list-ctrl",
      scope: {
         quesOutput: "=?",
         quesInput: "=?"
      },
      templateUrl: "/templates/questions/queslist"
   }
});
