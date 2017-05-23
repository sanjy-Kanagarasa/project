app.controller('detail', function ($scope, $http, $location, $routeParams, UserFact) {
    var ctx = document.getElementById('myChart').getContext('2d');
    $scope.userId = $routeParams.param0;
    $scope.user = UserFact.getUser();
    $scope.student = {};
    var userId = $routeParams.param0;
    $scope.students = [];
    var a = $routeParams.param1;
    var b = $routeParams.param2;

    var myApp = angular.module('myApp', []);
    var movement = [];
    var temp = [];
    var time_axis = [];
    var avgMove = [];
    var avgTemp = [];

    $scope.makeData = function () {
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: time_axis,
                    datasets: [
                    {
                        label: 'Movement',
                        data: movement,
                        backgroundColor: "rgba(153,255,51,0.4)"
                    },
                    {
                        label: 'Temp',
                        data: temp,
                        backgroundColor: "rgba(51,135,255,0.4)"
                    },
                    {
                        label: 'Class Avg Move',
                        data: avgMove,
                        backgroundColor: "rgba(53, 239, 247, 0.4)",
                        fill: false
                    },
                    {
                        label: 'Class Avg Temp',
                        data: avgTemp,
                        backgroundColor: "rgba(187, 101, 250, 0.4)"
                    }]
                }
        });
    }

    $http.get(ip + '/api/data?id=' + userId).success(function (res) {
        if(res.student) $scope.student = res.student;
        for (var i = 0; i < res.body.feeds.length; i++) {
            var _3assen = Math.sqrt(Math.pow(res.body.feeds[i].field1, 2) + Math.pow(res.body.feeds[i].field2, 2) + Math.pow(res.body.feeds[i].field3, 2));
            movement.push(_3assen/3);
            temp.push(res.body.feeds[i].field4)
            time_axis.push(res.body.feeds[i].created_at);
            avgMove.push(b);
            avgTemp.push(a);
        }
        $scope.makeData();
    });
});