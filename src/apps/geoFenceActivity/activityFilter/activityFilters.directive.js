'use strict';

const geoFenceActivityService = require('../_common/services/geoFenceActivity.service');
const businesses = require('../_common/constants/businesses.constant');
const locations = require('../_common/constants/locations.constant');
const template = require('./activityFilters.html');

require('./activityFilters.scss');

module.exports = activityFilters;

function activityFilters() {
    const directive = {
        bindToController: true,
        controller: activityFiltersController,
        controllerAs: 'activityFilters',
        restrict: 'E',
        scope: {},
        template: template
    };
    return directive;
}

// @ngInject
function activityFiltersController(geoFenceActivityService, $rootScope, locations, businesses, $scope) {
    const vm = this;
    vm.locations = locations;
    vm.businesses = businesses;

    vm.filters = geoFenceActivityService.filters;
    vm.resetFilters = geoFenceActivityService.resetFilters;

    $scope.$watch(() => vm.filters, (n, o) => {
        if(n !== o){
            $rootScope.$broadcast('filterChanged');
        }
    }, true);
}
