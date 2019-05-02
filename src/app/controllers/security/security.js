(function (angular) {
    "use strict";

    angular.module("jsql").controller("SecurityController", SecurityController);

    /**
     * @ngInject
     */
    function SecurityController(AuthService, $scope, $timeout, DictService, ApplicationService, EventEmitterService, $stateParams, UtilsService) {
        var vm = this;

        vm.loading = true;
        vm.options = null;
        vm.id = parseInt($stateParams.id);
        vm.messages = {
            developerDatabaseOptions: {},
            productionDatabaseOptions: {}
        };
        vm.securityInfo = translation.securityInfo;
        vm.application = null;

        vm.toggleProduction = toggleProduction;
        vm.submitOptions = submitOptions;
        vm.generateRandomSalt = generateRandomSalt;
        vm.warningProdMode = warningProdMode;

        init();

        //--------
        function init() {
            getApplications();
            getOptions();
        }

        function getApplications(){

            DictService.applications().then(function (result) {
                vm.application = _.find(result, { id: vm.id });
            });

        }

        function warningProdMode() {


            if (vm.options.prod) {
                vm.options.prod = false;
                UtilsService.openModal(translation.confirmEnableProductionMode, true, 'Switch', 'warning', translation.productionMode, function () {
                    vm.options.prod = true;
                    vm.toggleProduction();
                });
            } else {
                vm.options.prod = true;
                UtilsService.openModal(translation.confirmDisableProductionMode, true, 'Disable', 'warning', translation.productionMode, function () {
                    vm.options.prod = false;
                    vm.toggleProduction();
                });
            }


        }

        function getOptions() {
            ApplicationService.getOptions(vm.id)
                .then(function (result) {
                    vm.options = result.data;

                    ApplicationService.getOptionsValues().then(function (result) {

                        vm.encodingAlgorithmValues = result.data.encodingAlgorithmValues;
                        vm.databaseDialectValues = result.data.databaseDialectValues;
                        vm.loading = false;

                    });

                })
        }

        function toggleProduction(){

            ApplicationService.toggleProduction(vm.id, {
                prod: vm.options.prod
            })
                .then(function (result) {

                    if (UtilsService.hasGeneralError(result)) {
                        UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                    } else {
                        UtilsService.openSuccessModal(vm.options.prod ? translation.productionEnabled : translation.productionDisabled);

                        DictService.refresh("applications");
                        EventEmitterService.broadcast(
                            EventEmitterService.namespace.APPLICATIONS
                        );

                    }

                })

        }

        function submitOptions() {

            vm.messages = {};

            if (!vm.options.hashLengthLikeQuery) {

                if (vm.options.hashMinLength < 10) {
                    vm.messages.hashMinLength = translation.hash_length_min_value;
                    return;
                } else if (vm.options.hashMaxLength > 500) {
                    vm.messages.hashMaxLength = translation.hash_length_max_value;
                    return;
                } else if (vm.options.hashMinLength > vm.options.hashMaxLength) {
                    vm.messages.hashMinLength = translation.hash_length_min_higher;
                    return;
                }

            }

            if (!vm.options.saltRandomize && vm.options.salt.trim().length === 0) {
                vm.messages.salt = translation.salt_required;
                return;
            }

            ApplicationService.updateOptions(vm.id, UtilsService.without(vm.options, ['application', 'apiKey', 'prod']))
                .then(function (result) {

                    if (UtilsService.hasGeneralError(result)) {
                        UtilsService.openFailedModal(UtilsService.getGeneralError(result));
                    } else if (UtilsService.hasErrors(result)) {
                        vm.messages = UtilsService.getErrors(result);
                    } else {

                        UtilsService.openSuccessModal(translation.optionsUpdated);

                    }

                })
        }

        function generateRandomSalt() {

            function makeid(length) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < length; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            }


            vm.options.salt = makeid(UtilsService.getRandomArbitrary(20, 50));
        }

    }
})(angular);
