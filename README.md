# Event-Space-JS

Event-space is a topic based, highly name-spaced, open source javascript library for ([publish/subscribe](http://en.wikipedia.org/wiki/Publish/subscribe)) messaging in ([JavaScript](https://developer.mozilla.org/en/JavaScript)).

([Latest release: 0.1.0](https://github.com/namlia/event-space-js/blob/master/event-space.js))

**NOTE:** Event-space has ([$.Callbacks](http://api.jquery.com/category/callbacks-object/)) dependency.
Add [Jquery](http://jquery.com) library before event-space library

## Status

Event-space is used on my start-up project heavily. Features of the current release are enough for my project at the moment.
New release will be pushed when the some of the 1.0 features has been implemented.


## Features

* Small
* Sub namespaces (topics)
* '*' (asterisk) can substitute for everything under one sub topic or the main topic
* No use of DOM for exchanging messages
* Using ([$.Callbacks](http://api.jquery.com/category/callbacks-object/)) power for the moment
* MIT Licensed. You can use event-space commercially without restriction


## Documentation

### Terms

* event name consists of event type and event target. Example: "update:messages.message1.body"
* event type is verb that describes event such as update,delete...
* event target is namespace of event. it can be comprised of sub and main topics. This is optional
* eventnames string is space separated with one or more event name.
* event handler is an function that takes event as an argument.
* '*' (asterisk) can only substitute for one sub topic at the end of the event target.

### Reserved chars

Reserved chars `*`, `**`, `.`, `:` and spaces. you cannot use them in the event type and event target.
Also you cannot use `_` at the start of event type and event target.

### EventSpace(eventnames).sub(handler);

Subscribes eventnames with event handler that is called as soon as event is published.
If event target consists of asterisk, this means subscribe all event names whose event targets are substituted by the asterisk

### EventSpace(eventnames).pub(event);

Publishes events. Calls event handlers of subscribers. If there is no subscriber, you cannot publish events
If event target consists of asterisk, this means publish event to all event names whose event targets are substituted by the asterisk

### EventSpace(eventnames).unsub(handler);

Unsubscribes eventnames with handler. If there is no subscriber, you cannot unsubscribe events
If event target consists of asterisk, this means unsubscribe all event names whose event targets are substituted by the asterisk

###Examples

#### Basic example
```javascript
// our event handler function
var eventHandler = function (event) {
    console.log(event);
};

// subscribe 'oureventtype' with our eventHandler function
EventSpace('oureventtype').sub(eventHandler);

// publish 'oureventtype'
EventSpace('oureventtype').pub('our event published!');

// unsubscribe 'oureventtype'
EventSpace('oureventtype').unsub(eventHandler);
```

#### Hello world!
```javascript
var helloHandler = function (where) {
    console.log('Hello' + where + '!');
};

EventSpace('hello').sub(helloHandler);

EventSpace('hello').pub('world');
EventSpace('hello').pub('browser');
```
### Event target
```javascript
var radioHandler = function (broadcast) {
    console.log('speaker:'+ broadcast);
};

// listen local radio of yourcity
EventSpace('broadcast:yourcountry.yourcity').sub(radioHandler);

// Lets broadcast
EventSpace('broadcast:yourcountry.yourcity').pub('hi');
EventSpace('broadcast:yourcountry.anothercity').pub('another city, another person');
EventSpace('broadcast:yourcountry.yourcity').pub('next song is for you');

// radio of government
EventSpace('broadcast:yourcountry').pub('Our country is beatiful');

// broadcast emergency alert to all cities of your country
EventSpace('broadcast:yourcountry.*').pub('Big tornado is coming to the west');

// broadcast emergency alert to all countries
EventSpace('broadcast:*').pub('Aliens are coming');

// Also listen to all city radios in your country
EventSpace('broadcast:yourcountry.*').sub(radioHandler);

// turn-off the radio
EventSpace('broadcast:yourcountry.*').unsub(radioHandler);
``` 


## 1.0 features


* Use ([Jasmine](http://github.com/pivotal/jasmine)) for ([BDD](http://en.wikipedia.org/wiki/Behavior_Driven_Development))
* Get rid of brute versions of functions for efficiency
* Decouple pub-sub-unsub functions in the library, which makes library one-third size smaller and maintainable
* implement once and off functions of Hi-SockJS here
* Support using '*' not only in the end of the event target
* Support using '**' for all possible sub topics and sub topics of sub topics combinations.
* Support using '*' as an event type
* No dependencies (get rid of $.Callbacks dependency and write specific and lightweight callback list logic for this library)
* AMD / CommonJS module
* No reliance of running in a browser.run everywhere that can execute JavaScript such as server-side

## Developing (Contributing) library

I welcome all of ideas and improvements for this library.
please feel free to fork this project.
Master branch will always contains code from the latest stable version.
Branches that use version as a name contains code from their first release date 
but **versions newer than latest version are going to be development branches** that contain 
candidates for the next stable version. **All changes should be made on the development branch**.

## License

Event-Space-JS is released under the MIT license.
