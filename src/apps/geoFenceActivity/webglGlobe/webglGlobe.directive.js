'use strict';

const geoFenceActivityService = require('../_common/services/geoFenceActivity.service');
const webglGlobeService = require('./webglGlobe.service');

const DATGlobe = require('./DATGlobe.native.js');

module.exports = webglGlobe;

function webglGlobe() {
    const directive = {
        bindToController: true,
        controller: webglGlobeController,
        controllerAs: 'webglGlobe',
        restrict: 'E',
        scope: {},
        link: link
    };
    return directive;

    function link(scope, el, attrs, vm){
        vm.activate(el[0]);
    }
}

// @ngInject
function webglGlobeController(webglGlobeService, geoFenceActivityService){
    const vm = this;
    vm.activate = activate;

    ////////////

    function activate(globeEl){
        const globe = new DATGlobe(globeEl, {});

        geoFenceActivityService.loadActivationStats()
            .then(response => {
                globe.addData(
                    webglGlobeService.parseCoordData(response.data)
                );
                globe.createPoints();
                globe.animate();
            });
    }
}