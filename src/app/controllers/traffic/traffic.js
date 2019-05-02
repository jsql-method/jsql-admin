(function (angular) {
    "use strict";

    angular.module("jsql").controller("TrafficController", TrafficController);

    /**
     * @ngInject
     */
    function TrafficController(AuthService, EndpointsFactory, DictService, dateFormat, UtilsService, ChartService) {
        var vm = this;

        vm.chartType = 'BASIC';
        vm.role = AuthService.getRole();
        vm.loadingTable = true;
        vm.loading = true;
        vm.applications = [];
        vm.selectedApplications = [];

        vm.format = dateFormat.format;

        vm.datePickerOpen = {
            dateFrom: false,
            dateTo: false
        };

        var tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);

        vm.filter = {
            applications: [],
            dateFrom: new Date(),
            dateTo: tomorrowDate
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

        init();

        //--------
        function init() {

            getApplications().then(function () {
                vm.loading = false;
                getStats();
            });

        }

        function showInput(type, request){
            request[type+'Input'] = true;
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
                applications: _.flatMap(vm.selectedApplications, floatId)
            };

            EndpointsFactory.requests(vm.page, request).$promise.then(function (result) {

                vm.data = result.data;
                vm.data.pagination.pages = UtilsService.fillArray(vm.data.pagination.totalPages - 1);

                vm.fixedHeight = 'height: 0';
                vm.loadingTable = false;

            });

            EndpointsFactory.requestsChart(request).$promise.then(function (result) {
                vm.rawChartData = result.data;

                if(vm.rawChartData.length > 0){
                    vm.createChart(vm.chartType);
                }

            });

        }

        function createChart(chartType) {
            vm.chartType = chartType;

            var chartData = null;
            var options = {
                datasetLabel: 'Requests number per day'
            };

            switch (chartType) {
                case 'BASIC' :
                    chartData = ChartService.prepareBasicChartData(vm.rawChartData, 'requestDate', 'requestsCount');
                    options.type = 'BASIC';
                    break;
                case 'APPLICATIONS' :
                    chartData = ChartService.prepareMultiChartData(vm.rawChartData, 'applicationName', 'requestDate', 'requestsCount');
                    options.type = 'MULTI';
                    break;
            }

            ChartService.createChart(chartData, options);

        }

        function getApplications() {

            return DictService.applications().then(function (result) {
                vm.applications = UtilsService.applicationsToOptions(result);
            });

        }

        function open(picker) {
            vm.datePickerOpen[picker] = !vm.datePickerOpen[picker];
        }

    }
})(angular);
