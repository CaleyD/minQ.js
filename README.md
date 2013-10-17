minQ.js
=========

A tiny DOM library with a familiar API.

=========

# Script inclusion

```html
<!--[if lt IE 8]><script type="text/javascript" src="../qwery.min.js"></script><![endif]-->
<script type="text/javascript" src="../minQ.js"></script>
```

# jQuery is awesome

And it is popular for good reason. However, sometimes just you want a lightweight alternative to allow you to create more succinct DOM code without all of the extra features.

## Encourage scripting behaviors and states, not styles

This library intentionally leaves off the .css() and .animate() methods to encourage developers to do those sorts of things in CSS, not script. Minion contains addClass and removeClass for coordination with CSS instead of setting styles and animations directly in JavaScript.

## Keep it simple

This library does not support custom selectors. It doesn't add a capture phase for event handling in old IE.

## Tested Browsers

This library has a full qunit test suite and has been verified on IE7+, Desktop Safari, Mobile Safari, Firefox, Chrome, and Android Browser 2.3+.

It likely works in all modern browsers.

## querySelectorAll in IE7

This library depends on Dustin Diaz's great qwery library for IE7 DOM query support. It only gets downloaded for IE7 users via conditional comments.

## The API

minQ object construction.
Chaining

.addClass(className : string)
.removeClass(className : string)
.toggleClass(className : string, [apply : boolean])
.hasClass(className : string)

.attr(name : string, value : string)
.attr(name : string)
.val()
.val(value : string)

.closest(selector : string)
.find(selector : string)
.parent()
.parent(selector: string)

.html()
.html(html)
.append(html : string)
.prepend(html : string)

.on(event : string, listener : function(e))
.on(event : string, selector : string, listener : function(e))
