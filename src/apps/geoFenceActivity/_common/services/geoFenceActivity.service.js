'use strict';

const businesses = require('../constants/businesses.constant');
const locations = require('../constants/locations.constant');


// need to use require.context for dynamic requires
const req = require.context('../assets', false, /\.gif$/);
const logoPaths = {};
for(let a=0; a<businesses.length; a++){
    const key = businesses[a].logo.split('.')[0];
    logoPaths[key] = req('./' + businesses[a].logo);
}

module.exports = geoFenceActivityService;

// @ngInject
function geoFenceActivityService($timeout, businesses, locations, $rootScope, $http) {
    const activations = [];
    const filters = {
        keywords: '',
        location: '',
        business: ''
    };
    const genders = ['Male','Female'];
    const service = {
        activations,
        filters,
        streamActivations,
        mockActivations,
        resetFilters,
        getActivationKey,
        loadActivationStats
    };
    return service;

    ////////////

    function streamActivations(limit){
        const ws = new WebSocket('ws://localhost:3000/ws');
        ws.onopen = evt => console.warn('WebSocket Opened');
        ws.onclose = evt => console.warn('WebSocket Closed');
        ws.onerror = evt => console.error(evt.data);
        ws.onmessage = evt => {
            const activation = JSON.parse(evt.data);
            activation.business = _parseActivationBusiness(activation);
            activations.push(activation);
            $rootScope.$broadcast('geoFenceActivation', activation);
            _startCountdown(activations.length-1);
            $rootScope.$apply();
        };
    }

    function mockActivations(limit){
        const locIndex = Math.floor(Math.random()*locations.length);
        const lat = locations[locIndex].lat;
        const lon = locations[locIndex].lon;
        const city = locations[locIndex].city;
        const state = locations[locIndex].state;
        const gender = genders[Math.round(Math.random())];
        const age = Math.round(Math.random()*45+18);
        const business = businesses[Math.floor(Math.random()*businesses.length)];

        const activation = {
            lat, lon, city, state,
            business: business.name,
            demographics: {
                age,
                gender
            },
            time: Date.now()
        };
        activation.business = _parseActivationBusiness(activation);
        activations.push(activation);
        $rootScope.$broadcast('geoFenceActivation', activation);
        
        _startCountdown(activations.length-1);

        // add some randomness to when popups appear
        $timeout(() => mockActivations(limit), Math.random()*3000);
    }

    function resetFilters(){
        for(let a in filters){
            filters[a] = '';
        }
    }

    function getActivationKey(activation){
        return [
            activation.lat,
            activation.lon,
            activation.business.logo,
            activation.demographics.gender,
            activation.demographics.age,
            activation.time
        ].join('_');
    }

    function loadActivationStats(){
        return $http.get('../GeoFenceMap/api/qsrGeoData_part.json')
            .then(response => {
                return response;
            });
    }

    ////////////

    function _parseActivationBusiness(activation){
        let logo;
        for(let a=0; a<businesses.length; a++){
            if(activation.business === businesses[a].name){
                logo = logoPaths[businesses[a].logo.split('.')[0]];
            }
        }

        return {
            name: activation.business,
            logo: logo
        };
    }

    function _startCountdown(idx){
        $timeout(function(){
            _killActivation(idx);
            $rootScope.$broadcast('killingActivation', idx);
        }, 5000);
    }

    function _killActivation(idx){
        const activation = activations[idx];
        activations.slice(idx, 1);
    }
}
