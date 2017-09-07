'use strict';
var Theory = require('./theory');
var Interval = require('./interval');
var Scale = require('./scale');
var Helpers = require('./helper');

//Use symbols for emulating private variables
var _name = Symbol('name');
var _root = Symbol('root');
var _rootName = Symbol('rootName');
var _alteration = Symbol('alteration');
var _octave = Symbol('octave');
var _notationType = Symbol('notationType');

exports = module.exports = Note

//name needs to be a capital letter + alterations/octave (D#2)  or a capitalized note name+ alt/octave (Solb2)
function Note(name){
  this[_name] = name;
  //Compute all properties depending on the name
  parseName(this)

  //Duplicate of the name, for debugging purpose, is public but has no impact on anything
  this.note = this[_name];
  //Standard name function for all objects
  this.name = this.getName
}

//Public getters - ex for C#3
Note.prototype.getName = function(){return this[_name]};                  // returns C#3
Note.prototype.getRoot = function(){return this[_root]};                  // returns C#
Note.prototype.getRootName = function(){return this[_rootName]};          // returns C
Note.prototype.getAlteration = function(){return this[_alteration]};      // returns #
Note.prototype.getOctave = function(){return this[_octave]};              // returns 3
Note.prototype.getNotationType = function(){return this[_notationType]};  // returns letter

//Calculations are done based on letter name
Note.prototype.getRootAsLetter = function(){
  return Theory.wholeNotesOrder[this.getRootName()] != undefined? this.getRoot(): Theory.nameToLetter[this.getRootName()]+this.getAlteration()
}
Note.prototype.getRootNameAsLetter = function(){
  return Theory.wholeNotesOrder[this.getRootName()] != undefined? this.getRootName(): Theory.nameToLetter[this.getRootName()]
}

//Returns the note you end up on when adding an interval to the current note
Note.prototype.plusInterval = function(interval,intervalOrder){
  if(typeof interval == 'string'){
    if(intervalOrder && typeof intervalOrder == 'string')
      interval = new Interval(interval,intervalOrder)
    else
      interval = new Interval(interval)
  }

  if(interval.getQuality() == '$')
    return 'impossible to compute'

  let initialOctave = this.getOctave();
  let octave = initialOctave;
  let rootNote = this.getRootAsLetter();
  let rootNoteBaseNoteName = this.getRootNameAsLetter();
  let rootNoteMod = this.getAlteration();
  let order = (interval.getOrderAsString() == "ascending"||  interval.getOrderAsString() == '')? 1 : -1

  let resultNoteName = findNoteNameFromInterval(this,interval)
  
  let semitones = interval.getSemitones();

  //Find the octave of the resulting note
  //for each 12 semitones, add one octave
  while(semitones > 12){
    octave+=1;
    semitones-=12
  }
  while(semitones < -12){
    octave-=1;
    semitones+=12
  }

  if(semitones == 12)
    octave+=1
  if(semitones == -12)
    octave-=1

  //Find the difference in semitones
  let diffFromNames = (Theory.notesOrder[resultNoteName] - Theory.notesOrder[rootNote])*order

  //special case for unisons,octaves and double octaves
  if(rootNoteBaseNoteName == resultNoteName){
    diffFromNames =  -order*(octave-initialOctave)*12
    if(rootNoteMod == '#')
      semitones+=1
    if(rootNoteMod == 'b')
      semitones-=1
  }

  if((interval.getNumber() % 7 == 1 ) && interval.getQuality() != 'd'  )
    octave-=1*order
  if((interval.getNumber() % 7 == 0) && interval.getQuality() == 'A'  )
    octave-=1*order

  
  if (diffFromNames<0 || Math.sign(diffFromNames) == -0){
    diffFromNames+=12
    octave+=order*1
  }
  
  // we checked the difference between the full initial note name and the target note name without alteration
  // if there is a difference, we need to alterate the result note
  let d = order*diffFromNames-semitones
  
  while(d>12)
    d-=12
  while(d<-12)
    d+=12
  if(d>2)
    d-=12
  if(d<-2)
    d+=12

  let mod = ''
  if(d == 1)
    mod = 'b'
  if(d == -1)
    mod = '#' 

  if(d == 2 )
    mod = 'bb'
  if(d == -2)
    mod = '##'


  //looking for impossible intervals/triple alteration (ex cant build an ascending D2 on Ab)
  if(d>=3 || d <=-3){
    return 'impossible to compute'
  }
  
  let result = new Note(resultNoteName + mod + octave)
  
  setNotationType(result,this.getNotationType()) 
  formatName(result)
  return result
}
//Returns a Scale objet, with type as specified in argument, and the current note as the tonic
Note.prototype.toScale = function(type,degree){
  return new Scale(this,type,degree);
}
//Returns the frequency in Hz of a note
Note.prototype.getFrequency = function(){
  let f0 = Theory.A4Freq;
  let a = Math.pow(2,1/12)
  let n = Theory.notesOrder[this.getRootAsLetter()] - Theory.notesOrder['A'] + (this.getOctave()-4)*12

  return f0 * Math.pow(a,n)
}

