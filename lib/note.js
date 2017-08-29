'use strict';
var Theory = require('./theory');
var Interval = require('./interval');
var Helpers = require('./helper');

function Note(name){
    this.name = name;
    this.root = this.name.slice(0,-1);
    this.rootNoAlteration =  this.name.slice(0,1);
    this.octave = parseInt(this.name.slice(-1));
    this.alteration = this.name.slice(1,-1);

    this.frequency;

    //this.duration = 0;
    
}
  //Returns the frequency in Hz of a named note + octave (ex: C3, D#2, ...)
Note.prototype.getFrequency = function(){
    if("undefined" === typeof rootNotes[this.root] ){
      if(this.root === 'B#' || this.root === 'B#'){
        return rootNotes[enharmonics[this.root]]*Math.pow(2,(this.octave-2));
      }
      else if (this.roote === 'Cb' || this.root === 'Cbb'){
        return rootNotes[enharmonics[this.root]]*Math.pow(2,(this.octave-4));
      }
      else{
        return rootNotes[enharmonics[this.root]]*Math.pow(2,(this.octave-3));
      }
    }
    else
      return rootNotes[this.root]*Math.pow(2,(this.octave-3));
}
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
  let rootNote = this.root;
  let rootNoteBaseNoteName = this.rootNoAlteration;
  let rootNoteMod = this.alteration;
  let order = (interval.order == "ascending"||  interval.order == '')? 1 : -1

  
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
    //console.log('Can not build a ' +interval.order + ' ' +interval.name + " on " + this.name + '. Picking a new random note')
    return 'impossible to compute'
  }
  
  let result = resultNoteName + mod + octave
  return new Note(result)
}
//Add the interval number to the root note to find the result note
//We dont care about alterations, just about the note index in the wholeNotesOrder list
Note.prototype.findNoteNameFromInterval=function(interval){
  //Add the interval number to the root note to find the result note
  //We dont care about alterations, just about the note index in the wholeNotesOrder list
  let rootNote = this.root;
  let rootNoteBaseNoteName =this.rootNoAlteration;
  let order = (interval.order == "ascending"||  interval.order == '')? 1 : -1
  let resultNoteIndex = (Theory.wholeNotesOrder[rootNoteBaseNoteName] + order*(interval.number-1))%7;

  if(resultNoteIndex == 0)
    resultNoteIndex = 7;
  if(resultNoteIndex < 0)
    resultNoteIndex += 7;
  let resultNoteName = Helpers.getKeyByValue(Theory.wholeNotesOrder, resultNoteIndex);

  return resultNoteName
}



module.exports = Note