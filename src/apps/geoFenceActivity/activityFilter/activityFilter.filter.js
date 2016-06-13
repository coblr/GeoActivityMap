'use strict';

const geoFenceActivityService = require('../_common/services/geoFenceActivity.service');

module.exports = activityFilter;

// @ngInject
function activityFilter(geoFenceActivityService){
    const filters = geoFenceActivityService.filters;

    return function filter(input) {
        if(!input) return;
        
        const arr = [];
        for(let a=0; a<input.length; a++){
            const activation = input[a];
            if(isFiltered(activation)){
                activation.filtered = true;
                arr.push(activation);
            }
            else{
                delete activation.filtered;
            }
        }
        return arr;
    }

    function isFiltered(activation){
        const locRegex = new RegExp(filters.location, 'gi');
        const bizRegex = new RegExp(filters.business, 'gi');

        // all activities are filtered by default. When a specific
        // filter is being applied, we will assume all are false
        // and only those that pass the tests will be filtered.
        let filtered = true;
        if(filters.keywords || filters.location || filters.business){
            filtered = false;
        }

        if(filters.keywords){
            filtered = _filterByKeyword(activation)
        }

        if(filters.business){
            if(activation.business.name.match(bizRegex)){
                filtered = true;
            }
        }

        if(filters.location){
            if(activation.city.match(locRegex)){
                filtered = true;
            }
        }

        return filtered;
    }

    function _filterByKeyword(activation){
        let filtered = false;
        
        const dems = activation.demographics;
        const keywordRegex = new RegExp(filters.keywords, 'gi');
        const femaleRegex = /^female$/i;
        const maleRegex = /^male$/i;
        const rangeRegex = /[\d]+-?[\d]+?/;

        const isRangeCheck = filters.keywords.match(rangeRegex);
        const isFemaleCheck = filters.keywords.match(femaleRegex);
        const isMaleCheck = filters.keywords.match(maleRegex);

        if(
            activation.business.name.match(keywordRegex) ||
            activation.city.match(keywordRegex) ||
            activation.state.match(keywordRegex) ||
            (isFemaleCheck && dems.gender.match(femaleRegex)) ||
            (isMaleCheck && dems.gender.match(maleRegex))
        ){
            filtered = true;
        }

        if(isRangeCheck){
            const range = filters.keywords.split('-');

            // don't count single sided (i.e. "21-") as a range.
            if(!range[1]){ range.splice(1,1); }

            if(
                dems.age == range[0] || 
                (dems.age >= range[0] && range[1] && dems.age <= range[1])
            ){
                filtered = true;
            }
        }
        return filtered;
    }
}