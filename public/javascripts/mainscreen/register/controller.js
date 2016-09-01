angular.module('mainApp').controller('register',['$scope','$http', function($scope, $http){
   /** Error messages container **/
   $scope.messages = [];
   /**
      adds a new error message to the screen
      if the method executed without the type - the type will be 'danger' by default
      type can also be set as 'success' for green message
   **/
   $scope.addMsg = function(msg, type) {
      $scope.messages.push({show: true, type:(type==null)?'danger':type, msg: msg});
   };
   /**
      close the message
      triggered by an delay event or can be triggered by the user by clicking on the close button
   **/
   $scope.closeMsg = function(index) {
      $scope.messages[index].show = false;
   };


   $scope.enc = CryptoJS.SHA3;
   $scope.currentYear = moment().year();
   $scope.userDetails = {
      birthday: {}
   };

   /**
   * Sends the data from the form to the server.
   * check if the passwords match.
   * converts the password to hash string for the secure transport.
   * creates a string out of the birthday date.
   * when the result is successful show a message and redirects the page to the login screen
   */
   $scope.registerUser = function(){
      if($scope.registerForm.$valid){
         if($scope.passwordform!=$scope.passwordConfirm){
            $scope.addMsg("Passwords do not match");
            return;
         }
         var encPass = $scope.enc($scope.passwordform, { outputLength: 256 });
         $scope.userDetails.password = encPass.toString();
         var bday = moment($scope.birthday.year+"-"+$scope.birthday.month+"-"+$scope.birthday.day, "YYYY-MM-DD");
         $scope.userDetails.birthday = bday.toString();
         $scope.userDetails.createdOn = new Date(moment().toString());
         $http.post('/users/create',$scope.userDetails).then(function(result){
            if(result.data.error){
               $scope.addMsg(result.data.error.message);
            }else if(result.status===200){
               $scope.addMsg("User created successfully!", "success");
               window.location.href = "/login";
            }
         });
      }
   }

   /**
      clear the nickname and the password in the form
   **/
   $scope.clearNicknameAndPassword = function(){
      $scope.userDetails.nickname = "";
      $scope.userDetails.password = "";
   }
   /**
      clears the fields in the form
   **/
   $scope.clearFields = function(){
      $scope.clearNicknameAndPassword();
      $scope.userDetails.gender = "";
      $scope.userDetails.birthday = {};
   }
}]);
