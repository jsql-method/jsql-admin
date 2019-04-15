(function (angular) {
    "use strict";

    angular.module("jsql").service("UtilsService", UtilsService);

    /**
     * @ngInject
     */
    function UtilsService($rootScope, $state, $stateParams, DictService, EventEmitterService, $location, $uibModal) {
        var utils = {};

        utils.without = function(map, arr){

            var map2 = {};

            for(var prop in map){
                if(arr.indexOf(prop) === -1){
                    map2[prop] = map[prop];
                }
            }

            return map2;

        };

        utils.openFailedModel = function(text){
            utils.openModal(text || translation.something_gone_wrong, false, 'Ok', 'error', 'Error', null);
        };

        utils.openSuccessModal = function(text, callback){
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

        utils.getGeneralError = function(result){
            return result.data.errorMessage;
        };

        utils.hasGeneralError = function(result){
            return (result.status === 200 || result.status === 204) && result.data.errorMessage;
        };

        utils.hasErrors = function (result) {
            return result.status === 204 && result.data.messages;
        };

        utils.getErrors = function (result) {
            var errorData = result.data.messages;
            var messages = {};
            for (var field in errorData) {
                messages[field] = translation[errorData[field]] || translation.error.replace('{0}', errorData[field]);
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
                str = str.replace(":" + paramName, params[paramName]);
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
