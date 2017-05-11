app.controller('main', function($scope, $http, $location){
    $scope.list = [];
    
    $scope.getStudents = function(){
        
    }
    
    $scope.goToStudentDetail = function(student){
        $location.path('/student/' + student);
    }
});