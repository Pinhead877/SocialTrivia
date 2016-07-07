angular.module('mainApp').directive("quesList", function(){
  return {
    restrict: "E",
    controller: "que-list-ctrl",
    scope: {
      ques: "="
   },
    templateUrl: "/templates/questions/queslist"
  }
});
