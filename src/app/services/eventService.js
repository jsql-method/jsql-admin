(function (angular) {
    "use strict";

    angular.module("jsql").service("EventService", EventService);

    /**
     * @ngInject
     */
    function EventService() {

        var clickEvents = {};

        function registerClick(name, fn) {

            if(clickEvents[name]) {
                console.warn('Event already exists');
            }

            clickEvents[name] = fn;

        }

        function unregisterClick(name) {

            clickEvents[name] = null;

        }

        function registerClickEvent() {

            window.addEventListener('click', function (event) {
                Object.keys(clickEvents).map(function(key) {
                    if(clickEvents[key]) {
                        clickEvents[key](event);
                    }
                });
            })

        }

        registerClickEvent();

        return {
            registerClick: registerClick,
            unregisterClick: unregisterClick
        }


    }
})(angular);
