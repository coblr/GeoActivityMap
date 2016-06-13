'use strict';

const geoFenceActivityService = require('../_common/services/geoFenceActivity.service');

module.exports = googleMapService;

// @ngInject
function googleMapService(geoFenceActivityService, $filter){

    const service = {
        geoMap: null,
        heatmap: null,
        initMap,
        initHeatmap,
        getActivationMarker,
        applyActivityFilter,
        removeActivationMarker
    };

    return service;

    ////////////

    function initMap(mapEl){
        const mapConfig = {
            center: {lat: 39, lng: -96},
            zoom: 5,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
        };
        service.geoMap = new google.maps.Map(mapEl, mapConfig);
    }

    function initHeatmap(){
        service.heatmap = new google.maps.visualization.HeatmapLayer({
            data: [],
            map: service.geoMap,
            gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ]
        });
    }

    function getActivationMarker(markerType, activation){
        let marker;
        switch(markerType){
            case 'dot':     marker = _getDotMarker(activation);  break;
            case 'info':    marker = _getInfoMarker(activation); break;
            case 'heat':    marker = _getHeatMarker(activation); break;
        };
        activation.marker = marker;
        applyActivityFilter(markerType);
    }

    function applyActivityFilter(markerType){
        // make sure the activity filter has been applied before
        // we toggle on and off activations.
        $filter('activityFilter')(geoFenceActivityService.activations);

        for(let a=0; a<geoFenceActivityService.activations.length; a++){
            const activation = geoFenceActivityService.activations[a];
            const key = geoFenceActivityService.getActivationKey(activation);

            // since a marker might have been killed before the activation
            // was removed, there would be nothing to do here.
            if(!activation.marker) continue;

            if(activation.filtered && !activation.visible){
                activation.visible = true;
                switch(markerType){
                    case 'dot':     activation.marker.setMap(service.geoMap);   break;
                    case 'info':    activation.marker.open(service.geoMap);     break;
                }
            }
            
            if(!activation.filtered){
                delete activation.visible;
                switch(markerType){
                    case 'dot':     activation.marker.setMap(null);         break;
                    case 'info':    activation.marker.close();              break;
                }
            }
        }
    }

    function removeActivationMarker(idx){
        const activation = geoFenceActivityService.activations[idx];
        if(activation.marker){
            activation.marker.setMap(null);
            delete activation.marker;
        }
    }

    ////////////

    function _getHeatMarker(activation){
        const heat = new google.maps.LatLng(+activation.lat, +activation.lon);
        service.heatmap.getData().push(heat);
        return heat;
    }

    function _getDotMarker(activation){
        const dot = new google.maps.Marker({
            zIndex: Date.now(),
            position: {
                lat: +activation.lat,
                lng: +activation.lon
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#f00',
                fillOpacity: 0.5,
                radius: 25000,
                strokeWeight: 0,
                scale: 10,
                anchor: new google.maps.Point(0, 0)
            },
        });
        return dot;
    }

    function _getInfoMarker(activation){
        const content = `
            <img src="${activation.business.logo}" />
            <div class="infoWrapper">
                <h5>${activation.business.name}</h5>
                <p>${activation.demographics.gender}, ${activation.demographics.age}</p>
                <p>${activation.city}, ${activation.state}</p>
            </div>
        `;
        const info = new google.maps.InfoWindow({
            content: content,
            zIndex: Date.now(),
            position: {
                lat: +activation.lat,
                lng: +activation.lon
            },
            disableAutoPan: true
        });
        return info;
    }
}