angular.module('mainApp').controller('remote-cont', ["$scope", "$location", "$http" ,function($scope, $location, $http){

   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };
   var sendClicked = false;
   $scope.sendnum = function(){
      if(sendClicked) return;
      sendClicked = true;
      $http.get('/gamecontroller/'+$scope.gameid+'/'+$scope.numin)
      .then(function(res){
         sendClicked = false;
         if(res.data.error){
            $scope.addMsg(res.data.error.message);
            if(res.data.error.code==2010){
               window.location = "/gamescreen/results/"+$scope.gameid;
            }
         }
         else if(res.status===200){
            window.location = "/gamecontroller/quescreen/"+$scope.gameid+"/"+$scope.numin;
         }
      }, function(res){
         console.log(res);
      });
   }
}]);
