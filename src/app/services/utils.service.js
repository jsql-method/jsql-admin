(function (angular) {
    "use strict";

    angular.module("jsql").service("UtilsService", UtilsService);

    /**
     * @ngInject
     */
    function UtilsService($rootScope, $state, $stateParams, DictService, EventEmitterService, $location, $uibModal) {
        var utils = {};

         utils.isValidDate = function(date){
            var day = parseInt(date.substring(0,2));
            var month = parseInt(date.substring(3,5));
            var year = parseInt(date.substring(6, 10));

            if(day > 31 || day === 0){
                return false;
            }

            if(month > 12 || month === 0){
                return false;
            }

            if(year < 1900 || year === 0 || year > 2100){
                return false;
            }

            return true;

        };

        utils.copyToClipboard = function (elementId, modalMessage) {

            try {
                var copyText = document.getElementById(elementId);
                copyText.select();
                var successful = document.execCommand("copy");
                if (!successful) throw successful;
                copyText.setSelectionRange(0, 0);
                utils.openSuccessModal(modalMessage);
            } catch (e) {
                console.log(e);
            }

        };

        utils.saveToFile = function (data, filename) {

            var file = new Blob([data]);
            if (window.navigator.msSaveOrOpenBlob) // IE10+
                window.navigator.msSaveOrOpenBlob(file, filename+'.key');
            else { // Others
                var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }

        };

        utils.getPrimaryColor = function () {
            return '#0a7cbe';
        };


        utils.getRandomColor = function () {
            var letters = "0123456789ABCDEF";
            var color = "#";
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        utils.elementHeight = function (element) {
            return element.clientHeight || element.offsetHeight;
        };

        utils.fillArray = function (length) {

            var arr = [];

            for (var i = 0; i < length; i++) {
                arr.push(i);
            }

            return arr;

        };

        utils.applicationsToOptions = function (applications) {

            var options = [];

            for (var i = 0; i < applications.length; i++) {
                options.push({
                    id: applications[i].id,
                    label: applications[i].name
                });
            }

            return options;

        };

        utils.developersToOptions = function (developers) {

            var options = [];

            for (var i = 0; i < developers.length; i++) {
                options.push({
                    id: developers[i].id,
                    label: developers[i].firstName + ' ' + developers[i].lastName
                });
            }

            return options;

        };

        utils.getRandomArbitrary = function (min, max) {
            return Math.random() * (max - min) + min;
        };

        utils.getRandomFloor = function (min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        };

        utils.without = function (map, arr) {

            var map2 = {};

            for (var prop in map) {

                if (map.hasOwnProperty(prop)) {
                    if (arr.indexOf(prop) === -1) {
                        map2[prop] = map[prop];
                    }
                }

            }

            return map2;

        };

        utils.openFailedModal = function (text) {
            utils.openModal(text || translation.something_gone_wrong, false, 'Ok', 'error', 'Error', null);
        };

        utils.openSuccessModal = function (text, callback) {
            utils.openModal(text, false, 'Confirm', null, null, callback);
        };

        utils.openModal = function (text, vissibleButtonDelete, submitTextButton, clazz, title, callBack) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "app/modals/message/message.html",
                controller: "MessageController",
                controllerAs: "vm",
                resolve: {
                    Data: function () {
                        return {
                            clazz: clazz || "success",
                            title: title || "Success",
                            message: text,
                            vissibleButtonDelete: vissibleButtonDelete,
                            submit: submitTextButton
                        };
                    }
                }
            });

            modalInstance.result.then(
                function (result) {
                    if (result) {
                        if (callBack) callBack();
                    }
                },
                function () {
                }
            );

        };

        utils.getGeneralError = function (result) {
            return translation[result.data.errorMessage] || result.data.errorMessage;
        };

        utils.hasGeneralError = function (result) {
            return (result.status === 200 || result.status === 204) && result.data.errorMessage;
        };

        utils.hasErrors = function (result) {
            return result.status === 204 && result.data.messages;
        };

        utils.getErrors = function (result) {
            var errorData = result.data.messages;
            var messages = {};
            for (var field in errorData) {

                if (errorData.hasOwnProperty(field)) {
                    messages[field] = translation[errorData[field]] || translation.error.replace('{0}', errorData[field]);
                }

            }
            return messages;

        };

        utils.formatDateFromTimestamp = function (timestamp, format) {
            return utils.formatDate(new Date(timestamp), format);
        };

        utils.formatDate = function (date, format) {
            var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes(),
                seconds = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds(),
                hours = (date.getHours() < 10 ? "0" : "") + date.getHours(),
                day = (date.getDate() < 10 ? "0" : "") + date.getDate(),
                month = (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1),
                year = 1900 + date.getYear();


            // if(!utils.isValidDate(vm.filter.dateFrom) || !utils.isValidDate(vm.filter.dateTo)){
            //     utils.openFailedModal(translation.invalid_dates);
            //     return;
            // }

            // var _day = parseInt(day);
            // var _month = parseInt(month);
            // var _year = parseInt(year);
            //
            // if(_day > 31 || _day === 0){
            //     utils.openFailedModal(translation.invalid_dates);
            //     return null;
            // }
            //
            // if(_month > 12 || _month === 0){
            //     utils.openFailedModal(translation.invalid_dates);
            //     return null;
            // }
            //
            // if(_year < 1900 || _year === 0 || _year > 2100){
            //     utils.openFailedModal(translation.invalid_dates);
            //     return null;
            // }

            return format
                .replace("yyyy", year)
                .replace("ss", seconds)
                .replace("HH", hours)
                .replace("mm", minutes)
                .replace("dd", day)
                .replace("MM", month)
                .replace("yy", (year + "").substring(2, 4));
        };

        /**
         * Funkcja binduje parametry do podanego stringa z podanego obiektu po dwukropku
         * Tomek ma na imie :name
         *
         * @param str - string
         * @param params - obiekt
         * @returns {*}
         */
        utils.bindParams = function (str, params) {

            for (var paramName in params) {

                if (params.hasOwnProperty(paramName)) {
                    str = str.replace(":" + paramName, params[paramName]);
                }

            }

            return str;
        };

        /**
         * Funkcja ustawia tytuł dowolnej strony
         * Każdy state powinien mieć w @data parametr @title oraz @shortTitle
         * Parametr @title i @shortTitle może zawierać :name wskazujący na nazwę aplikacji
         * Parametr @title ustawia tytuł całej strony
         * Parametr @shortTitle ustawia nazwę w breadcrumbach
         */
        utils.setTitle = function () {
            function setTitle(params) {
                if (!$state.current.abstract) {
                    $rootScope.title = utils.bindParams(
                        $state.current.data.title,
                        params || {}
                    );

                    EventEmitterService.broadcast(
                        EventEmitterService.namespace.VISIT_PAGE,
                        {
                            name: utils.bindParams(
                                $state.current.data.shortTitle,
                                params || {}
                            ),
                            url: $location.path()
                        }
                    );
                }

                return "JSQL";
            }

            if ($stateParams.id) {
                DictService.applications().then(function (applications) {
                    var application = _.find(applications, {
                        id: parseInt($stateParams.id)
                    });
                    if (application) {
                        setTitle({name: application.name});
                    } else {
                        setTitle();
                    }
                });
            } else {
                setTitle();
            }
        };

        return utils;
    }
})(angular);
