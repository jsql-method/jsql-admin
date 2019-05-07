(function (angular) {
    "use strict";

    angular.module("jsql").controller("BuildsController", BuildsController);

    /**
     * @ngInject
     */
    function BuildsController(AuthService, EndpointsFactory, DictService, dateFormat, UtilsService, ChartService, $timeout) {
        var vm = this;

        vm.chartType = 'BASIC';
        vm.role = AuthService.getRole();
        vm.loadingTable = true;
        vm.loading = true;
        vm.developers = [];
        vm.selectedDevelopers = [];
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
            developers: [],
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
        vm.copyToClipboard = UtilsService.copyToClipboardText;

        init();

        function maskDates(){
            $('#dateFrom').mask('00-00-0000');
            $('#dateTo').mask('00-00-0000');
        }

        //--------
        function init() {

            $timeout(maskDates);

            getApplications().then(function () {

                if (vm.role !== 'APP_DEV') {

                    getDevelopers().then(function () {
                        vm.loading = false;
                        getStats();
                    });

                }else{
                    vm.loading = false;
                    getStats();
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
                applications: _.flatMap(vm.selectedApplications, floatId),
                developers: _.flatMap(vm.selectedDevelopers, floatId)
            };

            EndpointsFactory.builds(vm.page, request).$promise.then(function (result) {

                vm.data = result.data;
                vm.data.pagination.pages = UtilsService.fillArray(vm.data.pagination.totalPages - 1);

                vm.fixedHeight = 'height: 0';
                vm.loadingTable = false;

            });

            EndpointsFactory.buildsChart(request).$promise.then(function (result) {
                vm.rawChartData = prepareChartData(result.data);

                if(vm.rawChartData.length > 0){
                    vm.createChart(vm.chartType);
                }

            });

        }

        function prepareChartData(rawChartData){

            for(var i = 0; i < rawChartData.length; i++){
                rawChartData[i].count = 1;
            }

            return rawChartData;

        }

        function createChart(chartType) {
            vm.chartType = chartType;

            var chartData = null;
            var options = {
                datasetLabel: 'Builds number per day'
            };

            switch (chartType) {
                case 'BASIC' :
                    chartData = ChartService.prepareBasicChartData(vm.rawChartData, 'hashingDate', 'count');
                    options.type = 'BASIC';
                    break;
                case 'APPLICATIONS' :
                    chartData = ChartService.prepareMultiChartData(vm.rawChartData, 'applicationName', 'hashingDate', 'count');
                    options.type = 'MULTI';
                    break;
                case 'DEVELOPERS' :
                    chartData = ChartService.prepareMultiChartData(vm.rawChartData, 'developerName', 'hashingDate', 'count');
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
