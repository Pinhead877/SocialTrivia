angular.module('mainApp').controller('register',['$scope','$http', function($scope, $http){
   $scope.userDetails = {
      birthday: {}
   };
   $scope.enc = CryptoJS.SHA3;
   $scope.currentYear = moment().year();

   $scope.registerUser = function(){
      if($scope.registerForm.$valid){
         var encPass = $scope.enc($scope.userDetails.password, { outputLength: 256 });
         $scope.userDetails.password = encPass.toString();

         var bday = moment($scope.userDetails.birthday.year+"-"+$scope.userDetails.birthday.month+"-"+$scope.userDetails.birthday.day, "YYYY-MM-DD");
         $scope.userDetails.birthday = bday.toString();
         $scope.userDetails.createdOn = new Date(moment().toString());
         $http.post('/users/create',$scope.userDetails).then(function(result){
            console.log(result);
            if(result.data.error){
               alert(result.data.error.message);
               window.location.reload();
            }else if(result.status===200){
               window.location.href = "/";
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
