(function (angular) {
    'use strict';

    angular
        .module('jsql')
        .directive('notlogged', notlogged);

    /**
     * @ngInject
     */
    function notlogged(AuthService) {
        return {
            link: function ($element) {
                if (!AuthService.isLogged()) {
                    $element.remove();
                }
            }
        };
    }
})(angular);
