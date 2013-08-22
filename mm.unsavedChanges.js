/**
 * Module that will prompt user when they try to nagivate away from page with unsaved data
 * Will prompt user to discard changed, or stay on page
 *
 * Provides a method to call which will remove the listener, ie: on save button clicked
 *
 * @todo make it auto save when user clicks "Save"
 * @note the init() method must be called after view did load, so that forms are defined
 *
 */
angular.module('mm.unsavedChanges', []);

angular.module('mm.unsavedChanges')
    .factory('saveChangesPrompt', ['$rootScope',
        function($rootScope) {

            // messages. Change here is you need 
            var messages = {
                navigate: "You will loose unsaved changes if you leave this page",
                reload: "You will loose unsaved changes if you reload this page"
            };

            // empty return function
            // defined here because in some instances we call this
            // as a callback when it may not be defined, so defining here prevents the 
            // need for `typeof` checks later on
            //
            var removeFunction = function() {};

            // check if form is dirty
            var isFormDirty = function(form) {
                var d = (form.$dirty) ? true : false;
                console.log('ARE FORMS DIRTY? ' + d);
                return d;
            };

            return {
                init: function(form) {

                    // @todo optimse this, because this code is duplicated. 
                    function confirmExit() {

                        console.log('REFRESH / CLOSE detected');

                        // @todo this could be written a lot cleaner! 
                        if (isFormDirty(form)) {
                            return messages.reload;
                        } else {
                            removeFunction();
                            window.onbeforeunload = null;
                        }
                    }

                    // bind our reload check to the window unload event
                    // which is called when a user tries to close a tab, click back button, swipe back (iOS) or refresh the page
                    window.onbeforeunload = confirmExit;

                    // calling this function later will unbind this, acting as $off()
                    removeFunction = $rootScope.$on('$locationChangeStart', function(event, next, current) {

                        console.log('ROUTE CHANGE detected');

                        // @todo this could be written a lot cleaner! 
                        if (isFormDirty(form)) {
                            if (!confirm(messages.navigate)) {
                                event.preventDefault(); // user clicks cancel, wants to stay on page 
                            } else {
                                removeFunction(); // unbind our `locationChangeStart` listener
                                window.onbeforeunload = null; // clear our the `refresh page` listener
                            }
                        } else {
                            removeFunction(); // unbind our `locationChangeStart` listener
                            window.onbeforeunload = null; // clear our the `refresh page` listener
                        }

                    });
                },

                // @todo need to support this somehow within the directive
                removeListener: function() {
                    console.log('CHOOSING TO REMOVE THIS FUNCTION');
                    removeFunction();
                    window.onbeforeunload = null;
                }
            };
        }
    ]);


// this is our module, 'unsavedChanges'
// this pattern allows us to create many directives, services, factories, etc. 
// that all work together to create our modules functionality. 
//
// This is a great pattern for creating more advanced directives For example, directives that rely on a controller. 
// Rather then redefining the controller in each simple directive instance (as without the module pattern)
// we define the controller once time, as a service, and inject it into each directive
// saving a lot of overhead. 
//    
angular.module('mm.unsavedChanges')
    .directive('unsavedChangesWarning', ['saveChangesPrompt', '$parse',
        function(saveChangesPrompt, $parse) {
            return {
                require: 'form', // we must require form to get access to formController
                link: function(scope, formElement, attrs, formController) {

                    console.log('FORM : Linker called'); // debug
                    console.log(formController);


                    // Here we pass in the formController
                    // Note its critical to pass the controller, and not the form elem itself
                    //     this is because the form elem doesn't contain the logic of $dirty, $valid, etc. 
                    //     this logic is handled by the controller. 
                    //     When using the form in a controller, you can access $scope.formName.$dirty
                    //     because you are accessing the formController by default
                    //
                    saveChangesPrompt.init(formController);


                    // this allows for a custom event on submit
                    //
                    // @todo test! 
                    //
                    // $parse creates a function from an expression
                    //     so even no `rcSubmit` attr will return a function
                    //     which prevents our call below from breaking
                    //
                    // @todo can we use this above, in our service? 
                    //
                    var fn = $parse(attrs.rcSubmit);


                    // intercept the form submit functionality
                    // and unbind our listener...
                    //
                    // @todo unbind when using non-traditional submit... ie: custom save function
                    //
                    // @todo unbind throw error if user changes location, but the `.removeListener()` has not been called
                    //       this will ensure developers follow protocal with their custom save functions
                    // 
                    formElement.bind('submit', function(event) {

                        // if form is not valid cancel it.
                        // 
                        // @note we dont need to check for this, since this is handled by validation???
                        //       if (!formController.$valid) return false;
                        //    
                        saveChangesPrompt.removeListener();

                        // apply our custom submit function, if any                
                        scope.$apply(function() {
                            console.log('FANCY SUBMIT');
                            fn(scope, {
                                $event: event
                            });
                        });
                    });
                }
            };
        }
    ]);
