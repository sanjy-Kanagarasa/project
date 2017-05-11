app.controller('signin', function($scope, $http, $location, $interval){
    $scope.info = {
        'text' : 'INFO BOX',
        'class' : 'info_hidden'
    }
    $scope.login = {
        'email' : '',
        'password' : ''
    }
    
    $scope.signin = function(){
        if($scope.login.email && $scope.login.password){
            $http.post(ip + '/api/loginUser', $scope.login).then(function(res){
                $scope.showInfo(res.data.text, res.data.class);
            }, function(err){
                $scope.showInfo('SOME ERROR', 'info_show info_red');
            });
        }
        else{
            $scope.showInfo('PLEASE FILL IN EVERYTHING', 'info_show info_red');
        }
    }
    $scope.goToSingUp = function(){
        $location.path('/signup');
    }
    
    $scope.showInfo = function(tx, cl){
        $scope.info.text = tx;
        $scope.info.class = cl;
        $interval(function(){
            $scope.info.class = 'info_hidden info_blue';
        }, 2000, 1);
    }
});