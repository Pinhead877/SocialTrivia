angular.module('mainApp').directive("quesList", function(){
   return {
      restrict: "E",
      controller: "que-list-ctrl",
      scope: {
         ques: '=?',
         isAddQueVisible: "@?",
         isClearAllVisible: "@?",
         isShowPrivateQuesVisible: "@?",
         isLocalMode: "@?",
         filterQuestions: "=?",
         quesType: "@?"
      },
      templateUrl: "/templates/questions/queslist"
   }
});