//Private
//Setters
const setName = function(note,newName){note[_name] = newName};
const setRoot = function(note,newRoot){note[_root] = newRoot};
const setRootName = function(note,newRootName){note[_rootName] = newRootName};
const setAlteration = function(note,newAlteration){note[_alteration] = newAlteration};
const setOctave = function(note,newOctave){note[_octave] = newOctave};
const setNotationType = function(note,newNotationType){note[_notationType] = newNotationType};

//will try to read the name argument, and fill all props from it
const parseName = function(note){
  //setOctave(note,parseInt(note.getName().slice(-1)));
  let octaveRe = new RegExp('[0-9)]+','g')
  //if we find some numbers, take them as octave
  if(note.getName().match(octaveRe))
    setOctave(note,parseInt(note.getName().match(octaveRe)[0]))
  //if no octave is provided, assume 3
  else{
    setName(note,note.getName() +'3');
    setOctave(note,3)
  }

  //The root will be everything but the numbers
  let rootRe = new RegExp('[^0-9)]+','g')
  setRoot(note,note.getName().match(rootRe)[0])

  //and the rootName will be everything but numbers and alterations
  let rootNameRe = new RegExp('[^#bx0-9)]+','g')
  setRootName(note,note.getName().match(rootNameRe)[0])

  if(!Helpers.isValidNoteName(note.getRootName()))
    throw note.getRootName + ' is not a note'

  //the alterations have to be #.b or x
  let alterationRe = new RegExp('[#bx)]+','g')
  let alteration = note.getName().match(alterationRe)
  alteration = alteration?alteration[0]:''
  setAlteration(note,alteration)

  if (alteration != '' 
    && alteration != '#'
    && alteration != '##'
    && alteration != 'x'
    && alteration != 'b'
    && alteration != 'bb' )
    throw alteration + ' is not a valid alteration'

  //check if the rootName is defined as a letter or as a note name (Do,re...)
  setNotationType(note,Theory.wholeNotesOrder[note.getRootName()] != undefined? 'letter':'name') 
}
//Add the interval number to the root note to find the result note
//We dont care about alterations, just about the note index in the wholeNotesOrder list
const findNoteNameFromInterval=function(note,interval){
  //Add the interval number to the root note to find the result note
  //We dont care about alterations, just about the note index in the wholeNotesOrder list
  let rootNote = note.getRootAsLetter();
  let rootNoteBaseNoteName =note.getRootNameAsLetter();
  let order = (interval.getOrderAsString() == "ascending"||  interval.getOrderAsString() == '')? 1 : -1
  let resultNoteIndex = (Theory.wholeNotesOrder[rootNoteBaseNoteName] + order*(interval.getNumber()-1))%7;

  if(resultNoteIndex == 0)
    resultNoteIndex = 7;
  if(resultNoteIndex < 0)
    resultNoteIndex += 7;
  let resultNoteName = Helpers.getKeyByValue(Theory.wholeNotesOrder, resultNoteIndex);

  return resultNoteName
}
//Calculations are based on letters, if the note was specified as name, reformat accordingly
const formatName = function(note){
  if(note.getNotationType() == 'name'){
    setRootName(note,Theory.letterToName[note.getRootName()])
    setRoot(note,note.getRootName()+note.getAlteration())
    setName(note,note.getRoot()+note.getOctave()) 
  }
}

