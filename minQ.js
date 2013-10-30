/*globals document, window, qwery */

var minQ = (function(document, randomHelperClassName, tmpDiv, parentNode, undefined, elem, i, index) {
    'use strict';

    function indexOf(array, value) {
        // this is actually lastIndexOf - shouldn't matter for the current callers
        var i = array.length - 1;
        
        while (i >= 0 && array[i] !== value) {
            --i;
        }
        return i;
    }

    // can be called like:
    // minQ('#id')
    // minQ('.selector')leng
    // minQ(element)
    function MinQ(selector) {

        if (typeof selector === 'string') {
            selector = document.querySelectorAll ? document.querySelectorAll(selector) : qwery(selector);
        }

        if (selector.length === undefined) {
            // convert to an array
            selector = [selector];
        }

        // dedupe
        var elements = [];
        for (i = 0; elem = selector[i++];) {
            if (!~indexOf(elements, elem)) {
                elements.push(elem);
            }
        }

        this.get = function(index) {
            return index===undefined ? elements.slice(0) : elements[index];
        };

	this.length = elements.length;
    }

    function updateClassList(fn) {
        return function(self, className) {
            var classes = self.className.split(/\s+/),
                index = indexOf(classes, className);
            fn(classes, index, className);
            self.className = classes.join(' ').replace(/^\s+/g, ''); // join array and remove leading ' '
        };
    }

    function each(callback) {
        return function() {
            index = 0;
            var elems = this.get();
            // apply callback (with called parameters) to each element
            while (elem = elems.shift()) {
                callback.apply(this, [elem].concat([].slice.call(arguments, 0)));
                ++index;
            }

            return this;
        };
    }

    function first(callback) {
        return function() {
            return (elem = this.get(0)) ? callback(elem) : null;
        };
    }

    function getOrSetAttribute(attributName) {
        return function(value) {
            return (value === undefined ?
                first(function(elem) { return elem[attributName]; }) :
                each(function(elem) { elem[attributName] = value; })
            ).call(this);
        };
    }

    function addChildrenToElement(node, markup, prepend) {
        var originalFirstChild = node.firstChild;

        tmpDiv.innerHTML = markup;

        for(i=0; elem = tmpDiv.children[i++];) {
            if (prepend) {
                node.insertBefore(elem, originalFirstChild);
            } else {
                node.appendChild(elem);
            }
        }
    }

    MinQ.prototype = {

	each: each(function(elem, callback) { callback.call(elem, index); }),

        /// classList
        addClass: each(updateClassList(function(classes, index, className) {
            ~index || classes.push(className);
        })),
        removeClass: each(updateClassList(function(classes, index) {
            ~index && classes.splice(index, 1);
        })),
        toggleClass: function(className, apply) {
            return apply !== undefined ?
                this[apply ? 'addClass' : 'removeClass'](className) :
                each(updateClassList(function(classes, index) {
                    ~index ? classes.splice(index, 1) : classes.push(className);
                })).call(this, className);
        },

        // returns true if any matched elements have the specified class
        hasClass: function(className) {
            for(i=0; elem = this.get(i++);) {
               if(~indexOf(elem.className.split(/\s+/), className)) {
                   return true;
               }
            }
            return false;
        },

        /// get/set data on elements
        attr: function(name, value) {
            return (value === undefined ?
                first(function(elem) { return elem.getAttribute(name); }) :
                each(function(elem) { elem.setAttribute(name, value); })
            ).call(this);
        },
        val: getOrSetAttribute('value'),

        /// DOM traversal
        find: function(selector) {
            if (this.get(0) === document) {
                return minQ(selector);
            }
            this.addClass(randomHelperClassName);
            var result = minQ('.' + randomHelperClassName + ' ' + selector);
            this.removeClass(randomHelperClassName);
            return result;
        },
        closest: function(selector) {
            var matches = minQ(selector).get(),
                results = [];

            each(function(elem) {
                do {
                    if (~indexOf(matches, elem)) {
                        results.push(elem);
                        return;
                    }
                } while (elem = elem[parentNode]);
            }).call(this);

            return minQ(results);
        },

        parent: function(selector) {
            var results = [],
                matches = selector ? minQ(selector).get() : null;

            each(function(elem) {
                elem = elem[parentNode];
                if (!matches || ~indexOf(matches, elem)) {
                    results.push(elem);
                }
            }).call(this);

            return minQ(results);
        },

        /// updating markup
        html: getOrSetAttribute('innerHTML'),
        append: each(addChildrenToElement),
        prepend: each(function(elem, markup) {
            addChildrenToElement(elem, markup, true);
        }),
        empty: each(function(elem) {
            minQ(elem.childNodes).remove();
        }),

        remove: each(function(elem) {
            elem[parentNode].removeChild(elem);
        }),

        /// event handling. 
        // This does not make an attempt to polyfill "capture" in old IE. Design your code accordingly.
        // selector is optional
        // capture is optional
        //
        //      minQ().on(event: string, [selector : string], callback: function(e), [capture : boolean])
        on: each(function(elem, event, selectorFilter, callback, capture) {
            if (typeof selectorFilter !== 'string') {
                // fix parameters
                capture = callback;
                callback = selectorFilter;
                selectorFilter = undefined;
            }

            function func(e) {

                // normalize event
                e = e || window.event;
                if (!e.preventDefault) {
                    e.preventDefault = function() {
                        e.returnValue = false;
                    };
                    e.stopPropagation = function() {
                        e.cancelBubble = true;
                    };
                    e.target = e.srcElement;
                }
                if (e.keyCode === undefined) {
                    e.keyCode = e.charCode;
                }

                if ((!selectorFilter || (elem = minQ(e.target).closest(selectorFilter).get(0))) &&
                    callback.call(elem, e) === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
            
            if (elem.addEventListener) { // W3C DOM
                elem.addEventListener(event, func, !!capture);
            } else { // old IE
                elem.attachEvent("on" + event, func);
            }

            return this;
        })
    };

    return function minQ(selector) {
        return new MinQ(selector);
    }
}(document, 'J8oPn7s'/* this should be an obscure string that will never collide with an actual CSS classname */, document.createElement('div'), 'parentNode'));
