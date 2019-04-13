(function(angular) {
    "use strict";

    angular.module("jsql").controller("TrafficController", TrafficController);

    /**
     * @ngInject
     */
    function TrafficController(DictService, dateFormat) {
        var vm = this;
        var chart = null;

        /**
         *  Applications Variables Declarations
         * */
        vm.applications = [];
        vm.copyApplications = [];

        /**
         * DatePicker Variables && Functions Declarations
         * */
        vm.format = dateFormat.html5Types.date;
        vm.open1 = open1;
        vm.open2 = open2;
        vm.popup1 = {opened: false};
        vm.popup2 = {opened: false};

        /**
         * Form Filter Traffic Variables && Functions Declarations
         * */
        vm.dataFilterTraffic = {
            applications: [],
            dateFrom: "",
            dateTo: ""
        };
        vm.applicationValue = "";

        vm.showMultiSelect = showMultiSelect;
        vm.hideMultiSelect = hideMultiSelect;

        vm.setFilterApplications = setFilterApplications;
        vm.chooseAllApplications = chooseAllApplications;
        vm.checkChoosenApplication = checkChoosenApplication;
        vm.addOrRemoveApplication = addOrRemoveApplication;

        init();

        //--------
        function init() {
            getApplication();

            window.addEventListener("click", function() {
                var selector = document.getElementsByClassName("multiselect-contain")[0];
                selector.style.display = "none";
            });
        }

        function getApplication() {
            DictService.applications().then(function(result) {
                vm.applications = result;
                vm.copyApplications = result.slice();
                createChart();
            });
        }

        var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var randomScalingFactor = function() {
            return Math.round(Math.random() * 100);
        };

        /**
         * Section Chart
         * */

        var config = {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'red',
                    borderColor: 'red',
                    data: [
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor()
                    ],
                    fill: false,
                }, {
                    label: 'My Second dataset',
                    fill: false,
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    data: [
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor(),
                        randomScalingFactor()
                    ],
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        },
                        ticks: {
                            min: 0,
                            max: 100,

                            // forces step size to be 5 units
                            stepSize: 5
                        }
                    }]
                }
            }
        };

        function createChart() {
            var ctx = document.getElementById('canvas').getContext('2d');
            chart = new Chart(ctx, config);
        };



        /**
         * Section DatePicker
         * */
        function open1() {
            vm.popup1.opened = true;
        }

        function open2() {
            vm.popup2.opened = true;
        }



        /**
         * Multiselect
         * a) Filter applications
         * b) Filter members
         */

        function showMultiSelect(index) {
            var selector = document.getElementsByClassName("multiselect-contain")[
                index
                ];
            selector.style.display = "block";
        }

        function hideMultiSelect(index) {
            var selector = document.getElementsByClassName("multiselect-contain")[
                index
                ];
            selector.style.display = "none";
        }

        // a) Filter applications //

        function setFilterApplications(value) {
            vm.applicationValue = value;
            filterApplications();
        }

        function filterApplications() {
            vm.applications = vm.copyApplications.filter(app => {
                if (vm.applicationValue === "") {
                    return true;
                } else if (
                    app.name.toLowerCase().includes(vm.applicationValue.toLowerCase())
                ) {
                    return true;
                }
                return false;
            });
        }

        function chooseAllApplications(event) {
            if (event.target.checked === true) {
                vm.dataFilterTraffic.applications = vm.applications.map(function(
                    application
                ) {
                    return application.id;
                });
            } else {
                vm.dataFilterTraffic.applications = [];
            }
        }

        function checkChoosenApplication(applicationId) {
            if (
                vm.dataFilterTraffic.applications.find(function(id) {
                    return id === applicationId;
                })
            ) {
                return true;
            }
            return false;
        }

        function addOrRemoveApplication(applicationId) {
            if (
                vm.dataFilterTraffic.applications.find(function(id) {
                    return id === applicationId;
                })
            ) {
                var index = vm.dataFilterTraffic.applications.indexOf(applicationId);
                vm.dataFilterTraffic.applications.splice(index, 1);
            } else {
                vm.dataFilterTraffic.applications.push(applicationId);
            }
        }
    }
})(angular);
