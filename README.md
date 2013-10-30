minQ.js
=========

A tiny DOM library with a familiar API.

=========

# Script inclusion

```html
<!--[if lt IE 8]><script type="text/javascript" src="qwery.min.js"></script><![endif]-->
<script type="text/javascript" src="minQ.js"></script>
```

## jQuery is awesome

And it is popular for good reason. However, sometimes you just want a lightweight alternative to allow you to create more succinct DOM code without all of the extra features.

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

.length : number

.each(callback: function(index, elem)) : minQ

### CSS Classes

.addClass(className : string) : minQ

.removeClass(className : string) : minQ

.toggleClass(className : string, [apply : boolean]) : minQ

.hasClass(className : string) : boolean

### Attributes and Input Values

.attr(name : string, value : string) : minQ

.attr(name : string) : string

.val() : string

.val(value : string) : minQ

### Accessing native objects

.get() : [HTMLNode]

.get(index: number) : HTMLNode

### Traversing

.closest(selector : string) : minQ

.find(selector : string) : minQ

.parent() : minQ

.parent(selector: string) : minQ

### DOM elements manipulation

.html() : string

.html(html) : minQ 

.append(html : string) : minQ

.prepend(html : string) : minQ

.empty() : minQ

.remove(element : HTMLNode) : minQ

### Eventing

.on(event : string, listener : function(e)) : minQ

.on(event : string, selector : string, listener : function(e)) : minQ

