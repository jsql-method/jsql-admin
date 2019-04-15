(function (angular) {
    "use strict";

    angular.module("jsql").controller("QueriesController", QueriesController);

    /**
     * @ngInject
     */
    function QueriesController(AuthService, ApplicationService, DictService, $stateParams, $uibModal, dateFormat) {

        var vm = this;

        vm.id = parseInt($stateParams.id);
        vm.queries;
        vm.applications;
        vm.application;
        vm.role = localStorage.getItem('_mRole');
        vm.indexVissible = -1;
        vm.profileId = -1;
        vm.valueQueryOrHash = "";
        vm.vissibleEdit = false;
        vm.numberEdit = -1;
        vm.valueQuery = "";
        vm.copyQueries = [];
        vm.format = dateFormat.html5Types.date;
        vm.developers = [];
        vm.copyDevelopers = [];
        vm.popup1 = {
            opened: false
        };
        vm.popup2 = {
            opened: false
        };
        vm.dateTo;
        vm.dateFrom;
        vm.altInputFormats = ['M!/d!/yyyy'];
        vm.developerValue = "";
        vm.dataFilterQueries = {
            developers: [],
            dateFrom: "",
            dateTo: "",
            used: false,
            dynamic: false
        };

        vm.setDateFrom = setDateFrom;
        vm.setDateTo = setDateTo;
        vm.submitFilterQueries = submitFilterQueries;
        vm.clearData = clearData;
        vm.open1 = open1;
        vm.open2 = open2;
        vm.showMultiSelect = showMultiSelect;
        vm.hideMultiSelect = hideMultiSelect;
        vm.setFilterDevelopers = setFilterDevelopers;
        vm.chooseUserId = chooseUserId;
        vm.chooseAllDevelopers = chooseAllDevelopers;
        vm.checkChoosenDeveloper = checkChoosenDeveloper;
        vm.addOrRemoveDeveloper = addOrRemoveDeveloper;

        init();

        //--------
        function init() {

            DictService.profile()
                .then(function (result) {
                    vm.profileId = result.id;
                    getDevelopers();
                });

            window.addEventListener("click", function () {

                var selectors = document.getElementsByClassName("multiselect-contain");
                for (var i = 0; i < selectors.length; i++) {
                    selectors[i].style.display = "none";
                }
            });
        }

        function getDevelopers() {

            DictService.developers()
                .then(function (result) {
                    if (result) {
                        vm.developers = angular.copy(result);
                    }
                    getAdmins();
                })

        }

        function getAdmins() {

            DictService.admins()
                .then(function (result) {
                    if (result) {
                        if (result.length > 0) {
                            result.forEach(function (admin) {
                                vm.developers.push(admin);
                            });
                            vm.developers = vm.developers.filter(function (developer) {
                               if(developer.id !== vm.profileId) {
                                   return true;
                               }
                               return false;
                            });
                            vm.copyDevelopers = vm.developers.slice();
                        }
                    }
                    getApplications();
                })

        }

        function getApplications() {

            DictService.applications()
                .then(function (result) {
                    vm.applications = result;
                    vm.application = _.find(result, {id: vm.id});
                   getQueries();
                })

        }

        function getQueries() {

            var data = {
                applications: [vm.id],
                developers: [vm.profileId],
                used: true,
                dynamic: false
            };

            var dateFrom = getData('dateFrom');
            var dateTo = getData('dateTo');

            vm.dataFilterQueries.dateFrom = dateFrom;
            vm.dataFilterQueries.dateTo = dateTo;
            vm.dataFilterQueries.developers = [vm.profileId];

            ApplicationService.getQueries(dateFrom, dateTo, data)
                .then(function (result) {
                    vm.queries = result.data.data;
                    vm.copyQueries = vm.queries.slice();
                })

        }

        function getData(when) {

            var data = new Date();
            var dateOffset;
            if (when === 'dateFrom') {
                dateOffset = (24 * 60 * 60 * 1000) * 7; //5 days
                data.setTime(data.getTime() - dateOffset);
            } else {
                dateOffset = (24 * 60 * 60 * 1000) * 1; //1 days
                data.setTime(data.getTime() + dateOffset);
            }

            var day = data.getDate();

            if (day < 10) {
                day = '0' + day;
            }

            var mounth = data.getMonth() + 1;

            if (mounth < 10) {
                mounth = '0' + mounth;
            }

            return day + '-' + mounth + '-' + data.getFullYear();

        }

        function open1() {

            vm.popup1.opened = true;

        }

        function open2() {

            vm.popup2.opened = true;

        }

        /**
         *  Section edit Query
         * */

        vm.setEdit = function (index, value) {
            if (vm.role === "COMPANY_ADMIN" || vm.role === "ADMIN") {
                return;
            }

            vm.indexVissible = index;
            vm.vissibleEdit = true;
            vm.valueQuery = value;

            setTimeout(function () {
                document.getElementById("input-edit-query").focus();
            });
        };

        vm.saveQuery = function (queries) {
            if(vm.valueQuery.length > 100) {
                openModal('Hash max length 100!')
                return;
            }
            var data = {
                query: vm.valueQuery,
                apiKey: vm.application.apiKey
            };

            var dataQueries = {
                applications: [vm.id],
                developers: getIdDevelopers(),
                used: vm.dataFilterQueries.used,
                dynamic: vm.dataFilterQueries.dynamic
            };

            ApplicationService.updateQuery(
                queries.id,
                data
            )
                .then(function (result) {
                    if (result.data.code !== 200) {
                        vm.valueQuery = queries.query;
                        openModal(result.data.data);

                    } else {
                        openModal('Hash changed successfully!');
                        ApplicationService.getQueries(vm.dataFilterQueries.dateFrom, vm.dataFilterQueries.dateTo, dataQueries)
                            .then(function (result) {
                                vm.queries = result.data.data;
                                vm.copyQueries = vm.queries.slice();
                            })
                    }
                });
            vm.vissibleEdit = false;
        };

        /**
         * Filter Queries from Api
         * */

        function setDateFrom() {
            vm.dataFilterQueries.dateFrom = document.getElementById('dateFrom').value;
        }

        function setDateTo() {
            vm.dataFilterQueries.dateTo = document.getElementById('dateTo').value;
        }

        function submitFilterQueries() {

            if(vm.dataFilterQueries.developers.length === 0) {
                openModal("Minimum one user required");
                return;
            }

            var dataTo = addDayForDataTo();

            var data = {
                applications: [vm.id],
                developers: vm.dataFilterQueries.developers,
                used: vm.dataFilterQueries.used,
                dynamic: vm.dataFilterQueries.dynamic
            };

            ApplicationService.getQueries(vm.dataFilterQueries.dateFrom, dataTo, data)
                .then(function (result) {
                    vm.queries = result.data.data;
                    vm.copyQueries = vm.queries.slice();
                })
        }

        function addDayForDataTo() {
            var dateTo = vm.dataFilterQueries.dateTo;
            var data = new Date(parseInt(dateTo.substr(6)),parseInt(dateTo.substr(3,2)) - 1,parseInt(dateTo.substr(0,2)));
            var dateOffset = (24 * 60 * 60 * 1000) * 1; //1 days

            data.setTime(data.getTime() + dateOffset);

            var day = data.getDate();
            if (day < 10) {
                day = '0' + day;
            }

            var mounth = data.getMonth() + 1;
            if (mounth < 10) {
                mounth = '0' + mounth;
            }

            return day + '-' + mounth + '-' + data.getFullYear();
        }

        function clearData() {
            vm.dataFilterQueries = {
                developers: [],
                dateFrom: "",
                dateTo: "",
                used: false,
                dynamic: false
            };

            vm.dateTo = null;
            vm.dateFrom = null;
        }

        /**
         *  Filter Hash or Query
         * */

        vm.setFilterQueryOrHash = function (value) {
            vm.valueQueryOrHash = value;
            vm.filterData();
        };

        vm.filterData = function () {
            vm.queries = vm.copyQueries.filter(row => {
                if (vm.valueQueryOrHash === "") {
                    return true;
                } else if (
                    row.hash.toLowerCase().includes(vm.valueQueryOrHash.toLowerCase()) ||
                    row.query.toLowerCase().includes(vm.valueQueryOrHash.toLowerCase())
                ) {
                    return true;
                }
                return false;
            });
        };


        /**
         * Multiselect
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

        function setFilterDevelopers(value) {
            vm.developersValue = value;
            filterDevelopers();
        }

        function filterDevelopers() {
            vm.developers = vm.copyDevelopers.filter(developer => {
                if (vm.developerValue === "") {
                    return true;
                } else if (
                    (
                        developer.firstName.toLowerCase() +
                        " " +
                        developer.lastName.toLowerCase()
                    ).includes(vm.developerValue.toLowerCase())
                ) {
                    return true;
                }
                return false;
            });
        }

        function chooseUserId(event) {
            if (event.target.checked === true) {
                vm.dataFilterQueries.developers.push(vm.profileId);
            } else {
                vm.dataFilterQueries.developers = vm.dataFilterQueries.developers.filter(function (developer) {
                    if(developer !== vm.profileId) {
                        return true;
                    }
                    return false;
                })
            }
        }

        function chooseAllDevelopers(event) {
            if (event.target.checked === true) {
                vm.dataFilterQueries.developers = vm.developers.map(function (
                    developer
                ) {
                    return developer.id;
                });
                vm.dataFilterQueries.developers.push(vm.profileId);
            } else {
                vm.dataFilterQueries.developers = [];
            }
        }

        function checkChoosenDeveloper(developerId) {
            if (
                vm.dataFilterQueries.developers.find(function (id) {
                    return id === developerId;
                })
            ) {
                return true;
            }
            return false;
        }

        function addOrRemoveDeveloper(developerId) {
            if (
                vm.dataFilterQueries.developers.find(function (id) {
                    return id === developerId;
                })
            ) {
                var index = vm.dataFilterQueries.developers.indexOf(developerId);
                vm.dataFilterQueries.developers.splice(index, 1);
            } else {
                vm.dataFilterQueries.developers.push(developerId);
            }
        }

        /**
         *  Modal
         * */

        function openModal(text) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "app/modals/message/message.html",
                controller: "MessageController",
                controllerAs: "vm",
                resolve: {
                    Data: function () {
                        return {
                            clazz: "success",
                            title: "Update query!",
                            message: text
                        };
                    }
                }
            });
        }
    }
})(angular);
