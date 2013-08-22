# mm.unsavedChanges

### An AngularJS directive for forms that alerts user of unsaved changes.

This directive will alert users when they navigate away and the form has unsaved changes. It will be triggered in all situations where form data would be lost.

- user clicks a link, 
- user navigates with forward / back button
- user swipes (iOS), 
- user refreshes the page

**How it Works**

The directive binds to `locationChangeStart` which catches all navigation. For page reaload, the directive binds to `window.onbeforeunload`. In both instances, the directive automatically un-binds if the user confirms disregard the changes. 

The directive uses `ngForm.$dirty` to watch for changes to the form. 

**How to Use**

1. Include the JS, for example `<script src="directives/mm.unsavedChanges.js"></script>`. Note you can also just copy the script into your project.
2. Include in your app, for example: `angular.module('app', ['mm.unsavedChanges', 'anotherDirective'])`
3. Add attribute to your form, `unsaved-changes-warning`
4. That's it! 
