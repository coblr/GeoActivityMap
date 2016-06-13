'use strict';

const geoFenceActivityService = require('../_common/services/geoFenceActivity.service');
const template = require('./activityTicker.html');

require('./activityTicker.scss');

module.exports = activityTicker;

// @ngInject
function activityTicker() {
    const directive = {
        bindToController: true,
        controller: activityTickerController,
        controllerAs: 'activityTicker',
        restrict: 'E',
        scope: {},
        template: template
    };
    return directive;
}

// @ngInject
function activityTickerController(geoFenceActivityService, $rootScope) {
    const vm = this;
    vm.activations = geoFenceActivityService.activations;
}
