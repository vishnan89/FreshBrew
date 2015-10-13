var app = angular.module('freshbrew.controllers', []);

app.controller("YelpController", function ($scope, YelpService) {
	$scope.yelp = YelpService;
    
    $scope.doRefresh = function () {
        
        if(!$scope.yelp.isLoading){
            $scope.yelp.refresh().then(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
    }
    
    $scope.loadMore = function () {
     console.log("loadMore");
         if(!$scope.yelp.isLoading && $scope.yelp.hasMore){
            $scope.yelp.next().then(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
    };
});
