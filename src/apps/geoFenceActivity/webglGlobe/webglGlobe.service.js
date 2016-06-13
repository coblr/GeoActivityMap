'use strict';

module.exports = webglGlobeService;

// @ngInject
function webglGlobeService(geoFenceActivityService){
    const service = {
        parseCoordData
    };

    return service;

    ////////////

    function parseCoordData(coords){
        const mapDataObj = {};
        for(let a=0; a<coords.length; a++){
            const lat = Math.round(coords[a][0] * 3) / 3;
            const lon = Math.round(coords[a][1] * 3) / 3;
            const key = `${lat}|${lon}`;

            if(mapDataObj[key] === undefined){
                mapDataObj[key] = 0;
            }
            else {
                mapDataObj[key] += 1;
            }
        }

        const mapData = [];
        for(let b in mapDataObj){
            const loc = b.split('|');
            const lat = loc[0];
            const lon = loc[1];
            const mag = mapDataObj[b] / 100000;
            mapData.push(lat);
            mapData.push(lon);
            mapData.push(mag);
        }
        return mapData;
    }
}