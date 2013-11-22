# mm.unsavedChanges

## See [https://github.com/facultymatt/angular-unsavedChanges/tree/develop](https://github.com/facultymatt/angular-unsavedChanges/tree/develop) for a much improved version.

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

**Handcrafted In Philadelphia**

**License**

The MIT License

Copyright (c) 2013 Matt Miller, Faculty Creative, www.facultycreative.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.