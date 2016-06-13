'use strict';

const GoogleMaps = require('google-maps');
GoogleMaps.KEY = 'AIzaSyA9XioCIqgffX9kvA6ngrVwt4JtOMK5XSA';
GoogleMaps.LIBRARIES = ['visualization'];

module.exports = activityMapController;

// @ngInject
function activityMapController($window, $scope){
    const vm = this;
    vm.google = null;

    GoogleMaps.load(function(){
        vm.google = google;
        $scope.$apply();
    });
}