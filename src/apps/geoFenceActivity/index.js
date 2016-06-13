const angular = require('angular');
const uiRouter = require('angular-ui-router');
const ngAnimate = require('angular-animate');
const ngMaterial = require('angular-material');
const config = require('./geoFenceActivity.config');

require('angular-material/angular-material.min.css');
require('../../scss/core.scss');
require('./_common/scss/activityMap.scss');


angular
    .module('geoFenceActivity', [
        uiRouter,
        ngAnimate,
        ngMaterial
    ])
    .config(config)
    .constant('businesses', require('./_common/constants/businesses.constant'))
    .constant('locations', require('./_common/constants/locations.constant'))
    .controller('activityMapController', require('./_common/controllers/activityMap.controller'))
    .service('geoFenceActivityService', require('./_common/services/geoFenceActivity.service'))
    
    .directive('activityTicker', require('./activityTicker/activityTicker.directive'))

    .filter('activityFilter', require('./activityFilter/activityFilter.filter'))
    .directive('activityFilters', require('./activityFilter/activityFilters.directive'))

    .directive('googleMap', require('./googleMap/googleMap.directive'))
    .service('googleMapService', require('./googleMap/googleMap.service'))
    
    .directive('webglGlobe', require('./webglGlobe/webglGlobe.directive'))
    .service('webglGlobeService', require('./webglGlobe/webglGlobe.service'));

