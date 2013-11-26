# Development Version!

## Supports these cool new features: 

- Warning when user has unsaved changes and attempts to navigate away or reload the page.
- Disregarding changes by clicking a button
- Multiple forms on single page (prior versions has issues with this)

## API 
Provides two directives for use. 

`unsaved-warning-form` Add to forms you want to register with directive. 

`unsaved-warning-clear` Add to button or link that will disregard changes, preventing the messaging when user tries to navigate. 

## Gotchas / Known Bugs

*** Known issue: sometimes the form is removed from expected scope. Ie: in your controller `$scope.formName` no longer works. You might need to access `$scope.$$childTail.formName`.

## Demo / Dev

To try the demo run `npm install` && `bower install` && `grunt connect`. Then navigate to [http://127.0.0.1:9001/demo](http://127.0.0.1:9001/demo).