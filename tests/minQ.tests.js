/*jslint es5:true, plusplus:true */
/*globals document, module, test, ok, equal, strictEqual, deepEqual, minQ*/
(function (document, module, test, ok, equal, $) {
    'use strict';

    function givenMarkup(markup) {
        document.getElementById('qunit-fixture').innerHTML = markup;
    }
    
    function thenFalse(actual, message) {
        equal(actual, false, message);
    }
    function thenTrue(actual, message) {
        equal(actual, true, message);
    }
    
    function byId(id) {
        return document.getElementById(id);
    }
    
    function fireEvent(target, eventType) {
        if (document.createEvent) {
            var event = document.createEvent('Event');
            event.initEvent(eventType, true, true);
            target.dispatchEvent(event);
        } else {
            target.fireEvent('on' + eventType);
        }
    }
    
    function normalizeMarkup(markup) {
        return markup.replace(/(\r\n|\n|\r| )/gm, '').toLowerCase();
    }
    
    module('minQ() construction');
    
    test('Should construct from single node object', function () {
        givenMarkup('<div id="myElem"></div>');
        
        var d = $(byId('myElem'));
        
        deepEqual(d.get(), [byId('myElem')]);
    });
    
    test('Should construct from single id selector', function () {
        givenMarkup('<div id="item"></div>');
        
        var d = $('#item');
        
        deepEqual(d.get(), [byId('item')]);
    });
    
    test('Should construct from selector returning multiple elements', function () {
        givenMarkup('<div id="item"></div><div id="other"/>');
        
        var d = $('#item, #other');
        
        deepEqual(d.get(), [byId('item'), byId('other')]);
    });
    
    test('Should remove duplicates from element array', function () {
        givenMarkup('<div id="item"></div><div id="other"/>');

        var d = $([byId('item'), byId('item'), byId('item'), byId('other'), byId('other')]);

        deepEqual(d.get(), [byId('item'), byId('other')]);
    });

    module('minQ().length');

    test('Should count matched elements', function () {

        givenMarkup(
            '<div id="item" class="test"/>' +
                '<div id="other"/>' +
                '<div class="test"/>' +
                '<div class="test"/>'
        );

        equal(1, $('#item').length);
        equal(2, $('#item, #other').length);
        equal(3, $('.test').length);
        equal(0, $('.noMatch').length);
    });

    module('minQ().get(index: number)');

    test('Should return element at index', function () {
        givenMarkup(
            '    <div id="item1" class="items"/>' +
                '<div id="item2" class="items"/>' +
                '<div id="item3" class="items"/>' +
                '<div id="item4" class="items"/>'
        );

        equal(document.getElementById('item1'), $('.items').get(0));
        equal(document.getElementById('item4'), $('.items').get(3));
    });

    test('Should return undefined if index out of range of element count', function () {
        givenMarkup(
            '    <div id="item1" class="items"/>' +
                '<div id="item2" class="items"/>'
        );

        strictEqual(undefined, $('.items').get(2));
    });

    module('minQ().each(callback : function(index:number, elem : node))');

    test('Should execute callback once for each matched element', function () {
        givenMarkup(
            '    <div id="item1" class="items"/>' +
                '<div id="item2" class="items"/>' +
                '<div id="item3" class="items"/>' +
                '<div id="item4" class="items"/>'
        );

        var callCount = 0;

        $('.items').each(function () { callCount++; });

        equal(4, callCount);
    });

    test('Should execute callback with the matched element as the "this" context', function () {
        givenMarkup(
            '    <div id="item1" class="items"/>' +
                '<div id="item2" class="items"/>'
        );

        var callCount = 0;

        $('.items').each(function () { this.setAttribute('attr', 'value'); });

        equal('value', document.getElementById('item1').getAttribute('attr'));
        equal('value', document.getElementById('item2').getAttribute('attr'));
    });

    test('Should should allow minQ functions inside callback using "this" context', function () {
        givenMarkup(
            '    <div id="item1" class="items"/>' +
                '<div id="item2" class="items"/>'
        );

        var callCount = 0;

        $('.items').each(function () { minQ(this).attr('attr', 'value'); });

        equal('value', document.getElementById('item1').getAttribute('attr'), 'item1 attribute value matches test attribute value');
        equal('value', document.getElementById('item2').getAttribute('attr'), 'item2 attribute value matches test attribute value');
    });

    test('Should pass item index in matched set as first parameter in callback', function () {
        givenMarkup(
            '    <div id="item1" class="items"/>' +
                '<div id="item2" class="items"/>' +
                '<div id="item3" class="items"/>'
        );

        var callCount = 0;

        $('.items').each(function (index) {
            if (index !== 1) {
                this.setAttribute('attr', 'value');
            }
        });

        equal('value', document.getElementById('item1').getAttribute('attr'));
        equal(undefined, document.getElementById('item2').getAttribute('attr'));
        equal('value', document.getElementById('item3').getAttribute('attr'));
    });

    module('minQ().addClass(className : string)');
    
    test('minQ().addClass should add a class to classless element', function () {
        givenMarkup('<div id="myElem"></div>');
        
        $('#myElem').addClass('class1');
        
        equal('class1', byId('myElem').className);
    });
        
    test('Should append a class name to a dom element when a class already exists', function () {
        givenMarkup('<div id="me" class="anotherClass"></div>');
        $('#me').addClass('someClass');
        equal('anotherClass someClass', byId('me').className);
    });
        
    test('Should not duplicate class name in class list when adding an existing class', function () {
        givenMarkup('<div id="me" class="someClass anotherClass"></div>');
        $('#me').addClass('someClass');
        equal('someClass anotherClass', byId('me').className);
    });
    

    module('minQ().removeClass(className : string)');
    test('Should remove class name from dom element with only one class', function () {
        givenMarkup('<div id="me" class="someClass"></div>');
        $('#me').removeClass('someClass');
        equal('', byId('me').className);
    });
    test('Should only remove the specified class from dom element with multiple classes', function () {
        givenMarkup('<div id="me" class="someClass someOtherClass"></div>');
        $('#me').removeClass('someClass');
        equal('someOtherClass', byId('me').className);
    });

   
    module('minQ().toggleClass(className : string, [apply : boolean])');
    test('Should add class name to dom element', function () {
        givenMarkup('<div id="me"></div>');
        $('#me').toggleClass('someClass');
        equal(byId('me').className, 'someClass');
    });
    test('Should remove class name from dom element', function () {
        givenMarkup('<div id="me" class="someClass"></div>');
        $('#me').toggleClass('someClass');
        equal(byId('me').className, '');
    });
    test('Should only remove the specified class from dom element with multiple classes', function () {
        givenMarkup('<div id="me" class="someClass someOtherClass"></div>');
        
        $('#me').toggleClass('someClass');
        
        equal(byId('me').className, 'someOtherClass');
    });
    test('Should remove class name from dom element when second parameter (assign) is false', function () {
        givenMarkup('<div id="me" class="someClass"></div>');
        $('#me').toggleClass('someClass', false);
        $('#me').toggleClass('otherClass', false);
        
        equal(byId('me').className, '');
    });
    test('Should add class to dom element when second parameter (assign) is true', function () {
        givenMarkup('<div id="me" class="someClass"></div>');
        $('#me').toggleClass('someClass', true);
        $('#me').toggleClass('otherClass', true);
        equal(byId('me').className, 'someClass otherClass');
    });
    
    
    module('minQ().hasClass(className : string)');
    test('Should return false if the element does not have the class tested for', function () {
        givenMarkup('<div id="me" class="someClass"/> <div id="me2" class="someClass someOtherClass"/>');
        
        thenFalse($('#me').hasClass('nope'));
        thenFalse($('#me2').hasClass('neither'));
    });
    test('Should return true if the element has the class tested for', function () {
        givenMarkup('<div id="me" class="someClass"/> <div id="me2" class="someClass someOtherClass"/>');
                
        thenTrue($('#me').hasClass('someClass'));
        thenTrue($('#me2').hasClass('someClass'));
    });
    
    test('Should return false if the element classname is only a partial match of an actual class name on the element', function () {
        givenMarkup('<div id="me" class="partialClass"></div>');
        
        thenFalse($('#me').hasClass('partial'));
    });
    
    test('Should return true if any of the matched elements have the class', function () {
        givenMarkup(
            '\
            <div id="me"></div> \
            <div id="me2"></div> \
            <div id="me3" class="testClass"></div>'
        );
        
        thenTrue($('#me,#me2,#me3').hasClass('testClass'));
    });
    
    test('Should handle SVG className property', function () {
        givenMarkup(
            '\
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1"> \
                <circle cx="100" cy="50" r="40" id="myFirstCircle" class="testClass"/> \
                <circle cx="100" cy="50" r="40" id="mySecondCircle" /> \
            </svg>'
        );
        
        thenTrue($('#myFirstCircle').hasClass('testClass'));
        thenFalse($('#mySecondCircle').hasClass('testClass'));
    });

    module('minQ().attr(name : string)');
    
    test('Should return attribute value from first matched element', function () {
        givenMarkup(
            '\
            <div id="t1" class="test" data-attr-test="first!"></div> \
            <div id="t2" class="test" data-attr-test="second :("></div>'
        );
        
        equal($('.test').attr('data-attr-test'), 'first!');
    });
    
    module('minQ().attr(name : string, value : string)');
    
    test('Should set attribute value for all matched elements', function () {
        givenMarkup(
            '\
            <div id="t1" class="test"></div> \
            <div id="t2" class="test"></div>'
        );
        
        $('.test').attr('data-attr', 'testValue');

        equal(byId('t1').getAttribute('data-attr'), 'testValue');
        equal(byId('t2').getAttribute('data-attr'), 'testValue');
    });
    
    module('minQ().val()');
    
    test('Should return value from first matched element', function () {
        givenMarkup(
            ' \
            <input id="t1" class="test" value="first!" type="text"> \
            <input id="t2" class="test" value="second :(" type="text">'
        );
        
        equal($('.test').val(), 'first!');
    });
    
    module('minQ().val(value : string)');
    
    test('Should set input value for all matched elements', function () {
        givenMarkup(
            ' \
            <input id="t1" class="test" type="text"> \
            <input id="t2" class="test" type="text">'
        );
        
        $('.test').val('1234');

        equal(byId('t1').value, '1234');
        equal(byId('t2').value, '1234');
    });
    
    // DOM manipulation
    
    module('minQ().html()');
    
    test('Should return markup from first matched element', function () {
        givenMarkup('<div id="t1" class="html">first</div> <div id="t2" class="html">second</div>');
        equal($('.html').html(), 'first');
    });
    
    test('Should return null if no matched elements', function () {
        givenMarkup('<div id="t1" class="html"/>');
        equal($('.unknown').html(), null);
    });
    
    module('minQ().html(html)');
    
    test('Should set innerHTML of all matched elements', function () {
        givenMarkup('<div id="t1" class="html"></div> <div id="t2" class="html"></div>');
        
        $('.html').html('hypertext markup language');
        
        equal(byId('t1').innerHTML, 'hypertext markup language');
        equal(byId('t2').innerHTML, 'hypertext markup language');
    });
    
    module('minQ().append(html : string)');

    test('Should add markup to end of matched elements', function () {
        givenMarkup(
            '\
            <div id="t1" class="html">test1</div> \
            <div id="t2" class="html">test2</div>'
        );

        $('.html').append('<a>link</a>');

        equal(byId('t1').innerHTML.toLowerCase(), 'test1<a>link</a>');
        equal(byId('t2').innerHTML.toLowerCase(), 'test2<a>link</a>');
    });

    test('Should not destroy and recreate via innerHTML so events and references to existing markup remain intact', function () {
        givenMarkup(
            '\
            <div id="t1" class="html"> \
                <a id="handle"></a> \
            </div>'
        );
        
        var childElement = $('#handle');
        $('.html').append('<a>link</a>');
        childElement.html('it worked!');

        equal(byId('handle').innerHTML, 'it worked!');
    });
    
    // tbody special case because innerHTML poses problems in IE 
    // and tr, td, tbody elements cant just be nested in DIV to convert to HTML nodes.
    test('Should append row to tbody', function () {
        givenMarkup(
            '   <table id="t1"> \
                    <tr><td>1</td></tr> \
                    <tr><td>2</td></tr> \
                </table>'
        );

        $('#t1 tbody').append('<tr><td>3</td></tr>');

        equal(normalizeMarkup($("#t1 tbody").html()),
              normalizeMarkup(
                ' <tr><td>1</td></tr> \
                  <tr><td>2</td></tr> \
                  <tr><td>3</td></tr>'
            )
            );
    });
    
    module('minQ().prepend(html : string)');

    test('Should add markup to beginning of matched elements', function () {
        givenMarkup(
            '\
            <div id="t1" class="html">test1</div> \
            <div id="t2" class="html">test2</div>'
        );

        $('.html').prepend('<a>link</a>');

        equal(byId('t1').innerHTML.toLowerCase(), '<a>link</a>test1');
        equal(byId('t2').innerHTML.toLowerCase(), '<a>link</a>test2');
    });

    test('Should not destroy and recreate via innerHTML so events and references to existing markup remain intact', function () {
        givenMarkup(
            '   <div id="t1" class="html"> \
                    <a id="handle"></a> \
                </div>'
        );

        var childElement = $('#handle');
        $('.html').prepend('<a>link</a>');
        childElement.html('it worked!');

        equal(byId('handle').innerHTML, 'it worked!');
    });
    
    module('minQ().empty()');

    test('Should remove all child elements', function () {
        givenMarkup(
            '   <div id="t1"> \
                    1 \
                    <a>2</a> \
                    <a>3</a> \
                    4 \
                </div>'
        );

        $('#t1').empty();

        equal('', document.getElementById('t1').innerHTML);
    });

    test('Should remove all child elements from table (innerHTML read only on some elements in IE)', function () {
        givenMarkup(
            '   <table id="t1"> \
                    <tr><td>1</td></tr> \
                    <tbody><tr><td>2</td></tr></tbody> \
                    <tfoot><tr><td>3</td></tr></tfoot> \
                </table>'
        );

        $('#t1').empty();

        equal('', document.getElementById('t1').innerHTML);
    });

    /// DOM Traversal
    
    module('minQ().find(selector : string)');
    
    test('Should evaluate selector with document as root of search', function () {
        givenMarkup(
            '   <ul id="parent"> \
                    <li id="li1"> \
                        <ul> \
                            <li id="li1-1"> \
                        </ul> \
                    </li> \
                    <li id="li2"> \
                </ul> \
                <ul id="sibling"> \
                    <li id="sibling-li1"> \
                        <ul> \
                            <li id="sibling-li1-1"> \
                        </ul> \
                    </li> \
                    <li id="sibling-li2"> \
                </ul>'
        );

        deepEqual($(document).find('ul ul li').get(), [byId('li1-1'), byId('sibling-li1-1')]);
    });

    test('Should evaluate selector with matches as root of search', function () {
        givenMarkup(
            '\
            <ul id="parent"> \
                <li id="li1"> \
                    <ul> \
                        <li id="li1-1"> \
                    </ul> \
                </li> \
                <li id="li2"> \
            </ul> \
            <ul id="sibling"> \
                <li id="sibling-li1"> \
                    <ul> \
                        <li id="sibling-li1-1"> \
                    </ul> \
                </li> \
                <li id="sibling-li2"> \
            </ul>'
        );

        deepEqual($('#parent').find('ul li').get(), [byId('li1-1')]);
    });

    test('Should evaluate selector against all matched elements', function () {
        givenMarkup(
            '\
            <ul id="parent" class="ul"> \
                <li id="li1"> \
                    <ul> \
                        <li id="li1-1"> \
                    </ul> \
                </li> \
                <li id="li2"> \
            </ul> \
            <ul id="sibling" class="ul"> \
                <li id="sibling-li1"> \
                    <ul> \
                        <li id="sibling-li1-1"> \
                    </ul> \
                </li> \
            </ul>'
        );

        deepEqual($('.ul').find('ul li').get(), [byId('li1-1'), byId('sibling-li1-1')]);
    });

    test('Should return empty set for unmatched selector', function () {
        givenMarkup(
            '\
            <ul id="parent" class="ul"> \
                <li id="li1"> \
                    <ul> \
                        <li id="li1-1"> \
                    </ul> \
                </li> \
                <li id="li2"> \
            </ul> \
            <ul id="sibling" class="ul"> \
                <li id="sibling-li1"> \
                    <ul> \
                        <li id="sibling-li1-1"> \
                    </ul> \
                </li> \
            </ul>'
        );

        deepEqual($('.ul').find('ul li a').get(), []);
    });

    module('minQ().parent()');
    
    test('Should return immediate parent element', function () {
        givenMarkup(
            ' \
            <div id="grandparent"> \
               <a id="parent"> \
                   <span id="child"/> \
               </a> \
            </div>'
        );
        
        deepEqual($('#child').parent().get(), [byId('parent')]);
        deepEqual($('#parent').parent().get(), [byId('grandparent')]);
    });
    
    test('Should return immediate parent element for each matched element', function () {
        givenMarkup(
            '\
            <div id="item1"> \
               <span id="item1-child" class="child"/> \
            </div> \
            <div id="item2"> \
               <span id="item2-child" class="child"/> \
            </div> \
            <div id="other"/>'
        );
        
        deepEqual($('.child').parent().get(), [byId('item1'), byId('item2')]);
    });
    
    module('minQ().parent(selector: string)');
    
    test('Should filter out parents that do not match the supplied selector', function () {
        
        givenMarkup(
            '\
            <div id="item1"> \
               <span id="item1-child" class="child"/> \
            </div> \
            <div id="item2" class="match"> \
               <span id="item2-child" class="child"/> \
            </div> \
            <div id="item3" class="anotherMatch"> \
               <span id="item2-child" class="child"/> \
            </div>'
        );
        
        deepEqual($('.child').parent('.match, .anotherMatch').get(), [byId('item2'), byId('item3')]);
    });
    
    module('minQ().closest(selector : string)');
    
    test('Should not return any elements if no ancestors match selector', function () {
        givenMarkup(
            '\
            <ul id="parent" class="ul"> \
                <li id="li1"> \
                    <ul> \
                        <li id="li1-1"> \
                    </ul> \
                </li> \
                <li id="li2"> \
            </ul>'
        );

        deepEqual($('#li1-1').closest('menu').get(), []);
    });
    
    test('Should return only current matched element if it matches the selector and a parent matches the selector', function () {
        givenMarkup(
            '\
            <ul id="parent" class="ul"> \
                <li id="li1"> \
                    <ul> \
                        <li id="li1-1"> \
                    </ul> \
                </li> \
                <li id="li2"> \
            </ul>'
        );

        deepEqual($('#li1-1').closest('li').get(), [byId('li1-1')]);
    });

    test('Should walk up DOM tree to find closest parent that matches the selector', function () {
        givenMarkup(
            '\
            <ul id="parent" class="match"> \
                <li id="li1" class="match"> \
                    <ul> \
                        <li id="li1-1"> \
                    </ul> \
                </li> \
                <li id="li2" class="match"> \
            </ul>'
        );

        deepEqual($('#li1-1').closest('.match').get(), [byId('li1')]);
    });
    
    test('Should evaluate selector for each selected element', function () {
        givenMarkup(
            '\
            <ul id="parent" class="match"> \
                <li id="li1" class="match"> \
                    <ul> \
                        <li id="li1-1"> \
                    </ul> \
                </li> \
                <li id="li2" class="match"> \
            </ul>'
        );

        deepEqual($('#li1-1, #li2').closest('.match').get(), [byId('li1'), byId('li2')]);
    });

    /// DOM Eventing
    module('minQ().on(event : string, listener : function(e))');
    
    test('Should execute callback when event triggered', function () {
        givenMarkup('<button id="btn"></button>');
        
        var callbackCalled = false;
        
        $('#btn').on('click', function () { callbackCalled = true; });
        
        fireEvent(byId('btn'), 'click');
       
        ok(callbackCalled, 'called callback');
    });
    
    test('Should stop propagation when event callback returns false', function () {
        givenMarkup(
            '\
            <div id="parent"> \
                <button id="btn"></button> \
            </div>'
        );
        
        var callbackCalled = false;
        
        $('#btn').on('click', function () { return false; });
        $('#parent').on('click', function () { callbackCalled = true; });
                
        fireEvent(byId('btn'), 'click');
       
        thenFalse(callbackCalled, 'event should not be propagated');
    });
        
    test('should stop propagation when e.stopPropagation() is called', function () {
        givenMarkup(
            '\
            <div id="parent"> \
                <button id="btn"></button> \
            </div>'
        );
        
        var callbackCalled = false;
        
        $('#btn').on('click', function (e) { e.stopPropagation(); });
        $('#parent').on('click', function () { callbackCalled = true; });
        
        fireEvent(byId('btn'), 'click');
       
        thenFalse(callbackCalled, 'event should not be propagated');
    });
    
    module('minQ().on(event : string, selector : string, listener : function(e))');
    
    test('Should only execute callback if target or parents match given selector', function () {
        givenMarkup(
            '\
            <div id="parent"> \
                <button id="btn"> \
                    <span id="nested"/> \
                </button> \
                <a id="noMatch"></a> \
            </div>'
        );
        
        var callbackCalled = false;
        
        $('#parent').on('click', 'button', function () { callbackCalled = true; });
                
        fireEvent(byId('nested'), 'click');
        thenTrue(callbackCalled);
        
        callbackCalled = false;
        fireEvent(byId('btn'), 'click');
        thenTrue(callbackCalled);
        
        callbackCalled = false;
        fireEvent(byId('noMatch'), 'click');
        thenFalse(callbackCalled);
        
        callbackCalled = false;
        fireEvent(byId('parent'), 'click');
        thenFalse(callbackCalled);
    });
    
    test('Should call callback with this context as closest element to target that matches the selector', function () {
        givenMarkup(
            '\
            <div id="parent"> \
                <button id="btn"> \
                    <span id="nested"/> \
                </button> \
            </div>'
        );
        
        var thisContext = null;
        
        $('#parent').on('click', 'button', function () { thisContext = this; });
                
        fireEvent(byId('nested'), 'click');
        equal(thisContext, byId('btn'));
        
        thisContext = null;
        fireEvent(byId('btn'), 'click');
        equal(thisContext, byId('btn'));
    });
    
}(document, module, test, ok, equal, minQ));
