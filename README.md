# Solfege

Set of solfege helpers for notes, intervals, chords and scales

#### Create a solfege object
```javascript
    const solfege = require('../solfege');
```
##### Methods
```javascript
    solfege.note(name);                  //returns a note object from a name
    solfege.interval(name,order);        //returns an interval object from a name and order
    solfege.interval(note1,note2);       //returns an interval object from 2 notes
    solfege.scale(tonic,type,degree);    //returns a scale object from a note, a scale name, and a degree (optional)
    solfege.randomNote();                //returns a random note object
    solfege.randomInterval();            //returns a random interval object
    solfege.setA4(frequency);            //sets the frequency of A4 (default: 440Hz)
```

## Notes
#### Creation
Notes are object created through the .note(arg) method
Argument must be a string of type 'C3', 'C#2', 'Db', 'Solb4', 'fax' ...

```javascript
    let note = solfege.note('C#4');
    let note2 = solfege.note('Solbb2');
    let note3 = solfege.note('D');        //octave will default to 3
    let note4 = solfege.note('Gx4');      
```

#### Getters
```javascript
    note.getName();          // 'C#4'
    note.getRoot();          // 'C#'
    note.getRootName();      // 'C'
    note.getAlteration();    // '#'
    note.getOctave();        // 4
    note.getNotationType();  // letter (can be letter or name)
```
#### Methods
**.plusInterval(args)** : adds an interval to the note, and returns the resulting note object
Arguments can be an interval object, an interval name (order will be ascending, or an interval name and order)
```javascript
    note.plusInterval(interval)             //ex: let note2 = note.plusInterval(intervalObject) 
    note.plusInterval(intervalName)         //ex: let note2 = note.plusInterval('P5') 
    note.plusInterval(intervaName,order)    //ex: let note2 = note.plusInterval('P5', 'descending') 
                                            //ex: let note2 = note.plusInterval('P5', '-') 
```

**.toScale(args)** : returns a scale object built on the current note
Arguments can be the name of the scale, and the degree to start on (optional)
```javascript
    note.toScale(type)             //ex: let scale = note.toScale('minor') 
    note.toScale(type,degree)      //ex: let scale = note.toScale('locrian',5) 
```

## Interval
#### Creation
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

#### Getters
```javascript
    interval.getName();         // 'm3'
    interval.getSemitonest();   // '3'
    interval.getOrder();       // 'ascending'
    interval.getNumber();       // 3
    interval.getQuality();      // m
    interval.getQualityText();  // minor
    interval.getNumberText();   // third
    interval.getNote1();        // undefined, or the note used to create the interval
    interval.getNote2();        // undefined, or the note used to create the interval
    interval.getNotes();        // returns [note1,note2]
    interval.getNotesName();    // returns [note1.getName(),note2.getName()]
```

#### Methods
**.invert()** : returns the inverted interval. If it was defined with notes, 

```javascript
    let interval = new interval('m3').invert();  
    interval.getName();                                  // M6     

    let interval2 = new interval('C3','G3').invert();   
    interval.getName();                                 // M6    
    interval.getNotesName();                            //['G3', 'C4']
```

## Scale
#### Creation
Scales are object created through the .scale(tonic,type,degree) method
Degree is optional, with default value 1, and used to start a scale on a different degree


```javascript
let scale1 = solfege.scale('C3','minor');              //C minor
let scale2 = solfege.scale('C3','harmonicMinor',5);    //5th mode of the harmonic minor: C phrygian dominant

```

#### Getters
```javascript
    scale.getTonic();       // 'C3'
    scale.getType();        // 'minor'
    scale.getDegree();      // '1'
    scale.getNotes();       // will return an array of note objects
    scale.getNotesName();   // will return teh name of the notes: ['C3','D3','Eb3','D3','G3','Ab3','Bb3','C4']

```

#### Methods
**.invert()** : returns the inverted interval. If it was defined with notes, 

```javascript
    let interval = new interval('m3').invert();  
    interval.getName();                                  // M6     

    let interval2 = new interval('C3','G3').invert();   
    interval.getName();                                 // M6    
    interval.getNotesName();                            //['G3', 'C4']
```