(function (angular) {
    'use strict';

    angular
        .module('jsql')
        .controller('EditorController', ['$uibModalInstance', '$timeout', 'Data', EditorController]);

    /**
     * @ngInject
     */
    function EditorController($uibModalInstance, $timeout, Data) {
        var vm = this;

        var editor;

        vm.query = Data.query;

        function loadAce(){
            resizeOn();
            editor = ace.edit("editor");
            editor.setTheme("ace/theme/theme/sqlserver");
            editor.session.setMode("ace/mode/sql");
            editor.session.setUseSoftTabs(true);
            editor.resize();
        }

        function resizeOn(){
            document.getElementsByClassName('modal-dialog')[0].style = 'max-width: 1000px;';
        }

        function resizeOff(){
            document.getElementsByClassName('modal-dialog')[0].style = 'max-width: 500px;';
        }

        $timeout(loadAce);

        vm.closeModal = function (value) {
            $uibModalInstance.close(value);
            resizeOff();
        };

        vm.submit = function(){

            vm.query.query = editor.getValue();
            $uibModalInstance.close(vm.query);

            resizeOff();

        };

    }
})(angular);