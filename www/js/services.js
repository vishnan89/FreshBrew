var app = angular.module('freshbrew.services', []);

app.service("YelpService", function ($q, $http, $cordovaGeolocation, $ionicPopup) {
    var self = {
        'page': 1,
        'isLoading': false,
        'hasMore': true,
        'results': [],
        'lat': 40.7143528,
        'lon': -74.0059731,
        'refresh': function () {
            self.page = 1;
            self.isLoading = false;
            self.hasMore = true;
            self.results = [];
            return self.load();
        },
        'next': function () {
            self.page += 1;
            return self.load();
        },
        'load': function () {
            self.isLoading = true;
            var deferred = $q.defer();

            ionic.Platform.ready(function () {
                $cordovaGeolocation.getCurrentPosition({
                        timeout: 10000,
                        enableHighAccuracy: false
                    })
                    .then(function (position) {
                        
                        //Uncomment the next two lines if using geolocation
                        //self.lat = position.coords.latitude;
                        //self.lon = position.coords.longitude;
                        
                        //Comment the next two lines if using geolocation
                        self.lat= 40.7143528;
                        self.lon= -74.0059731;

                        var params = {
                            page: self.page,
                            lat: self.lat,
                            lon: self.lon
                        };

                        $http.get('https://codecraftpro.com/api/samples/v1/coffee/', {
                                params: params
                            })
                            .success(function (data) {
                                self.isLoading = false;
                                console.log(data);

                                if (data.businesses.length == 0) {
                                    self.hasMore = false;
                                } else {
                                    angular.forEach(data.businesses, function (business) {
                                        self.results.push(business);
                                    });
                                }

                                deferred.resolve();
                            })
                            .error(function (data, status, headers, config) {
                                self.isLoading = false;
                                deferred.reject(data);
                            });
                    }, function(err) {
                    console.error("Error getting postion");
                    console.error(err);
                    $ionicPopup.alert({
                        'title': 'Please switch on gerlocation',
                        'template': "It seems like you've switched off geolocation"
                    })
                })
            });

            return deferred.promise;
        }
    };

    self.load();

    return self;
});