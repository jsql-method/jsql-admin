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

        vm.keyType = translation.yourDeveloperKeyForDevelopment;
        vm.developerKey = '';
        vm.role = AuthService.getRole();

        vm.copyDeveloperKey = copyDeveloperKey;
        vm.saveToFile = saveToFile;

        init();

        function init() {
            vm.developerKey = AuthService.getDeveloperKey();
        }

        function copyDeveloperKey() {
            UtilsService.copyToClipboard("developerKey", translation.developerKeyCopiedToClipboard);
        }

        function saveToFile(){
            UtilsService.saveToFile(vm.developerKey, 'jsql');
        }

    }
})(angular);
