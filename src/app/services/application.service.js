(function (angular) {
    "use strict";

    angular.module("jsql").service("ApplicationService", ApplicationService);

    /**
     * @ngInject
     */
    function ApplicationService(EndpointsFactory) {
        var provider = {};

        /**
         * Funkcja dodaje developera
         */

        provider.createApplication = function (data) {
            return EndpointsFactory.createApplication(data).$promise;
        };

        provider.getApplication = function (id) {
            return EndpointsFactory.application(id).$promise;
        };

        provider.deleteApplication = function (id) {
            return EndpointsFactory.deleteApplication(id).$promise;
        };

        provider.getQueries = function (dateFrom, dateTo, data) {
            return EndpointsFactory.getQueries(dateFrom, dateTo, data).$promise;
        };

        provider.getAllOptions = function (apiKey) {
            return EndpointsFactory.getAllOptions(apiKey).$promise;
        };

        provider.getOptions = function (id) {
            return EndpointsFactory.getOptions(id).$promise;
        };

        provider.getOptionsValues = function () {
            return EndpointsFactory.getOptionsValues().$promise;
        };

        provider.updateOptions = function (id, data) {
            return EndpointsFactory.updateOptions(id, data).$promise;
        };

        provider.toggleProduction = function (id, data) {
            return EndpointsFactory.toggleProduction(id, data).$promise;
        };

        provider.updateQuery = function (id, data) {
            return EndpointsFactory.updateQuery(id, data).$promise;
        };

        return provider;
    }
})(angular);
