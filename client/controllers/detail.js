app.controller('detail', function ($scope, $http, $location, $routeParams, UserFact) {
    var ctx = document.getElementById('myChart').getContext('2d');
    $scope.userId = $routeParams.param0;
    $scope.user = UserFact.getUser();

    var myApp = angular.module('myApp', []);
    var movement = [];
    var temp = [];
    var time_axis = [];

    $scope.makeData = function () {
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: time_axis,
                    datasets: [{
                        label: 'Temperatuur',
                        data: temp,
                        backgroundColor: "rgba(51,135,255,0.4)"
                    }, {
                        label: 'Beweging',
                        data: movement,
                        backgroundColor: "rgba(153,255,51,0.4)"
                    }]
                }
        });
    }

    $http.get(ip + '/api/data').success(function (res) {
        //$http.get('todos.json').success(function(res){


        for (var i = 0; i < res.feeds.length; i++) {
            var _3assen = Math.sqrt(Math.pow(res.feeds[i].field1, 2) + Math.pow(res.feeds[i].field2, 2) + Math.pow(res.feeds[i].field3, 2));
            movement.push(_3assen/3);
            temp.push(res.feeds[i].field4)
            time_axis.push(res.feeds[i].created_at);
        }

        $scope.makeData();
        /*var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: time_axis,
    datasets: [{
      label: 'movement',
      data: x_axis,
      backgroundColor: "rgba(153,255,51,0.4)"
    }]
  }

});*/
    });
    /*$scope.user = null;
    $scope.userId = $routeParams.param0;
    
    $scope.getUser = function () {
        $http.post(  'GET USER LINK' , {}).success(function(user){
            
        }).error(function(error){
            
        });
    }
    $scope.getUser();
    
    var ctx = document.getElementById('myChart').getContext('2d');
    $scope.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag', 'mijndag'],
            datasets: [{
                label: 'movement',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: "rgba(153,255,51,0.4)"
            },
            {
                label: 'temperature',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: "rgba(255,13,0,0.4)"
            }]
        }
    });
    
    $http.get('https://thingspeak.com/channels/257227/feeds.json').success(function(data){
        var abc = [];
        var aby = [];
        var abz = [];
        for(var i = 0; i < data.feeds.length; i ++){
            abc.push(Math.sqrt(data.feeds[i].field1 * data.feeds[i].field2));
        }
        console.log(abc);
        $scope.myChart.data.datasets[0].data = abc;
        
        $scope.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag', 'mijndag'],
                datasets: [{
                    label: 'movement',
                    data: abc,
                    backgroundColor: "rgba(153,255,51,0.4)"
                },
                {
                    label: abc,
                    data: [0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "rgba(255,13,0,0.4)"
                }]
            }
        });
        
    });
    
    
    $scope.getUserData = function(){
        $http.get(ip + '/api/charts/oneUser', {}).success(function(res){
            //$scope.myChart = new Chart(ctx, res.data);
        }).error(function(error){
            alert('network error');
        });
    }
    $scope.getUserData();*/
});