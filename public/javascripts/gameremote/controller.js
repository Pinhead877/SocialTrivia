angular.module('mainApp').controller('remote-cont', ["$scope", "$location", "$http" ,function($scope, $location, $http){

   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

   $scope.sendnum = function(){
      $http.get('/gamecontroller/'+$scope.gameid+'/'+$scope.numin)
      .then(function(res){
         if(res.data.error){
            $scope.addMsg(res.data.error.message);
         }
         else if(res.status===200){
            window.location = "/gamecontroller/quescreen/"+$scope.gameid+"/"+$scope.numin;
         }
      }, function(res){
         console.log(res);
      });
   }
}]);
