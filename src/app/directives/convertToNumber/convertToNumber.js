(function (angular) {
    'use strict';

    angular
        .module('jsql')
        .directive('convertToNumber', convertToNumber);

    /**
     * @ngInject
     */
    function convertToNumber() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (val) {
                    return val != null ? parseInt(val, 10) : null;
                });
                ngModel.$formatters.push(function (val) {
                    return val != null ? '' + val : null;
                });
            }
        };
    }
})(angular);
