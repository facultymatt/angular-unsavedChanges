'use strict';
/*jshint globalstrict: true*/
/*jshint undef:false */

angular
    .module('unsavedChanges', [])

.provider('unsavedWarningsConfig', function() {

    var _this = this;

    // set defaults
    var logEnabled = false;
    var useTranslateService = true;
    var routeEvent = '$locationChangeStart';
    var navigateMessage = 'You will lose unsaved changes if you leave this page';
    var reloadMessage = 'You will lose unsaved changes if you reload this page';

    Object.defineProperty(_this, 'navigateMessage', {
        get: function() {
            return navigateMessage;
        },
        set: function(value) {
            navigateMessage = value;
        }
    });

    Object.defineProperty(_this, 'reloadMessage', {
        get: function() {
            return reloadMessage;
        },
        set: function(value) {
            reloadMessage = value;
        }
    });

    Object.defineProperty(_this, 'useTranslateService', {
        get: function() {
            return useTranslateService;
        },
        set: function(value) {
            useTranslateService = !! (value);
        }
    });

    Object.defineProperty(_this, 'routeEvent', {
        get: function() {
            return routeEvent;
        },
        set: function(value) {
            routeEvent = value;
        }
    });
    Object.defineProperty(_this, 'logEnabled', {
        get: function() {
            return logEnabled;
        },
        set: function(value) {
            logEnabled = !! (value);
        }
    });

    this.$get = ['$injector',
        function($injector) {

            function translateIfAble(message) {
                if ($injector.has('$translate') && useTranslateService) {
                    return $injector.get('$translate')(message);
                } else {
                    return false;
                }
            }

            var publicInterface = {
                // log function that accepts any number of arguments
                // @see http://stackoverflow.com/a/7942355/1738217
                log: function() {
                    if (console.log && logEnabled && arguments.length) {
                        var newarr = [].slice.call(arguments);
                        if (typeof console.log === 'object') {
                            log.apply.call(console.log, console, newarr);
                        } else {
                            console.log.apply(console, newarr);
                        }
                    }
                }
            };

            Object.defineProperty(publicInterface, 'useTranslateService', {
                get: function() {
                    return useTranslateService;
                }
            });

            Object.defineProperty(publicInterface, 'reloadMessage', {
                get: function() {
                    return translateIfAble(reloadMessage) || reloadMessage;
                }
            });

            Object.defineProperty(publicInterface, 'navigateMessage', {
                get: function() {
                    return translateIfAble(navigateMessage) || navigateMessage;
                }
            });

            Object.defineProperty(publicInterface, 'routeEvent', {
                get: function() {
                    return routeEvent;
                }
            });

            Object.defineProperty(publicInterface, 'logEnabled', {
                get: function() {
                    return logEnabled;
                }
            });

            return publicInterface;
        }
    ];
})

.service('unsavedWarningSharedService', function($rootScope, unsavedWarningsConfig, $injector) {

    // Controller scopped variables
    var allForms = [];
    var areAllFormsClean = true;

    // @todo make noop
    var removeFunction = function() {};

    // messages. Change here is you need 
    var messages = {
        navigate: unsavedWarningsConfig.navigateMessage,
        reload: unsavedWarningsConfig.getReloadMessage
    };


    // Checks all forms, if any one is dirty will return true

    function allFormsClean() {
        areAllFormsClean = true;
        angular.forEach(allForms, function(item, idx) {
            unsavedWarningsConfig.log('Form : ' + item.$name + ' dirty : ' + item.$dirty);
            if (item.$dirty) {
                areAllFormsClean = false;
            }
            unsavedWarningsConfig.log("full form", item);
        });
        return areAllFormsClean; // no dirty forms were found
    }

    // pass form controller and adds it to the array
    this.init = function(form) {
        unsavedWarningsConfig.log("adding form", form);
        allForms.push(form);
    };

    this.removeForm = function(form) {
        var idx = allForms.indexOf(form);
        if (-1 !== idx) {
            allForms.splice(idx, 1);
            unsavedWarningsConfig.log("Removing form from watch list", form);
        }
    };

    this.removePrompt = function() {
        allForms = []; // reset forms array
        removeFunction();
        window.onbeforeunload = null;
    };

    // Function called when user tries to close the window
    this.confirmExit = function() {
        // @todo this could be written a lot cleaner! 
        if (!allFormsClean()) {
            return messages.reload;
        } else {
            removeFunction();
            window.onbeforeunload = null;
        }
    };

    // bind to window close
    // @todo investigate new method for listening as discovered in previous tests
    window.onbeforeunload = this.confirmExit;

    var eventToWatchFor = unsavedWarningsConfig.routeEvent;

    // calling this function later will unbind this, acting as $off()
    removeFunction = $rootScope.$on(eventToWatchFor, function(event, next, current) {
        unsavedWarningsConfig.log("user is moving");
        // @todo this could be written a lot cleaner! 
        if (!allFormsClean()) {
            unsavedWarningsConfig.log("form is dirty");
            if (!confirm(messages.navigate)) {
                unsavedWarningsConfig.log("user wants to cancel leaving");
                event.preventDefault(); // user clicks cancel, wants to stay on page 
            } else {
                unsavedWarningsConfig.log("user doesnt care about loosing stuff");
            }
        } else {
            unsavedWarningsConfig.log("form is clean");
        }

    });

})

.directive('unsavedWarningClear', function(unsavedWarningSharedService) {
    return {
        scope: true,
        require: '^form',
        priority: 3000,
        link: function(scope, element, attrs, formCtrl) {

            element.bind('click', function(event) {
                formCtrl.$setPristine();
            });

        }
    };
})

.directive('unsavedWarningForm', function(unsavedWarningSharedService) {
    return {
        require: 'form',
        link: function(scope, formElement, attrs, formCtrl) {

            // register this form
            unsavedWarningSharedService.init(formCtrl);

            // bind to form submit, this makes the typical submit button work
            // in addition to the ability to bind to a seperate button which clears warning
            formElement.bind('submit', function(event) {
                formCtrl.$setPristine();
            });

            // @todo check destroy on clear button too? 
            scope.$on('$destroy', function() {
                unsavedWarningSharedService.removeForm(formCtrl);
            });
        }
    };
});
