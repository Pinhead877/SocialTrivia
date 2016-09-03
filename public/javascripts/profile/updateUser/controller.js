angular.module("mainApp").controller("update-user-ctrl",["$scope", "$http", function($scope, $http){
   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };

   $scope.enc = CryptoJS.SHA3;
   $scope.currentYear = moment().year();
   $scope.birthday ={};

   $scope.getUserDetails = function(){
      $http.get('/users/getUser').then(function(result){
         if(result.data.error){
            $scope.addMsg(result.data.error.message);
         }else{
            $scope.userDetails = result.data;
            var birthdayDate = new Date($scope.userDetails.birthday);
            $scope.birthday.day = birthdayDate.getDate()+"";
            $scope.birthday.month = (birthdayDate.getMonth()+1)+"";
            $scope.birthday.year = birthdayDate.getFullYear()+"";
         }
      });
   };

   $scope.updateUser = function(){

   }

   $scope.cancelEdit = function(){

   }

}]);
