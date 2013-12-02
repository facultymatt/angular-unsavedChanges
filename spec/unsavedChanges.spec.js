describe('UnsavedChanges', function() {

    var unsavedDev,
        rootScope,
        formTemplate,
        pageNav,
        clearTemplate,
        scope,
        formInput,
        theForm,
        theButton,
        unsavedDevProviderCache,
        defaultMessageReload,
        $routeProviderCache,
        $rootScope,
        $sniffer,
        $location,
        $route,
        $window,
        $compile,
        $scope;

    beforeEach(module('ngRoute'));
    beforeEach(module('unsavedDev'));

    // cache providers
    // beforeEach(module(function(unsavedDevProvider) {
    //     unsavedDevProviderCache = unsavedDevProvider;
    // }));

    beforeEach(module(function($compileProvider, $routeProvider) {
        
        // cache the provider for access in tests
        $routeProviderCache = $routeProvider;

        // setup test routes
        $routeProviderCache
            .when('/page1', {})
            .when('/page2', {})
            .otherwise({
                redirectTo: '/page1'
            })

        // setup message defaults
        defaultMessageReload = "You will lose unsaved changes if you reload this page";

    }));

    // modules
    beforeEach(inject(function(_$rootScope_, _$compile_, _$sniffer_, _$location_, _$window_, _$route_) {
        
        // grab our injected variables
        $sniffer = _$sniffer_;
        $compile = _$compile_;
        $location = _$location_;
        $window = _$window_;
        $route = _$route_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();

        // helper to simulate value change on form input
        // accepts angular element input
        changeInputValue = function(elm, value) {
            elm.$setViewValue(value);
        };

        // build fake nav to simulate page navigation
        // @note we could do this by broadcasting $locationChangeStart
        // but this will simulate our terminated navigation too
        //
        // @note our page nav will be present across all pages
        // and tests, so we setup here. Our forms in contrast we setup 
        // in test beforeEach tests. 
        pageNav = angular.element('<a id="page1" href="page1">Page1</a>' +
            '<a id="page2" href="page2">Page2</a>');

        $compile(pageNav)(scope);


        // spies!
        // these spies ensure we listen to on before unload and such
        // since we can't spy on these directly
        spyOn($window, 'addEventListener');
        spyOn($window, 'removeEventListener');


        // start all tests from first page
        $location.url('/page1');

        formTemplate = angular.element('<div unsaved-warning-group>' +
                       '<form name="testForm" unsaved-warning-form>' +
                       '<input name="test" type="text" ng-model="test"/>' +
                       '</form>' +
                       '<a unsaved-warning-clear></a>' +
                       '</div>');

        $compile(formTemplate)(scope);  

        // selector for the form, since it's within the group
        theForm = scope.$$childTail.testForm.test; 
        theButton = formTemplate.find('a');

         // change input value
        //changeInputValue(theForm, 'val1');

    }));



    describe('Messaging on unsaved changes', function() {

        // it('acts on forms with attr `unsaved-warning-form`', function() {
        //     console.log(formTemplate);
        // });

        it('detects when a form is dirty', function() {});

        it('messages when navigating away from current url', function() {});

        it('messages when reloading page', function() {

            // reload the page
            $route.reload();
            scope.$digest();

            // if directive works properly, most recently function added
            // with `addEventListener` method, will be the onbeforeunload method
            // which we can verify by checking the returned message
            var msg = $window.addEventListener.mostRecentCall.args[1]({});

            // expect message
            expect(msg).toEqual(defaultMessageReload);

            // simulate click on unsaved clear button
            theButton[0].click();

            // simulate page reload
            // this should throw warning if user 
            // has not yet cleared message
            $route.reload();
            scope.$digest();

            var msg = $window.removeEventListener.mostRecentCall.args[1]({});
            expect(msg).toEqual(defaultMessageReload);
            
        });

        it('messages when going back', function() {
            
            

        });

        it('works when multiple forms are on the same page', function() {});

    });

    describe('Disregarding unsaved changes', function() {

        it('directive acts on element with attr `unsaved-changes-clear`', function() {});

        it('clicking element prevents message on page navigate', function() {});

        it('clicking element prevents message on page reload', function() {

            // reload the page
            $route.reload();
            scope.$digest();

            // if directive works properly, most recently function added
            // with `addEventListener` method, will be the onbeforeunload method
            // which we can verify by checking the returned message
            var msg = $window.addEventListener.mostRecentCall.args[1]({});

            // expect message
            expect(msg).toEqual(defaultMessageReload);

            // -------

            // simulate click on unsaved clear button
            theButton[0].click();

            // simulate page reload
            // this should throw warning if user 
            // has not yet cleared message
            $route.reload();
            scope.$digest();

            var msg = $window.removeEventListener.mostRecentCall.args[1]({});
            expect(msg).toEqual(defaultMessageReload);

        });

        iit('preventing changes is temporary, and message will appear on next dirty form', function() {

            

            changeInputValue(theForm, 'val1');

            // if directive works properly, most recently function added
            // with `addEventListener` method, will be the onbeforeunload method
            // which we can verify by checking the returned message
            var msg = $window.addEventListener.mostRecentCall.args[1]({});

            // expect message
            expect(msg).toEqual(defaultMessageReload);

            // -------

            // simulate click on unsaved clear button
            theButton[0].click();

            // simulate page reload
            // this should throw warning if user 
            // has not yet cleared message
            $location.url('/page2');
            scope.$digest();
            $location.url('/page1');
            scope.$digest();


            console.log(theForm);

            // change input value
            changeInputValue(theForm, 'val12');


            console.log(theForm);

            var msg = $window.removeEventListener.mostRecentCall.args[1]({});
            expect(msg).toEqual(defaultMessageReload);

        });

    });

    describe('Clearing messages on form submit', function() {

        it('prevents message if form is submitted', function() {});

    });

});
