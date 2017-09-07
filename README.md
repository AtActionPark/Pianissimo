# Solfege

Set of solfege helpers for notes, intervals, chords and scales

#### Create a solfege object
```javascript
const solfege = require('../solfege');
```
#####Methods
```javascript
solfege.note(name)                  //returns a note object from a name
solfege.interval(name,order)        //returns an interval object from a name and order
solfege.interval(note1,note2)       //returns an interval object from 2 notes
solfege.scale(tonic,type,degree)    //returns a scale object from a note, a scale name, and a degree (optional)
solfege.randomNote()                //returns a random note object
solfege.randomInterval()            //returns a random interval object
solfege.setA4(frequency)            //sets the frequency of A4 (default: 440Hz)
```

#### Notes
#####Creation
Notes are object created through the .note(arg) method
Argument must be a string of type 'C3', 'C#2', 'Db', 'Solb4', 'fax' ...

```javascript
let note = solfege.note('C#4');
let note2 = solfege.note('Solbb2');
let note3 = solfege.note('D');        //octave will default to 3
let note4 = solfege.note('Gx4');      
```

#####Getters
```javascript
    note.getName();          // 'C#4'
    note.getRoot();          // 'C#'
    note.getRootName();      // 'C'
    note.getAlteration();    // '#'
    note.getOctave();        // 4
    note.getNotationType();  // letter (can be letter or name)
```
#####Methods
.plusInterval(args) : adds an interval to the note, and returns the resulting note object
Arguments can be an interval object, an interval name (order will be ascending, or an interval name and order)
```javascript
    note.plusInterval(interval)             //ex: let note2 = note.plusInterval(intervalObject) 
    note.plusInterval(intervalName)         //ex: let note2 = note.plusInterval('P5') 
    note.plusInterval(intervaName,order)    //ex: let note2 = note.plusInterval('P5', 'descending') 
                                            //ex: let note2 = note.plusInterval('P5', '-') 
```

.toScale(args) : returns a scale object built on the current note
Arguments can be the name of the scale, and the degree to start on (optional)
```javascript
    note.toScale(type)             //ex: let scale = note.toScale('minor') 
    note.toScale(type,degree)      //ex: let scale = note.toScale('locrian',5) 
```

#### Interval
#####Creation
Interval are object created through the .interval(arg1,arg2) method
The first way of creating an interval is by specifying the name and order
Arg1 is the name of the interval (m3, P5,d18...)
Arg 2 is optional and is the order (ascending, descending, -, +)

```javascript
let interval1 = solfege.note('m3', 'descending');
let interval2 = solfege.note('d5');                  //order will default to ascending
let interval3 = solfege.note('P8','-');
```

The second way is by giving 2 notes
Arg1 and Arg2 are 2 notes objects or note names
```javascript
let interval1 = solfege.note('C3', 'G3');
let interval2 = solfege.note(note1,note2);
let interval3 = solfege.note('C3',note2);
let interval3 = solfege.note(note1,'Sol#');
```

#####Getters
```javascript
    note.getName();         // 'm3'
    note.getSemitonest();   // '3'
    note.getOrder());       // 'ascending'
    note.getNumber();       // 3
    note.getQuality();      // m
    note.getQualityText();  // minor
    note.getNumberText();   // third
    note.getNote1();        // undefined or the note used to create the interval
    note.getNote2();        // undefined or the note used to create the interval
```

#####Methods
.plusInterval(args) : adds an interval to the note, and returns the resulting note object
Arguments can be an interval object, an interval name (order will be ascending, or an interval name and order)
```javascript
    note.plusInterval(interval)             //ex: let note2 = note.plusInterval(intervalObject) 
    note.plusInterval(intervalName)         //ex: let note2 = note.plusInterval('P5') 
    note.plusInterval(intervaName,order)    //ex: let note2 = note.plusInterval('P5', 'descending') 
                                            //ex: let note2 = note.plusInterval('P5', '-') 
```

.toScale(args) : returns a scale object built on the current note
Arguments can be the name of the scale, and the degree to start on (optional)
```javascript
    note.toScale(type)             //ex: let scale = note.toScale('minor') 
    note.toScale(type,degree)      //ex: let scale = note.toScale('locrian',5) 
```