(function (angular) {
    'use strict';

    angular
        .module('jsql')
        .directive('logged', logged);

    /**
     * @ngInject
     */
    function logged(AuthService) {
        return {
            link: function ($scope, $element, $attr) {
                

            }
        };
    }
})(angular);
