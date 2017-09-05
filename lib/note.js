'use strict';
var Theory = require('./theory');
var Interval = require('./interval');
var Scale = require('./scale');
var Helpers = require('./helper');

function Note(name){
  //name: C#3
  //root: C#
  //rootName: C
  //alteration: #
  //octave: 3
  //notationType: letter
  

  let _name = name
  this.getName = function(){return _name}
  this.setName = function(newName){_name = newName};
  
  let _root;
  this.getRoot = function(){return _root}
  this.setRoot = function(newRoot){_root = newRoot};
  //all calculation are based on notes as letters
  this.getRootAsLetter = function(){
    return Theory.wholeNotesOrder[_rootName] != undefined? _root: Theory.nameToLetter[_rootName]+this.getAlteration()
  }

  let _rootName;
  this.getRootName = function(){return _rootName}
  this.setRootName = function(newRootName){_rootName = newRootName};
  //all calculation are based on notes as letters
  this.getRootNameAsLetter = function(){
    return Theory.wholeNotesOrder[_rootName] != undefined? _rootName: Theory.nameToLetter[_rootName]
  }

  let _alteration;
  this.getAlteration = function(){return _alteration}
  this.setAlteration = function(newAlteration){_alteration = newAlteration};

  let _octave;
  this.getOctave = function(){return _octave};
  this.setOctave = function(newOctave){_octave = newOctave};

  let _notationType;
  this.getNotationType = function(){return _notationType};
  this.setNotationType = function(newNotationType){_notationType = newNotationType};

  parseName(this)
}

//Returns the note you end up on when adding an interval to the current note
Note.prototype.plusInterval = function(interval,intervalOrder){
  if(typeof interval == 'string'){
    if(intervalOrder && typeof intervalOrder == 'string')
      interval = new Interval(interval,intervalOrder)
    else
      interval = new Interval(interval)
  }

  if(interval.quality == '$')
    return 'impossible to compute'

  let initialOctave = this.getOctave();
  let octave = initialOctave;
  let rootNote = this.getRootAsLetter();
  let rootNoteBaseNoteName = this.getRootNameAsLetter();
  let rootNoteMod = this.getAlteration();
  let order = (interval.getOrder() == "ascending"||  interval.getOrder() == '')? 1 : -1

  let resultNoteName = findNoteNameFromInterval(this,interval)
  
  let semitones = interval.semitones

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

  if((interval.number % 7 == 1 ) && interval.quality != 'd'  )
    octave-=1*order
  if((interval.number % 7 == 0) && interval.quality == 'A'  )
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
  
  result.setNotationType(this.getNotationType()) 
  formatName(result)
  return result
}
//will return a Scale objet, with type as specifiex in argument, and the current note as the tonic
Note.prototype.toScale = function(type,degree){
  return new Scale(this,type,degree);
}
//Returns the frequency in Hz of a named note + octave (ex: C3, D#2, ...)
Note.prototype.getFrequency = function(){
  let f0 = Theory.A4Freq;
  let a = Math.pow(2,1/12)
  let n = Theory.notesOrder[this.getRootAsLetter()] - Theory.notesOrder['A'] + (this.getOctave()-4)*12

  return f0 * Math.pow(a,n)
}

//Privates
const parseName = function(note){
  note.setOctave(parseInt(note.getName().slice(-1)));
  //if no octave is provided, assume 3
  if(!Number.isInteger(note.getOctave())){
    note.setName(note.getName() +'3');
    note.setOctave(3)
  }

  let rootRe = new RegExp('[^0-9)]+','g')
  note.setRoot(note.getName().match(rootRe)[0])

  let rootBaseNoteRe = new RegExp('[^#bx0-9)]+','g')
  note.setRootName(note.getName().match(rootBaseNoteRe)[0])

  if(!Helpers.isValidNoteName(note.getRootName()))
    throw note.getRootName + ' is not a note'

  let alterationRe = new RegExp('[#bx)]+','g')
  let alteration = note.getName().match(alterationRe)
  alteration = alteration?alteration[0]:''
  note.setAlteration(alteration)

  if (alteration != '' 
    && alteration != '#'
    && alteration != '##'
    && alteration != 'x'
    && alteration != 'b'
    && alteration != 'bb' )
    throw alteration + ' is not a valid alteration'

  note.setNotationType(Theory.wholeNotesOrder[note.getRootName()] != undefined? 'letter':'name') 
}
//Add the interval number to the root note to find the result note
//We dont care about alterations, just about the note index in the wholeNotesOrder list
const findNoteNameFromInterval=function(note,interval){
  //Add the interval number to the root note to find the result note
  //We dont care about alterations, just about the note index in the wholeNotesOrder list
  let rootNote = note.getRootAsLetter();
  let rootNoteBaseNoteName =note.getRootNameAsLetter();
  let order = (interval.getOrder() == "ascending"||  interval.getOrder() == '')? 1 : -1
  let resultNoteIndex = (Theory.wholeNotesOrder[rootNoteBaseNoteName] + order*(interval.number-1))%7;

  if(resultNoteIndex == 0)
    resultNoteIndex = 7;
  if(resultNoteIndex < 0)
    resultNoteIndex += 7;
  let resultNoteName = Helpers.getKeyByValue(Theory.wholeNotesOrder, resultNoteIndex);

  return resultNoteName
}
const formatName = function(note){
  if(note.getNotationType() == 'name'){
    note.setRootName(Theory.letterToName[note.getRootName()])
    note.setRoot(note.getRootName()+note.getAlteration())
    note.setName(note.getRoot()+note.getOctave()) 
  }
}

exports = module.exports = Note