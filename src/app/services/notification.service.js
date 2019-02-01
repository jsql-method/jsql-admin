
(function(angular) {
    "use strict";

    angular.module("jsql").service("NotificationService", NotificationService);

    /**
     * @ngInject
     */
    function NotificationService(EventEmitterService) {
        var service = {};

        service.__notify = function(type, title, message){

            EventEmitterService.broadcast(EventEmitterService.namespace.NOTIFICATION, {
                type: type,
                title: title,
                message: message
            });

        };

        service.success = function(title, message){
            service.__notify('success', title, message);
        };

        service.error = function(title, message){
            service.__notify('error', title, message);
        };

        service.info = function(title, message){
            service.__notify('info', title, message);
        };

        return service;
    }
})(angular);