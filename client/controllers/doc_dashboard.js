app.controller('doc_dashboard', function($scope, $location, $http, UserFact){
    $scope.user = UserFact.getUser();
    $scope.list = [
        {_id : 1234, act : 25, temp : 37, act_av : 24, temp_av : 36.5, name : 'Taha'},
        {_id : 1235, act : 25, temp : 37, act_av : 24, temp_av : 36.5, name : 'Sanjy'},
        {_id : 1236, act : 25, temp : 37, act_av : 24, temp_av : 36.5, name : 'Anja'},
        {_id : 1237, act : 25, temp : 37, act_av : 24, temp_av : 36.5, name : 'Dries'}
    ];
    
    $scope.goToStudentDetail = function(id){
        $location.path('/student/' + id);
    }
});