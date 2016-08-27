angular.module('mainApp').controller('register',['$scope','$http', function($scope, $http){

   $scope.messages = [];

   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };

   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };


   $scope.userDetails = {
      birthday: {}
   };
   $scope.enc = CryptoJS.SHA3;
   $scope.currentYear = moment().year();

   $scope.registerUser = function(){
      if($scope.registerForm.$valid){
         if($scope.passwordform!=$scope.passwordConfirm){
            $scope.addMsg("Passwords Do not match");
            return;
         }
         var encPass = $scope.enc($scope.passwordform, { outputLength: 256 });
         $scope.userDetails.password = encPass.toString();

         var bday = moment($scope.birthday.year+"-"+$scope.birthday.month+"-"+$scope.birthday.day, "YYYY-MM-DD");
         $scope.userDetails.birthday = bday.toString();
         $scope.userDetails.createdOn = new Date(moment().toString());
         $http.post('/users/create',$scope.userDetails).then(function(result){
            console.log(result);
            if(result.data.error){
               // alert(result.data.error.message);
               // window.location.reload();
               $scope.addMsg(result.data.error.message);
            }else if(result.status===200){
               window.location.href = "/login";
            }
         });
      }
   }

   $scope.clearNicknameAndPassword = function(){
      $scope.userDetails.nickname = "";
      $scope.userDetails.password = "";
   }

   $scope.clearFields = function(){
      $scope.clearNicknameAndPassword();
      $scope.userDetails.gender = "";
      $scope.userDetails.birthday = {};
   }
}]);
