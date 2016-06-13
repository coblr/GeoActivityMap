module.exports = config;

// @ngInject
function config($mdThemingProvider, $stateProvider, $urlRouterProvider) {

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('red');


    $urlRouterProvider.otherwise('/activityMap');
    $stateProvider
        .state('activityMap', {
            url: '/activityMap',
            template: require('./_common/views/activityMap.html'),
            controller: 'activityMapController as activityMap',
        })
        .state('activityGlobe', {
            url: '/activityGlobe',
            template: require('./_common/views/activityGlobe.html')
        });
};
