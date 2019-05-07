(function (angular) {
    "use strict";

    angular.module("jsql").factory("ApiFactory", ApiFactory);

    /**
     * @ngInject
     */
    function ApiFactory($http, $injector) {
        var provider = {};

        /**
         * Adresy URL serwera - lokalnego bądź środowiska testowego
         */

        /**
         * Konstruuje i zwraca dostosowany obiekt $http
         */
        provider.construct = function (fullUrl, method, request, params, urlParams) {
            if (params) {

                for (var prop in params) {

                    if(params.hasOwnProperty(prop)){
                        fullUrl = fullUrl.replace("{" + prop + "}", params[prop]);
                    }

                }

            }

            if (urlParams) {
                var urlParamsStr = "?";
                for (var prop in urlParams) {

                    if(urlParams.hasOwnProperty(prop)){
                        urlParamsStr += "&" + prop + "=" + urlParams[prop];
                    }

                }

                urlParamsStr = urlParamsStr.replace("?&", "?");
                fullUrl += urlParamsStr;
            }

            var headers =  {
                Session: $injector.get("AuthService").getToken() || "none",
                "Content-Type": "application/json",
                Accept: "application/json; charset=utf-8"
            };


            if(params){
                if(params.page !== null && params.page !== undefined){
                    headers['Page'] = params.page;
                }
            }


            var promise = $http({
                url: fullUrl,
                method: method,
                dataType: "json",
                headers: headers,
                data: request
            }).then(function (result) {

                if(result.status === 401){
                    return result;
                }

                if (result) {
                    return result.data || null;
                }

                return null;

            }).catch(function (err) {

                console.error(err);

                if(err.status === -1){
                    $injector.get('AuthService').deleteSession();
                    window.location = '/login';
                }

                if (err.status !== 401 && err.status !== -1) {
                    $injector.get('UtilsService').openFailedModal();
                }

                return err;

            });


            return {
                $promise: promise
            };
        };

        provider.get = function (url, params, urlParams) {
            return this.construct(url, "GET", null, params, urlParams);
        };

        provider.post = function (url, request, params, urlParams) {
            return this.construct(url, "POST", request, params, urlParams);
        };

        provider.put = function (url, request, params, urlParams) {
            return this.construct(url, "PUT", request, params, urlParams);
        };

        provider.patch = function (url, request, params, urlParams) {
            return this.construct(url, "PATCH", request, params, urlParams);
        };

        provider.delete = function (url, params, urlParams) {
            return this.construct(url, "DELETE", null, params, urlParams);
        };

        return provider;
    }
})(angular);
