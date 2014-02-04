// <BISMILLAHIRRAHMANIRRAHIM>

var EventSpace = (function($, undefined){

/*

 I want to use os terms for better understanding event namespace organization

* if keys ends with '.', this means this is folder that consist of folders or documents
* if keys not ends with '.', this means this is document that consist of event types
* event types consist of their callbacks
* event types are line of the document and their callbacks are column.
* _root for unnamespaced event names
* _root. for namespaced events
* reserved chars '*', '**', '.', ':' and spaces. you cannot use them in the event type and event target


##sub
    add document or types, if there is not.
    then add callbacks
### '*'
    add '*' document to the folder with event type

##pub
    if there is a document and type, publish the event.
    all publications to any folder are looked into '*' document.
    if there is the same event type(which has just been published )
    in the '*' document,publish same event to '*' document.
### '*'
    publish event to all documents(except '*' and have the same event type) in the folder
    each publication cause publishing events to the relevant '*' document event

##unsub
    if there is a document and type, unsubscribe.
    dont unsubscribe '*' document.
### '*'
    unsubscribe all event types in documents(except '*' and have the same event type) on the folder.
    then unsubscribe '*' document

**NOTE**: if you dont subscribe sth, that means you dont unsub or pub 
and also you dont sub,pub and unsub with '*', if there isnt any document or folder

a.on('create:todos.39', function(e){...});
if you pub an event that has todos.49 event target, it fails  because there is any subscription and pub not create folders
a.on('create:todos.*', function(e){...})  because if there was not any subscribtion, all pubs failed and not going to be published to '*'

##behavior of '*'
    generaly this means any folder or document or event type instead '*'
    1. end of the path (type:folder1.folder2.*) -> all documents in folder2
    2. only one (type:*) -> all documents in the _root folder

    // TODO: implement 3,4 and 5
    // 3. middle of the path  type:folder1.*.document1
    //    all sub folder of folder1 that consist of document1
    // 4. double  type:folder1.**
    //    all of the documents that is under the folder1
    //    and subfolders of folder1 and sub of subfolders... and so on
    // 5. event type  *:document
    //    all event types in the document


  this is shared state where all callbacks are stored
        fs = {
            '_root.':{
                    'talks.':
                                {
                                'talkbox-23234':{
                                                    'delete':cbobj4
                                                }
                                }
                    'talks': {
                                'addnewbox': cbobj5
                    }
                    'searchpage':{
                                    'update':cbobj3
                                }
                    }
            '_root': {
                    'update': cbobj1,
                    'delete': cbobj2
                    }
            }
*/

    var fs = {            // filesystem
             '_root.':{}, // folder
             '_root':{}   // document
             },
        Callbacks = $.Callbacks;
        // you can use your favorite pub/sub library that has the same interface
        // instead of $.Callbacks library (adapting here)
        // TODO: use raw callback list instead of callback object.
        //       raw callback list directly used our pub,sub,unsub functions
        //       write your own pubsub library that clean dependencies 
        //       of external pub/sub libraries and make it efficient.
        
    // split eventNames to eventName
    // then eventType and eventTargets
    function spliter(eventNames) {
        // if eventNames is empty with or without space or undefined
        if (eventNames === undefined || eventNames == false) {
            return false;
        }
        var list = []
            colon = /:/,
            dot = /\./g,
            space = /\s+/;

        // split space seperated eventnames to eventname
        eventNames = eventNames.trim().split(space);
            
        while(eventName = eventNames.shift()) {
            // split event name to type and targets of event
            eventName = eventName.split(colon);
            
            // if there is a target
            if (eventName.length == 2 && eventName[0] != false && eventName[1] != false) {
                // targets are seperated like 'mainTarget.' , 'subT.' , 'sofsT'
                eventName[1] = eventName[1].replace(dot,'.:').split(':');
                // then add '_root.' begining of the targets
                eventName[1].unshift('_root.');
                
            // if only type is defined    
            } else if (eventName[0] != false) {
                // make target '_root' document instead of '_root.' folder
                eventName[1] = ['_root'];
            } else {
                // if something goes wrong, dont add it to the list (using colon more than once,...)
                continue;
            }
            // add [type, [ _root. , 'target1.' , 'target2.' ,..., 'lasttarget'] ] to the list
            list.push(eventName);
        }
        // return eventNames = [eventName1, eventName2 ...]
        return list;
    }

    // TODO: 3 functions on the below are brute forced version.
    //       make this functions more efficient and combine them 
    //       because they are so coupled
    
    function subrute(splittedEventName) {
        var targets = splittedEventName[1], // path that we are going through
            type = splittedEventName[0], // event type
            current = fs, // current Folder or document FIXME: is it any aliasing ???
            listOfCbs = []; // list of callbacks objects that we return
            
        for (var i = 0, l = targets.length; i<l; i++){
            var target = targets[i];
            // next target folder or document(document is last one)

            // if there is not an target that we want to open
            if (current[target] === undefined) {
                // create a new folder or document
                current[target] = {};
            }
            // open it
            current = current[target];

            // if this target is document (last target)
            if (targets.slice(-1)[0] === target) {
                // if document doesnt consist of event type that we are looking for
                if (current[type] === undefined) {
                    // add event type with Callbacks to the document
                    current[type] = Callbacks();
                }
                //push callbacks to list of callbacks
                listOfCbs.push(current[type]);
            }
        }

        return listOfCbs;
    }

    function pubrute(splittedEventName){
        var targets = splittedEventName[1],
            type = splittedEventName[0],
            current = fs, // FIXME: is it any aliasing ???
            listOfCbs = [];

        for (var i = 0, l = targets.length; i<l; i++){
            var target = targets[i];



            // TODO: for decoupling, use recursion and call all eventNames
            //       without * with converting * to event Names


                // if there is any subscription to type:targets.* in this folder
                if (current['*'] !== undefined && current['*'][type] !== undefined && targets.slice(-1)[0] === target) {
                    // folder callbacks called whenever any other the same
                    // type of events called in the same folder
                    var allFolderCallbacks = current['*'][type];
                }
                
                // if last target is '*'
                if ( target == '*' && targets.slice(-1)[0] === target) {
                    // this '*' is designed only for last targets for now
                    // publish the same type of existent eventnames which is in the folder now

                    // '*' and neighbours is subfolder or document of 
                    // current folder which is used in loop
                    for (var otherTarget in current) {
                        // if subfolder or document                         is not '*' and    is not folder (not end with '.') and is consist of event type they we want to publish
                        if (current.hasOwnProperty(otherTarget) && otherTarget !== '*' && (/\.$/).test(otherTarget) === false && current[othertarget][type] !== undefined ) {
                            //push callbacks to list for publish
                            listOfCbs.push(current[othertarget][type]);

                            // if there is any subscription to type:targets.*
                            if (allFolderCallbacks !== undefined) {
                                //push callbacks to list for publish with others
                                listOfCbs.push(allFolderCallbacks);
                            }
                        }
                    }
                    
                    return listOfCbs;
                }


            // if there is not an target that we want to open
            if (current[target] === undefined) {
                // dont create folder or document
                // because it has not already been subscribed
                console.log('there is not an target:', splittedEventName);
                break;
            } else {
                // open target folder when there is no need to gather more callbacks
                current = current[target];
            }
            
            // if this target is last one
            if (targets.slice(-1)[0] === target) {
                // if there is not this type of event
                if (current[type] === undefined) {
                    // dont create this type of event
                    // because it has not already been subscribed
                    console.log('there is not a type:', splittedEventName);
                    break;
                } else {
                    //push callbacks to list of callbacks that we return
                    listOfCbs.push(current[type])
                    
                    // if there is any subscription to type:targets.*
                    if (allFolderCallbacks !== undefined) {
                         //push callbacks to list for publish with others
                         listOfCbs.push(allFolderCallbacks);
                    };
                }
            }
        }
        return listOfCbs;
    }
    
    function unsubrute(splittedEventName){
        var targets = splittedEventName[1],
            type = splittedEventName[0],
            current = fs, // FIXME: is it any aliasing ???
            listOfCbs = [];
        
        for (var i = 0, l = targets.length; i<l; i++){
            var target = targets[i];
            
                // TODO: for decoupling, use recursion and call all eventNames
                //  without * with converting * to event Names
    
                // if there is any subscription to type:targets.*
                if (current['*'] !== undefined && current['*'][type] !== undefined && targets.slice(-1)[0] === target) {
                    // folder callbacks called whenever any other the same type of events called in the folder
                    var allFolderCallbacks = current['*'][type];
                }

                // if last target is '*'
                if ( target == '*' && targets.slice(-1)[0] === target) {
                    // this '*' is designed only for last targets for now
                    // unsubscribe the same type of existent eventnames which is in the folder now

                    // '*' and neighbours is subfolder or document of 
                    // current folder which is used in loop
                    for (var otherTarget in current) {
                        // if subfolder or document                         is not '*' and    is not folder (not end with '.') and is consist of event type they we want to unsubscribe
                        if (current.hasOwnProperty(otherTarget) && otherTarget !== '*' && (/\.$/).test(otherTarget) === false && current[othertarget][type] !== undefined ) {
                            //push callbacks to list for unsubscribe
                            listOfCbs.push(current[othertarget][type]);
                        }
                    }
                    
                    // if there is any subscription to type:targets.*
                    if (allFolderCallbacks !== undefined) {
                        //push callbacks to list for unsubscribe with others
                        listOfCbs.push(allFolderCallbacks);
                    }
                    return listOfCbs;
                }
                
            
            // if there is not an target that we want to open
            if (current[target] === undefined) {
                console.log('there is not an target:', splittedEventName);
                break;
            } else {
                
                // open target folder when there is no need to gather more callbacks
                current = current[target]
            }
            
            // if this target is last one
            if (targets.slice(-1)[0] === target) {
                // if there is not this type of event
                if (current[type] === undefined) {
                    // dont create this type of event
                    // because it has not already been subscribed
                    console.log('there is not a type:', splittedEventName);
                    break;
                } else {
                    //push callbacks to list of callbacks that we return
                    listOfCbs.push(current[type])
                }
            }
        }
        return listOfCbs;
    }
    
    
    
    
    function init(eventNames){
        eventNames = spliter(eventNames);
        
        return {
            sub: function(fn){                 
                for(var i = 0, l = eventNames.length; i<l; i++){
                    var eventName = eventNames[i];
                    var listOfCbs = subrute(eventName);
                    while(cbs = listOfCbs.shift()){
                        cbs.add(fn);
                    }
                }
            },

            pub: function(event){                 
                for(var i = 0, l = eventNames.length; i<l; i++){
                    var eventName = eventNames[i];
                    var listOfCbs = pubrute(eventName);
                    while(cbs = listOfCbs.shift()){
                        cbs.fire(event);
                    }
                }
            },
    
            unsub: function(fn){
                for(var i = 0, l = eventNames.length; i<l; i++){
                    var eventName = eventNames[i];
                    var listOfCbs = unsubrute(eventName);
                    while(cbs = listOfCbs.shift()){
                        cbs.remove(fn);
                    }
                }
            }
        };    
    }
    return init;
})($);
// </ELHAMDULILLAH>
