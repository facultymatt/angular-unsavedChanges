# An AngularJS directive for forms that alerts user of unsaved changes.

`bower install angular-unsavedChanges`
 
_Dev Note: This module is still in development. However it's used in many of my production projects so it can be considered stable and battle tested._

This directive will alert users when they navigate away and a form has unsaved changes. It will be triggered in all situations where form data would be lost.

- user clicks a link,
- user navigates with forward / back button
- user swipes (iOS),
- user refreshes the page

In addition this module: 

- Works with multiple forms on the same page
- Provides a button to disregard unsaved changes
- Works with Angular Translate module
- Has configurable reload and navigate messages
- Works with Angular uiRouter's state change event.

## How it Works

The directive binds to locationChangeStart which catches all navigation. For page reloads, the directive binds to window.onbeforeunload. The module defers to the forms `$dirty` property as a single source of truth. Disregarding changes sets ngForm dirty to false. 

## Basic Usage

- Install from bower using `$ bower install angular-unsavedChanges --save`.
- Include the JS, for example `<script src="bower_components/angular-unsavedChanges/dist/unsavedChanges.js"></script>`.
- Include in your app, for example: `angular.module('app', ['unsavedChanges', 'anotherDirective'])`
- Add attribute to your form, `unsaved-changes-warning`
- That's it!


## API

### Directives 
Provides two directives for use. 

`unsaved-warning-form` 
Add to forms you want to register with directive. 

`unsaved-warning-clear` 
Add to button or link that will disregard changes, preventing the messaging when user tries to navigate. 

### Configuration 
A number of options can be configured. See the unit test for examples of how to implement. 


## Gotchas / Known Bugs

*** Known issue: sometimes the form is removed from expected scope. Ie: in your controller `$scope.formName` no longer works. You might need to access `$scope.$$childTail.formName`. This will be fixed in furture versions.


## Demo / Dev

To try the demo run `npm install` && `bower install` && `grunt connect`. The browser should open [http://127.0.0.1:9001/demo](http://127.0.0.1:9001/demo).


## Test

__End 2 End Testing__
Because of the alert / event driven nature of this module it made the most sense to rely on e2e tests. (also its hard to interact with alerts via unit tests).

To run the e2e tests do the following: 

- Install Protractor as per directions here: [https://github.com/angular/protractor](https://github.com/angular/protractor)
- Start selenium server: `webdriver-manager start` (or use other selenium methods as per Protractor documentation.)
- Run `$ grunt test:e2e`


__Unit Tests__

- Run `$ grunt test:unit` OR `$ grunt test`


## Build

Run `$ grunt` to lint and minify the code. Also strips console logs. 
