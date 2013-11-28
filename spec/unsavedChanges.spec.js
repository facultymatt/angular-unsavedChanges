describe('UnsavedChanges', function() {

    var unsavedDev,
        rootScope,
        formTemplate,
        pageNav,
        clearTemplate,
        scope,
        formInput,
        unsavedDevProviderCache,
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
        $compileProvider.directive('storeModelCtrl', function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attr, ctrl) {
                    control = ctrl;
                }
            };
        });

        $routeProviderCache = $routeProvider;

        $routeProviderCache
                .when('/page1', {
                    //templateUrl: 'page1.html'
                })
                .when('/page2', {
                    //templateUrl: 'page2.html'
                })
                .otherwise({
                    redirectTo: '/page1'
                })


    }));

    // modules
    beforeEach(inject(function(_$rootScope_, _$compile_, _$sniffer_, _$location_, _$window_, _$route_) {
        $rootScope = _$rootScope_;
        $sniffer = _$sniffer_;
        $compile = _$compile_;
        $location = _$location_;
        $window = _$window_;
        $route = _$route_;
        scope = $rootScope.$new();

        changeInputValue = function(elm, value) {
            elm.$setViewValue(value);
        }; 

        // build fake nav to simulate page navigation
        // @note we could do this by broadcasting $locationChangeStart
        // but this will simulate our terminated navigation too
        pageNav = angular.element('<a id="page1" href="page1">Page1</a>' + 
                                  '<a id="page2" href="page2">Page2</a>');

        $compile(formTemplate)($rootScope);


    }));



    describe('Messaging on unsaved changes', function() {

        beforeEach(inject(function() {

            spyOn($window, 'addEventListener');
            spyOn($window, 'removeEventListener');

            $location.url('/page1');

            scope.test = '';

            var template = '<div unsaved-warning-group>' +
                           '<form name="testForm" unsaved-warning-form>' +
                           '<input name="test" type="text" ng-model="test"/>' +
                           '</form>' +
                           '<a unsaved-warning-clear></a>' +
                           '</div>';

            formTemplate = angular.element(template);
            $compile(formTemplate)(scope);   
            

        }))

        it('acts on forms with attr `unsaved-warning-form`', function() {});

        it('detects when a form is dirty', function() {});

        it('messages when navigating away from current url', function() {});

        it('messages when reloading page', function() {});

        iit('messages when going back', function() {
            
            

            var theForm = scope.$$childTail.testForm.test;
            changeInputValue(theForm, 'val1');

            $route.reload();

            scope.$digest();

            console.log('Most recent call args:', $window.addEventListener.mostRecentCall.args);
            var msg = $window.addEventListener.mostRecentCall.args[1]({});

            expect(msg).toEqual("You will lose unsaved changes if you reload this page");

            var button = formTemplate.find('a');
            

            console.log(button);

            button[0].click(); 

            $route.reload();
            scope.$digest();

            var msg = $window.removeEventListener.mostRecentCall.args[1]({});
            expect(msg).toEqual("You will lose unsaved changes if you reload this page");


            // spyOn($window, 'confirm');

            // // // @note this will not need childTail when we remove 
            // // // the group directive
            // 

            // console.log(theForm.className)

            // changeInputValue(theForm, 'val1');

            // // //ensure our input it set
            // //expect(formTemplate.find('form')[0].className).toContain('ng-dirty');

            // //$route.reload();

            // expect($window.confirm).toHaveBeenCalled();

        });

        it('works when multiple forms are on the same page', function() {});

    });

    describe('Disregarding unsaved changes', function() {

        it('acts on element with attr `unsaved-changes-clear`', function() {});

        it('prevents message on page navigate', function() {});

        it('prevents message on page reload', function() {});

        it('preventing changes is temporary, and message will appear on next dirty form', function() {});

    });

    describe('Clearing messages on form submit', function() {

        it('prevents message if form is submitted', function() {});

    });

});
