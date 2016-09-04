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
   $scope.birthday = {};

   $scope.getUserDetails = function(){
      $http.get('/profile/getUser').then(function(result){
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
      if($scope.updateForm.$valid){
         if($scope.passwordform!=null && $scope.passwordform!=$scope.passwordConfirm){
            $scope.addMsg("Passwords do not match");
            return;
         }
         var encPass = $scope.enc($scope.passwordform, { outputLength: 256 });
         $scope.userDetails.password = encPass.toString();
         var bday = moment($scope.birthday.year+"-"+$scope.birthday.month+"-"+$scope.birthday.day, "YYYY-MM-DD");
         $scope.userDetails.birthday = bday.toString();
         $http.post('/profile/putUser',$scope.userDetails).then(function(result){
            if(result.data.error){
               $scope.addMsg(result.data.error.message);
            }else if(result.status===200){
               $scope.addMsg("User Updated successfully!", "success");
               window.location.href = "/profile";
            }
         });
      }
   }

   $scope.cancelEdit = function(){

   }

}]);
