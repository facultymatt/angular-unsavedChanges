angular.module('mm.unsavedChanges', [])

.provider('unsavedWarningsConfig', function(){
    
    var logEnabled = false;

    var useTranslateService = true;

    var routeEvent = '$locationChangeStart';

    var navigateMessage = 'You will lose unsaved changes if you leave this page';

    var reloadMessage = 'You will lose unsaved changes if you reload this page';

    this.enableLogging = function (enableLogging){
        logEnabled = enableLogging;
    };

    this.setRouteEventToWatchFor = function (watchRouteEvent){
        routeEvent = watchRouteEvent;
    };

    this.setNavigateMessage = function(newNavigateMessage){
        navigateMessage = newNavigateMessage;
    };

    this.setReloadMessage = function(newReloadMessage){
        reloadMessage = newReloadMessage;
    };

    this.setUseTranslateService = function(configUseTranslateService){
        useTranslateService = configUseTranslateService;
    };
    
    this.$get = function() {
        return {
            isLoggingEnabled: function(){
                return logEnabled;
            },
            logIfEnabled: function(){
                if(logEnabled){
                    if(arguments.length === 2){
                        console.log(arguments[0],arguments[1]);    
                    }
                    if(arguments.length === 1){
                        console.log(arguments[0]);    
                    }
                }
            },
            getRouteEvent: function(){
                return routeEvent;
            },
            getNavigateMessage: function(){
                return navigateMessage;
            },
            getReloadMessage: function(){
                return reloadMessage;
            },
            getUseTranslateService: function(){
                return useTranslateService;
            }
        };
    };
})

.service('unsavedWarningSharedService', function($rootScope, unsavedWarningsConfig, $injector) {

    // Controller scopped variables
    var allForms = [];
    var areAllFormsClean = true;
    var removeFunction = function() {};

    // messages. Change here is you need 
    var messages = {
        navigate: unsavedWarningsConfig.getNavigateMessage(),
        reload: unsavedWarningsConfig.getReloadMessage()
    };

    function translateIfAble(message){
        if($injector.has('$translate') && unsavedWarningsConfig.getUseTranslateService()){
            return $injector.get('$translate')(message);
        } else {
            return message;
        }
    }

    // Checks all forms, if any one is dirty will return true
    function allFormsClean() {
        areAllFormsClean = true;
        angular.forEach(allForms, function(item, idx) {
            unsavedWarningsConfig.logIfEnabled('Form : ' + item.$name + ' dirty : ' + item.$dirty);
            if (item.$dirty) {
                areAllFormsClean = false;
            }
            unsavedWarningsConfig.logIfEnabled("full form",item);
        });
        return areAllFormsClean; // no dirty forms were found
    }

    // pass form controller and adds it to the array
    this.init = function(form) {
        unsavedWarningsConfig.logIfEnabled("adding form",form);
        allForms.push(form);
    };

    this.removeForm = function(form){
        var idx = allForms.indexOf(form);
        if(-1 !== idx){
            allForms.splice(idx,1);
            unsavedWarningsConfig.logIfEnabled("Removing form from watch list",form);
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
            return translateIfAble(messages.reload);
        } else {
            removeFunction();
            window.onbeforeunload = null;
        }
    };

    // bind to window close
    window.onbeforeunload = this.confirmExit;

    var eventToWatchFor = unsavedWarningsConfig.getRouteEvent();

    // calling this function later will unbind this, acting as $off()
    removeFunction = $rootScope.$on(eventToWatchFor, function(event, next, current) {
        unsavedWarningsConfig.logIfEnabled("user is moving");
        // @todo this could be written a lot cleaner! 
        if (!allFormsClean()) {
            unsavedWarningsConfig.logIfEnabled("form is dirty");
            if (!confirm(translateIfAble(messages.navigate))) {
                unsavedWarningsConfig.logIfEnabled("user wants to cancel leaving");
                event.preventDefault(); // user clicks cancel, wants to stay on page 
            } else {
                unsavedWarningsConfig.logIfEnabled("user doesnt care about loosing stuff");
            }
        } else {
            unsavedWarningsConfig.logIfEnabled("form is clean");
        }

    });

})

.directive('unsavedWarningClear', function(unsavedWarningSharedService) {
    return {
        scope: true,
        priority: 3000,
        link: function(scope, element, attrs) {
            
            element.bind('click', function(event) {
                unsavedWarningSharedService.removePrompt();
            });
        }
    };
})

.directive('unsavedWarningForm', function(unsavedWarningSharedService) {
    return {
        require: 'form',
        link: function(scope, formElement, attrs, ctrl) {

            // controllers will be array in order they were required
            // save them here for ease of use
            var formCtrl = ctrl;

            // initialize
            unsavedWarningSharedService.init(formCtrl);

            // bind to form submit, this makes the typical submit button work
            // in addition to the ability to bind to a seperate button which clears warning
            formElement.bind('submit', function(event) {
                unsavedWarningSharedService.removePrompt();
            });

            scope.$on('$destroy',function(){
                unsavedWarningSharedService.removeForm(formCtrl);
            });
        }
    };
});
