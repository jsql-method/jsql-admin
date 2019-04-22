(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("DeveloperKeyController", DeveloperKeyController);

    /**
     * @ngInject
     */
    function DeveloperKeyController(AuthService, UtilsService) {
        var vm = this;

        vm.keyType = '';
        vm.developerKey = '';
        vm.role = AuthService.getRole();

        vm.copyDeveloperKey = copyDeveloperKey;
        vm.saveToFile = saveToFile

        init();

        function init() {

            vm.developerKey = AuthService.getDeveloperKey();

            if(vm.role === 'APP_DEV'){
                vm.keyType = translation.yourDeveloperKeyForDevelopment;
            }else if(vm.role === 'COMPANY_ADMIN' || vm.role === 'APP_ADMIN'){
                vm.keyType = translation.onlyDevelopmentKeyProductionKeyForApp;
            }

        }

        function copyDeveloperKey() {
            UtilsService.copyToClipboard("developerKey", translation.developerKeyCopiedToClipboard);
        }

        function saveToFile(){
            UtilsService.saveToFile(vm.developerKey, 'jsql');
        }

    }
})(angular);
