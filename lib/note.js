'use strict';
var Theory = require('./theory');
var Interval = require('./interval');
var Scale = require('./scale');
var Helpers = require('./helper');




function Note(name){
  this.name = name
  parseName(this)
  this.frequency;
  let test = 0
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
  
  result.noteType = this.noteType
  formatName(result)
  return result
}
//will return a Scale objet, with type as specifiex in argument, and the current note as the tonic
Note.prototype.toScale = function(type){
  return new Scale(this,type);
}
//Returns the frequency in Hz of a named note + octave (ex: C3, D#2, ...)
Note.prototype.getFrequency = function(){
  let f0 = Theory.A4Freq;
  let a = Math.pow(2,1/12)
  let n = Theory.notesOrder[this.getRoot()] - Theory.notesOrder['A'] + (this.octave-4)*12

  return f0 * Math.pow(a,n)
}
//those methods will return some of the note property in letter notation, 
Note.prototype.getRoot = function(){
  return Theory.wholeNotesOrder[this.rootBaseNote] != undefined? this.root: Theory.nameToLetter[this.rootBaseNote]+this.alteration
}
Note.prototype.getRootBaseNote = function(){
  return Theory.wholeNotesOrder[this.rootBaseNote] != undefined? this.rootBaseNote: Theory.nameToLetter[this.rootBaseNote]
}

//Privates
const parseName = function(note){
  note.octave = parseInt(note.name.slice(-1));
  //if no octave is provided, assume 3
  if(!Number.isInteger(note.octave)){
    note.name+='3';
    note.octave = 3
  }

  let rootRe = new RegExp('[^0-9)]+','g')
  note.root = note.name.match(rootRe)[0]

  let rootBaseNoteRe = new RegExp('[^#b0-9)]+','g')
  note.rootBaseNote =  note.name.match(rootBaseNoteRe)[0]

  if(!Helpers.isValidNoteName(note.rootBaseNote))
    throw note.rootBaseNote + ' is not a note'

  let alterationRe = new RegExp('[#b)]+','g')
  let alteration = note.name.match(alterationRe)
  note.alteration = alteration?alteration[0]:''

  if (note.alteration != '' 
    && note.alteration != '#'
    && note.alteration != '##'
    && note.alteration != 'b'
    && note.alteration != 'bb' )
    throw note.alteration + ' is not a valid alteration'

  note.noteType = Theory.wholeNotesOrder[note.rootBaseNote] != undefined? 'letter':'name'
}
//Add the interval number to the root note to find the result note
//We dont care about alterations, just about the note index in the wholeNotesOrder list
const findNoteNameFromInterval=function(note,interval){
  //Add the interval number to the root note to find the result note
  //We dont care about alterations, just about the note index in the wholeNotesOrder list
  let rootNote = note.getRoot();
  let rootNoteBaseNoteName =note.getRootBaseNote();
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
  if(note.noteType == 'name'){
    note.rootBaseNote = Theory.letterToName[note.rootBaseNote]
    note.root = note.rootBaseNote+note.alteration
    note.name = note.root+note.octave
  }
}

exports = module.exports = Note