angular.module('mainApp').service("QuestionsStatuses", ["$q","$http","_",function($q,$http,_){
   this.GetStatuses = function(gameid){
      var defered = $q.defer();
      $http.get('/services/getQuestionsStatuses/'+gameid).then(function(result){
         if(result.data.error){
            defered.reject(result);
         }else{
            defered.resolve(result.data);
         }
      });
      return defered.promise;
   };

   this.isQuestionHaveEnded = function(gameid){
      var defered = $q.defer();
      this.GetStatuses(gameid).then(function(result){
         var blockedNums = _.filter(result, function(status){
            return status === "blocked" || status === "correct";
         });
         defered.resolve(blockedNums.length === result.length);
      });
      return defered.promise;
   }
}]);
