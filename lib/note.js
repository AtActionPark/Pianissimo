'use strict';
var Theory = require('./theory');
var Interval = require('./interval');
var Helpers = require('./helper');

function Note(name){
  this.name = name
  this.parseName(this.name)
  this.frequency;
}
Note.prototype.parseName = function(name){
  this.octave = parseInt(name.slice(-1));
  //if no octave is provided, assume 3
  if(!Number.isInteger(this.octave))
    this.name+='3'

  let rootRe = new RegExp('[^0-9)]+','g')
  this.root = this.name.match(rootRe)[0]

  let rootBaseNoteRe = new RegExp('[^#b0-9)]+','g')
  this.rootBaseNote =  this.name.match(rootBaseNoteRe)[0]

  if(!Helpers.isValidNoteName(this.rootBaseNote))
    throw this.rootBaseNote + ' is not a note'

  this.octave = parseInt(this.name.slice(-1));

  let alterationRe = new RegExp('[#b)]+','g')
  let alteration = this.name.match(alterationRe)
  this.alteration = alteration?alteration[0]:''

  if (this.alteration != '' 
    && this.alteration != '#'
    && this.alteration != '##'
    && this.alteration != 'b'
    && this.alteration != 'bb' )
    throw this.alteration + ' is not a valid alteration'

  this.noteType = Theory.wholeNotesOrder[this.rootBaseNote] != undefined? 'letter':'name'
}
//those methods will return some of the note property in letter notation, 
Note.prototype.getRoot = function(){
  return Theory.wholeNotesOrder[this.rootBaseNote] != undefined? this.root: Theory.nameToLetter[this.rootBaseNote]+this.alteration
}
Note.prototype.getRootBaseNote = function(){
  return Theory.wholeNotesOrder[this.rootBaseNote] != undefined? this.rootBaseNote: Theory.nameToLetter[this.rootBaseNote]
}
Note.prototype.formatName = function(){
  if(this.noteType == 'name'){
    this.rootBaseNote = Theory.letterToName[this.rootBaseNote]
    this.root = this.rootBaseNote+this.alteration
    this.name = this.root+this.octave
  }
}

//Returns the frequency in Hz of a named note + octave (ex: C3, D#2, ...)
Note.prototype.getFrequency = function(){
  let f0 = Theory.A4Freq;
  let a = Math.pow(2,1/12)
  let n = Theory.notesOrder[this.getRoot()] - Theory.notesOrder['A'] + (this.octave-4)*12

  return f0 * Math.pow(a,n)
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

  let initialOctave = this.octave;
  let octave = initialOctave;
  let rootNote = this.getRoot();
  let rootNoteBaseNoteName = this.getRootBaseNote();
  let rootNoteMod = this.alteration;
  let order = (interval.getOrder() == "ascending"||  interval.getOrder == '')? 1 : -1

  let resultNoteName = this.findNoteNameFromInterval(interval)
  
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
  
  result.noteType = this.noteType
  result.formatName()
  return result
}
//Add the interval number to the root note to find the result note
//We dont care about alterations, just about the note index in the wholeNotesOrder list
Note.prototype.findNoteNameFromInterval=function(interval){
  //Add the interval number to the root note to find the result note
  //We dont care about alterations, just about the note index in the wholeNotesOrder list
  let rootNote = this.getRoot();
  let rootNoteBaseNoteName =this.getRootBaseNote();
  let order = (interval.getOrder() == "ascending"||  interval.getOrder() == '')? 1 : -1
  let resultNoteIndex = (Theory.wholeNotesOrder[rootNoteBaseNoteName] + order*(interval.number-1))%7;

  if(resultNoteIndex == 0)
    resultNoteIndex = 7;
  if(resultNoteIndex < 0)
    resultNoteIndex += 7;
  let resultNoteName = Helpers.getKeyByValue(Theory.wholeNotesOrder, resultNoteIndex);

  return resultNoteName
}



module.exports = Note