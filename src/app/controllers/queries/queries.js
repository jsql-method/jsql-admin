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
        vm.members = [];
        vm.copyMembers = [];
        vm.popup1 = {
            opened: false
        };
        vm.popup2 = {
            opened: false
        };
        vm.dateTo;
        vm.dateFrom;
        vm.altInputFormats = ['M!/d!/yyyy'];
        vm.memberValue = "";
        vm.dataFilterQueries = {
            members: [],
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
        vm.setFilterMembers = setFilterMembers;
        vm.chooseUserId = chooseUserId;
        vm.chooseAllMembers = chooseAllMembers;
        vm.checkChoosenMember = checkChoosenMember;
        vm.addOrRemoveMember = addOrRemoveMember;

        init();

        //--------
        function init() {

            DictService.profile()
                .then(function (result) {
                    vm.profileId = result.id;
                    getMembers();
                });

            window.addEventListener("click", function () {

                var selectors = document.getElementsByClassName("multiselect-contain");
                for (var i = 0; i < selectors.length; i++) {
                    selectors[i].style.display = "none";
                }
            });
        }

        function getMembers() {

            DictService.members()
                .then(function (result) {
                    if (result) {
                        vm.members = angular.copy(result);
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
                                vm.members.push(admin);
                            });
                            vm.members = vm.members.filter(function (member) {
                               if(member.id !== vm.profileId) {
                                   return true;
                               }
                               return false;
                            });
                            vm.copyMembers = vm.members.slice();
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
                members: [vm.profileId],
                used: true,
                dynamic: false
            };

            var dateFrom = getData('dateFrom');
            var dateTo = getData('dateTo');

            vm.dataFilterQueries.dateFrom = dateFrom;
            vm.dataFilterQueries.dateTo = dateTo;
            vm.dataFilterQueries.members = [vm.profileId];

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
                members: getIdMembers(),
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

            if(vm.dataFilterQueries.members.length === 0) {
                openModal("Minimum one user required");
                return;
            }

            var dataTo = addDayForDataTo();

            var data = {
                applications: [vm.id],
                members: vm.dataFilterQueries.members,
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
                members: [],
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

        function setFilterMembers(value) {
            vm.membersValue = value;
            filterMembers();
        }

        function filterMembers() {
            vm.members = vm.copyMembers.filter(member => {
                if (vm.memberValue === "") {
                    return true;
                } else if (
                    (
                        member.firstName.toLowerCase() +
                        " " +
                        member.lastName.toLowerCase()
                    ).includes(vm.memberValue.toLowerCase())
                ) {
                    return true;
                }
                return false;
            });
        }

        function chooseUserId(event) {
            if (event.target.checked === true) {
                vm.dataFilterQueries.members.push(vm.profileId);
            } else {
                vm.dataFilterQueries.members = vm.dataFilterQueries.members.filter(function (member) {
                    if(member !== vm.profileId) {
                        return true;
                    }
                    return false;
                })
            }
        }

        function chooseAllMembers(event) {
            if (event.target.checked === true) {
                vm.dataFilterQueries.members = vm.members.map(function (
                    member
                ) {
                    return member.id;
                });
                vm.dataFilterQueries.members.push(vm.profileId);
            } else {
                vm.dataFilterQueries.members = [];
            }
        }

        function checkChoosenMember(memberId) {
            if (
                vm.dataFilterQueries.members.find(function (id) {
                    return id === memberId;
                })
            ) {
                return true;
            }
            return false;
        }

        function addOrRemoveMember(memberId) {
            if (
                vm.dataFilterQueries.members.find(function (id) {
                    return id === memberId;
                })
            ) {
                var index = vm.dataFilterQueries.members.indexOf(memberId);
                vm.dataFilterQueries.members.splice(index, 1);
            } else {
                vm.dataFilterQueries.members.push(memberId);
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
