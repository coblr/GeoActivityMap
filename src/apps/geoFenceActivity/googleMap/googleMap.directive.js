'use strict';

const geoFenceActivityService = require('../_common/services/geoFenceActivity.service');
const googleMapService = require('./googleMap.service');

require('./googleMap.scss');

module.exports = googleMap;

// @ngInject
function googleMap() {
    const directive = {
        bindToController: true,
        controller: googleMapController,
        controllerAs: 'googleMap',
        restrict: 'E',
        scope: {
            streamType: '@',
            streamLimit: '@',
            markerType: '@'
        },
        link: link
    };
    return directive;

    function link(scope, el, attrs, vm){
        vm.activate(el[0]);
    }
}

// @ngInject
function googleMapController(geoFenceActivityService, googleMapService, $scope) {
    const vm = this;
    vm.activate = activate;

    vm.activations = geoFenceActivityService.activations;
    vm.filters = geoFenceActivityService.filters;
    vm.isFiltered = geoFenceActivityService.isFiltered;

    $scope.$on('filterChanged', (evt) => {
        googleMapService.applyActivityFilter(vm.markerType);
    });

    $scope.$on('geoFenceActivation', (evt, activation) => {
        googleMapService.getActivationMarker(vm.markerType, activation);
    });

    $scope.$on('killingActivation', (evt, idx) => {
        googleMapService.removeActivationMarker(idx);
    });

    ////////////

    function activate(mapEl){
        googleMapService.initMap(mapEl);

        if(vm.markerType === 'heat'){
            googleMapService.initHeatmap();
        }

        switch(vm.streamType){
            case 'socket':
                geoFenceActivityService.streamActivations(vm.streamLimit);
                break;

            case 'random':
                geoFenceActivityService.mockActivations(vm.streamLimit);
                break;
        };
    }
}
