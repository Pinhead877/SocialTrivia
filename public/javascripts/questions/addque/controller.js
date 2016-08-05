angular.module("mainApp").controller('que-add-ctrl', ['$scope', '$http','$q', function($scope, $http, $q){
   // $scope.queDetails = {
   //    isPrivate: false
   // };

   $scope.clearQue = function(){
      $scope.queDetails.question = "";
      $scope.queDetails.answer = "";
      $scope.queDetails.category = {};
      $scope.queForm.$setPristine();
   }

   $scope.back = function(){
      window.location.href = "/questions/list";
   }

   $scope.addQuetion = function(){
      if($scope.queForm.$valid){
         $scope.queDetails.category = (typeof($scope.queDetails.category)=="string")?JSON.parse($scope.queDetails.category):$scope.queDetails.category;
         $http.post(($scope.question==null)?'/questions/create':'/questions/update', $scope.queDetails).then(function(result){
            if(result.data.error) alert(result.data.error.message);
            else{
               if($scope.question==null){
                  alert("Added!");
                  $scope.added = !$scope.added;
                  $scope.clearQue();
               }else{
                  $scope.onUpdate();
               }
            }
         });
      }
   };

   $scope.getCategories = function(){
      var defered = $q.defer();
      $http.get('/questions/getCategories').then(function(result){
         if(result.data.error){
            alert(result.data.error.message);
         }else{
            defered.resolve(result.data);
         }
      });
      return defered.promise;
   }

   $scope.init = function(){
      $scope.submitText = ($scope.question==null)?"Add Question":"Update Question";
      $scope.getCategories().then(function(categories){
         $scope.categoriesList = categories;
         $scope.queDetails = ($scope.question==null)?{isPrivate: false}:JSON.parse($scope.question);

      });
   }

   $scope.init();

}]);
