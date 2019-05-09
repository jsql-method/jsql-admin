(function (angular) {
    "use strict";

    angular.module("jsql").service("AuthService", AuthService);

    /**
     * @ngInject
     */
    function AuthService(EndpointsFactory, $state) {
        var provider = {};

        /**
         * Nazwa parametru sesji oraz klucza sesji w sessionStorage
         * @type {string}
         */
        provider.SESSION_STORAGE = "_session";
        provider.KEY_STORAGE = "_sdch";
        provider.SESSION_DATA = "_sd";
        provider.DEV_KEY_STORAGE = '_kdch';

        provider.SALT = "vsdFSDFsdfvdfsdvGdfgcdvfgvdscsfd";

        /**
         * Funkcja autoryzuje użytkownika w systmie
         * Opcjonalnie callbacki
         * @param user
         * @param successCallback
         * @param errorCallback
         */
        provider.login = function (user, callback) {
            EndpointsFactory.login(user)
                .$promise.then(function (result) {

                if (callback !== undefined) {
                    callback(result);
                }

                if (result.status === 200) {

                    provider.setSession(result.data);

                    if(provider.getRole() === 'APP_DEV'){
                        $state.go('builds');
                    }else {
                        EndpointsFactory.plan().$promise.then(function (result) {
                            provider.setPlan(result.data);
                            $state.go('builds');
                        });
                    }

                }

                return result;

            }).catch(function (err) {
                if (callback !== undefined && err) {
                    callback(err.data);
                }
            });
        };

        provider.refreshSession = function(callback){


              return EndpointsFactory.session().$promise.then(function (result) {

                if (result.status === 200) {
                    provider.setSession(result.data);

                    if(provider.getRole() === 'APP_DEV'){

                        if(callback){
                            callback();
                        }

                    }else{

                        EndpointsFactory.plan().$promise.then(function (result) {
                            provider.setPlan(result.data);
                            if(callback){
                                callback();
                            }
                        });

                    }

                }

                return result;

            })

        };

        /**
         * Funkcja tworzy użytkownika w systemie
         * Opcjonalnie callbacki
         * @param user
         * @param successCallback
         * @param errorCallback
         */
        provider.register = function (user) {
            return EndpointsFactory.register(user).$promise;
        };

        /**
         * Funkcja resetuje hasło użytkownika w systemie
         * Opcjonalnie callbacki
         * @param user
         * @param successCallback
         * @param errorCallback
         */
        provider.forgotPassword = function (user) {
            return EndpointsFactory.forgotPassword(user).$promise;
        };

        provider.reset = function (token, data) {
            return EndpointsFactory.reset(token, data).$promise;
        };

        /**
         * Funkcja unieważniająca autoryzację użytkownika
         * @param successCallback
         * @param errorCallback
         */
        provider.logout = function () {
            return EndpointsFactory.logout().$promise;
        };

        /**
         * Sprawdza czy istnieje zapisana sesja w przeglądarce
         * @returns {boolean}
         */
        provider.isLogged = function () {
            var cookies = provider.isSessionCookieExist('auth_expire');
            var session = sessionStorage.getItem(provider.SESSION_STORAGE);
            var key = sessionStorage.getItem(provider.KEY_STORAGE);

            if (cookies === false) {
                provider.removeCookies();
                provider.deleteSession();
            }

            if (session && key && cookies) {
                provider.setCookie('auth_expire', 60);
                return true;
            }

            return false;
        };

        provider.beautifyRole = function(role){

            switch (role) {
                case 'COMPANY_ADMIN':
                    return 'Company manager';
                case 'APP_ADMIN':
                    return 'Administrator';
                case 'APP_DEV':
                    return 'Developer';
            }

        };

        /**
         * Usuwa zapisaną sesję w przeglądarce
         */
        provider.deleteSession = function () {

            sessionStorage.removeItem(provider.SESSION_STORAGE);
            sessionStorage.removeItem(provider.KEY_STORAGE);
            sessionStorage.removeItem(provider.SESSION_DATA);
            sessionStorage.removeItem(provider.DEV_KEY_STORAGE);

            window.localStorage.clear();
            provider.removeCookies();
        };

        /**
         * Koduje i ustawia hash sesji w przeglądarce
         * @param token
         * @param developerKey
         * @param loginRole
         * @param role
         */
        provider.setSession = function (sessionData) {

            var role = provider.SALT;
            var session = "";
            var key = [];

            var r = role.length - 1;
            for (var i = 0; i < sessionData.sessionToken.length; i++) {
                if (i % 3 === 0 && r >= 0) {
                    session += role[r];
                    key.push({r: i});
                    r--;
                    key.push({s: sessionData.sessionToken[i]});
                } else {
                    session += sessionData.sessionToken[i];
                }
            }

            sessionStorage.setItem(provider.SESSION_STORAGE, session);
            sessionStorage.setItem(provider.KEY_STORAGE, JSON.stringify(key));
            sessionStorage.setItem(provider.SESSION_DATA, JSON.stringify({
                id: sessionData.id,
                companyName: sessionData.companyName,
                developerKey: provider.hashDeveloperKey(sessionData.developerKey),
                fullName: sessionData.fullName,
                role: sessionData.role
            }));

            provider.setCookie('auth_expire', 60);

        };

        provider.getSessionData = function () {
            return JSON.parse(sessionStorage.getItem(provider.SESSION_DATA)) || {};
        };

        provider.hashDeveloperKey = function (developerKey) {

            var role = provider.SALT;
            var session = "";
            var key = [];

            var r = role.length - 1;
            for (var i = 0; i < developerKey.length; i++) {
                if (i % 3 === 0 && r >= 0) {
                    session += role[r];
                    key.push({r: i});
                    r--;
                    key.push({s: developerKey[i]});
                } else {
                    session += developerKey[i];
                }
            }

            sessionStorage.setItem(provider.DEV_KEY_STORAGE, JSON.stringify(key));

            return session;


        };

        provider.unhashDeveloperKey = function (developerKey) {

            var session = developerKey
            var key = JSON.parse(sessionStorage.getItem(provider.DEV_KEY_STORAGE));

            if (!session || !key) {
                return "";
            }

            var token = session;
            var splitted;
            var splitIndex;
            for (var i = 0; i < key.length; i++) {
                if (key[i].r !== undefined) {
                    splitted = token.split("");
                    splitIndex = key[i].r;
                }
                if (key[i].s !== undefined) {
                    splitted[splitIndex] = key[i].s;
                    token = splitted
                        .toString()
                        .split(",")
                        .join("");
                }
            }

            return token;

        }

        provider.getToken = function () {
            var session = sessionStorage.getItem(provider.SESSION_STORAGE);
            var key = JSON.parse(sessionStorage.getItem(provider.KEY_STORAGE));

            if (!session || !key) {
                return "";
            }

            var token = session;
            var splitted;
            var splitIndex;
            for (var i = 0; i < key.length; i++) {
                if (key[i].r !== undefined) {
                    splitted = token.split("");
                    splitIndex = key[i].r;
                }
                if (key[i].s !== undefined) {
                    splitted[splitIndex] = key[i].s;
                    token = splitted
                        .toString()
                        .split(",")
                        .join("");
                }
            }

            return token;
        };

        provider.getRole = function () {
            var sessionData = provider.getSessionData();
            return sessionData.role;
        };

        provider.getDeveloperKey = function () {
            var sessionData = provider.getSessionData();
            return provider.unhashDeveloperKey(sessionData.developerKey);
        };

        provider.getPlan = function () {
            var sessionData = provider.getSessionData();
            return sessionData.plan;
        };

        provider.updateUserDetails = function (data) {
            return EndpointsFactory.updateUserDetails(data).$promise;
        };

        provider.changePassword = function (data) {
            return EndpointsFactory.changePassword(data).$promise;
        };

        provider.activateAccount = function (token) {
            return EndpointsFactory.activateAccount(token).$promise;
        };

        provider.reactivateAccount = function (data) {
            return EndpointsFactory.reactivateAccount(data).$promise
        };

        provider.deactivateAccount = function () {
            return EndpointsFactory.deactivateAccount().$promise;
        };

        provider.getImage = function () {
            return EndpointsFactory.getImage().$promise;
        };

        /**
         * Dodaje Plan ilość użytkowników i aplikacji
         * @returns {string}
         */

        provider.setPlan = function (plan) {

            var sessionData = provider.getSessionData();
            sessionData.plan = plan;

            sessionStorage.setItem(provider.SESSION_DATA, JSON.stringify(sessionData));

        };

        provider.setCookie = function (cname, exminutes) {
            var d = new Date();
            var expire_time = d.setTime(d.getTime() + (exminutes * 1000 + (3600 * 1000)));
            var expires = d.toUTCString();

            window.document.cookie = cname + "=" + expire_time.valueOf() + ";expires=" + expires + ";path=/";
        };

        provider.isSessionCookieExist = function (cname) {
            var d = new Date();
            var fresh_time = d.getTime();

            if (document.cookie.split(';')
                    .filter(function (item) {
                        return item.includes(cname + '=') === true
                    })
                    .length && parseInt(provider.readCookie(cname)) > fresh_time.valueOf()) {
                return true;
            } else {
                return false;
            }
        };

        provider.readCookie = function (cname) {

            var nameEQ = cname + "=";
            var ca = document.cookie.split(';');

            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;

        };

        provider.removeCookies = function () {
            var res = document.cookie;
            var multiple = res.split(";");
            for (var i = 0; i < multiple.length; i++) {
                var key = multiple[i].split("=");
                document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
            }
        };

        return provider;
    }
})(angular);
