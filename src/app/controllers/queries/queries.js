(function (angular) {
    "use strict";

    angular.module("jsql").controller("QueriesController", QueriesController);

    /**
     * @ngInject
     */
    function QueriesController(AuthService, EndpointsFactory, DictService, dateFormat, UtilsService, ChartService, $stateParams, $location) {
        var vm = this;

        vm.chartType = 'BASIC';
        vm.role = AuthService.getRole();
        vm.loadingTable = true;
        vm.loading = true;
        vm.developers = [];
        vm.selectedDevelopers = [];

        vm.format = dateFormat.format;

        vm.datePickerOpen = {
            dateFrom: false,
            dateTo: false
        };

        vm.filter = {
            applications: [
                parseInt($stateParams.id)
            ],
            developers: [],
            dateFrom: new Date(),
            dateTo: new Date(),
            used: null,
            dynamic: null,
            search: null
        };

        vm.page = 0;
        vm.data = null;
        vm.rawChartData = null;

        vm.fixedHeight = 'height: 0';

        vm.open = open;
        vm.getStats = getStats;
        vm.getStatsForPage = getStatsForPage;
        vm.createChart = createChart;
        vm.showInput = showInput;
        vm.updateQuery = updateQuery;

        init();

        //--------
        function init() {

            getDevelopers().then(function () {
                vm.loading = false;
                getStats();
            });

        }

        function showInput(type, query, $event){
            query[type+'Input'] = true;
        }

        function updateQuery(query, $event){
            $event.stopPropagation();
            query.queryInput = false;

            EndpointsFactory.updateQuery(query.id, {
                query: query.query,
                applicationId: query.applicationId
            }).$promise.then(function(result){

                if (UtilsService.hasGeneralError(result)) {
                    UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                } else {
                    UtilsService.openSuccessModal(translation.queryUpdated);
                }

            });

        }

        function getStatsForPage(page) {

            if (page >= 0) {
                vm.page = page;
                getStats();
            }

        }

        function getStats() {

            var height = UtilsService.elementHeight(document.getElementById('table'));
            vm.fixedHeight = 'height: ' + height + 'px';
            vm.loadingTable = true;

            function floatId(o) {
                return [o.id];
            }

            var request = {
                dateFrom: UtilsService.formatDate(vm.filter.dateFrom, 'dd-MM-yyyy'),
                dateTo: UtilsService.formatDate(vm.filter.dateTo, 'dd-MM-yyyy'),
                applications: vm.filter.applications,
                developers: _.flatMap(vm.selectedDevelopers, floatId),
                used: vm.filter.used,
                dynamic: vm.filter.dynamic,
                search: vm.filter.search
            };

            EndpointsFactory.queries(vm.page, request).$promise.then(function (result) {

                vm.data = result.data;
                vm.data.pagination.pages = UtilsService.fillArray(vm.data.pagination.totalPages - 1);

                console.log('vm.data', vm.data);

                vm.fixedHeight = 'height: 0';
                vm.loadingTable = false;

            });

            EndpointsFactory.queriesChart(request).$promise.then(function (result) {
                vm.rawChartData = result.data;

                if (vm.rawChartData.length > 0) {
                    vm.createChart(vm.chartType);
                }

            });

        }

        function createChart(chartType) {
            vm.chartType = chartType;

            var chartData = null;
            var options = {};

            switch (chartType) {
                case 'BASIC' :
                    chartData = ChartService.prepareBasicChartData(vm.rawChartData, 'hashingDate', 'queriesCount');
                    options = {
                        type: 'BASIC'
                    };
                    break;
                case 'DEVELOPERS' :
                    chartData = ChartService.prepareMultiChartData(vm.rawChartData, 'developerName', 'hashingDate', 'queriesCount');
                    options = {
                        type: 'MULTI'
                    };
                    break;
            }

            ChartService.createChart(chartData, options);

        }

        function getDevelopers() {

            if (vm.role !== 'APP_DEV') {

                return DictService.developers().then(function (developers) {

                    DictService.admins().then(function (admins) {
                        vm.developers = UtilsService.developersToOptions(developers).concat(UtilsService.developersToOptions(admins));
                    });

                });

            }

        }

        function open(picker) {
            vm.datePickerOpen[picker] = !vm.datePickerOpen[picker];
        }

    }
})(angular);
