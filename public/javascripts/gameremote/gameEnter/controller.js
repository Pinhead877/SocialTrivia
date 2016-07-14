angular.module('mainApp').controller('game-enter-ctrl', ['$scope', '$http', function($scope, $http){
   $scope.numberEntered = false;
   $scope.gamenum = "";

   $scope.sendGameNumber = function(){
      if($scope.gameNumber.$valid){
         $http.post('/gamecontroller/entergame',{gamenum: $scope.gamenum}).then(function(result){
            if(result.data.error){
               alert(result.data.error.message);
               return;
            }
            if(result.status===200){
               $scope.numberEntered = true;
            }
         });
      }
   }

   $scope.sendName = function(){
      $http.get("/services/session").then(function(result){
         if(result.data.error){
            console.log(result.data.error.message);
         }else if(result.data.nickname){
            console.log(result.data);
            $scope.nickname = result.data.nickname;
         }else{
            console.log("Unknown server response");
         }
      });
   }

   window.onbeforeunload = function(event){
      $http.get('/gamescreen/userexitgame/'+$scope.gamenum);
      return "";
   }
}]);
