angular.module("mainApp").controller("profile-page-ctrl", ["$scope", "$http", "$window", function($scope, $http, $window){

   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

   $scope.getPlayerDetails = function(){
      $http.get('/profile/getPlayerDetails').then(function(result){
         if(result.data.error){
            $scope.addMsg(result.data.error.message);
         }else{
            $scope.player = result.data;
         }
      });
   }

   $scope.userGames = function(){
      $window.location = "/profile/games";
   }

   $scope.userQuestions = function(){
      $window.location = "/profile/questions";
   }

   $scope.getColorClass = function(gender){
      if(gender!=null) return (gender.toLowerCase()==='female') ? 'pink' : 'blue';
   }

   $scope.updateUser = function(){
      $window.location = "/profile/editProfile";
   }
}]);
