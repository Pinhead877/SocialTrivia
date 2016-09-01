angular.module('mainApp').controller('game-result-ctrl',['$scope', '$http', '_', function($scope, $http, _){
   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

   $scope.getGameStats = function(){
      $http.get('/services/getEndedStats/'+$scope.gameid).then(function(result){
         if(result.data.error){
            $scope.addMsg(result.data.error.message);
         }else{
            $scope.game = result.data;
         }
      });
   };
}]);
