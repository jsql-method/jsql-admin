(function (angular) {
    'use strict';

    angular
        .module('jsql')
        .controller('MessageController', ['$uibModalInstance', 'Data', MessageController]);

    /**
     * @ngInject
     */
    function MessageController($uibModalInstance, Data) {
        var vm = this;

        vm.clazz = Data.clazz;
        vm.title = Data.title;
        vm.message = Data.message;
        vm.vissibleButtonDelete = Data.vissibleButtonDelete || false;
        vm.submit = Data.submit;

        vm.closeModal = function (value) {
            $uibModalInstance.close(value);
        }
    }
})(angular);