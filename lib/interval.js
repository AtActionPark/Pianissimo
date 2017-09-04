'use strict';

var Helpers = require('./helper');
var Theory = require('./theory');

exports = module.exports = Interval

//The interval can be specified by givin a name (m2, P5, M9...) and order (ascending, descending)
// or by giving 2 notes
//Accepted names are a comination of quality (P,M,m,A,d) and note name(C,Db,F#,Solbb ...)
function Interval(arg1,arg2){
  var Note = require('./note');
  if(Helpers.isNote(arg1) && Helpers.isNote(arg2)){
    this.n1 = arg1;
    this.n2 = arg2;
    computeFromNotes(this)
  }
  else if(Helpers.isValidNoteNotation(arg1) && Helpers.isValidNoteNotation(arg2)){
    this.n1 = new Note(arg1);
    this.n2 = new Note(arg2);
    computeFromNotes(this)
  }
  else{
    parseName(this,arg1,arg2)
  }
}
Interval.prototype.invert = function(){
  //an interval number and its inversion add up to 9
  // for compound intervals, remove the octaves
  let newNumber = 9-this.number%7

  let newQuality = 'P';
  if(this.quality == 'm') 
    newQuality = 'M'
  if(this.quality == 'M') 
    newQuality = 'm'
  if(this.quality == 'd') 
    newQuality = 'A'
  if(this.quality == 'A') 
    newQuality = 'D'

  this.name = newQuality+newNumber

  parseName(this,this.name, this.order)

  if(this.n1 && this.n2){
    this.n1 = this.n2;
    this.n2 = this.n2.plusInterval(this);
  }
  
  return this
}
Interval.prototype.getOrder = function(){
  if(this.order == '+' ||(Number.isInteger(this.order) && this.order>0))
    return 'ascending'
  if(this.order == '-' || (Number.isInteger(this.order) &&this.order<0))
    return 'descending'
  return this.order
}



//Privates
const displayNameAsText = function(interval){
  let order = interval.getOrder()
  if(interval.name == "P1" || interval.name == "d2")
    order = ''
  if(interval.numberText == undefined)
    return '?'
  return  order + " " + interval.qualityText + " " + interval.numberText
}
//if the interval is not defined, all the properties can be computed
// by specifying the 2 notes that form the interval
const computeFromNotes = function(interval){
  setIntervalInSemitones(interval)
  setIntervalOrder(interval);
  setIntervalNumber(interval);
  setIntervalQuality(interval);
  
  interval.name = ''+interval.quality+''+interval.number

  interval.qualityText = Theory.intervalQualityDict[interval.quality];
  interval.numberText = Theory.intervalNumberDict[interval.number];
  if(interval.numberText == undefined)
    interval.numberText = interval.number + 'th'
}
const setIntervalInSemitones = function(interval){
  let oct1 = interval.n1.octave;
  let rootNote1 = interval.n1.getRoot();
    
  let oct2 = interval.n2.octave;
  let rootNote2 = interval.n2.getRoot();

  let diff = Theory.notesOrder[rootNote2] - Theory.notesOrder[rootNote1] + (oct2-oct1)*12
  interval.semitones = diff
}
//Sets the interval's numbery (2nd,third...)
const setIntervalNumber = function(interval){
  let oct1 = interval.n1.octave;
  let rootNote1 =interval.n1.getRootBaseNote();

  let oct2 = interval.n2.octave;
  let rootNote2 = interval.n2.getRootBaseNote();

  let diff = Theory.wholeNotesOrder[rootNote2] - Theory.wholeNotesOrder[rootNote1] + 1 + (oct2-oct1)*7

  //special case for ##
  if(oct1 == oct2 && diff>7)
    diff-=7

  if (oct2>oct1 || (oct2 == oct1 && Theory.wholeNotesOrder[rootNote2] >= Theory.wholeNotesOrder[rootNote1])){
    interval.number = diff 
  }
  else{
    interval.number =  (2-diff)
  } 
}
//Sets the interval's quality (minor, major, perfect...)
const setIntervalQuality = function(interval){
  let oct1 = interval.n1.octave;
  let rootNote1 = interval.n1.getRoot();
    
  let oct2 = interval.n2.octave;
  let rootNote2 = interval.n2.getRoot();

  let nb = interval.number>=7? Math.abs(interval.number)%7  :Math.abs(interval.number)

  let semitones = Math.abs(interval.semitones)%12

  let quality;

  switch (semitones){
    case 0:
      if(nb == 1)
        quality = 'P';
      else if(nb == 2)
        quality = 'd';
      else if(nb == 7)
        quality = 'A';
      break;
    case 1:
      if(nb == 1)
        quality = 'A';
      else if(nb == 2)
        quality = 'm';
      break;
    case 2:
      if(nb == 2)
        quality = 'M';
      else if(nb == 3)
        quality = 'd';
      break;
    case 3:
      if(nb == 2)
        quality = 'A';
      else if(nb == 3)
        quality = 'm';
      break;
    case 4:
      if(nb == 3)
        quality = 'M';
      else if(nb == 4)
        quality = 'd';
      break;
    case 5:
      if(nb == 3)
        quality = 'A';
      else if(nb == 4)
        quality = 'P';
      break;
    case 6:
      if(nb == 4)
        quality = 'A';
      else if(nb == 5)
        quality = 'd';
      break;
    case 7:
      if(nb == 5)
        quality = 'P';
      else if(nb == 6)
        quality = 'd';
      break;
    case 8:
      if(nb == 5)
        quality = 'A';
      else if(nb == 6)
        quality = 'm';
      break;
    case 9:
      if(nb == 7)
        quality = 'd';
      else if(nb == 6)
        quality = 'M';
      break;
    case 10:
      if(nb == 7)
        quality = 'm';
      else if(nb == 6)
        quality = 'A';
      break;
    case 11:
      if(nb == 7)
        quality = 'M';
      else if(nb == 8)
        quality = 'd';
      break;
    case 12:
      if(nb == 8)
        quality = 'P';
      else if(nb == 7)
        quality = 'A';
      else if(nb == 9)
        quality = 'd';
      break;
  }
  interval.quality =  quality 
  if(interval.quality == undefined) interval.quality = '$'
}
//Sets the interval order (ascending, descending)
const setIntervalOrder = function(interval){
  let semitones = interval.semitones

  if (semitones>0)
    interval.order =  'ascending'
  else if (semitones < 0)
    interval.order =  'descending'
  else{
    interval.order = ''
    let note1BaseName = interval.n1.getRootBaseNote()
    let note2BaseName = interval.n2.getRootBaseNote()

    let diff = Theory.wholeNotesOrder[note2BaseName] - Theory.wholeNotesOrder[note1BaseName] 
    if(diff<-7)
      diff+=7
    if(diff>7)
      diff-=7
    interval.order = diff>=0?'ascending':'descending'
  }  
}
const parseName = function(interval, name,order){
  interval.name = name;
  interval.order = order || 'ascending';
  interval.number = parseInt(interval.name.substring(1));
  interval.quality = interval.name.substring(0,1);
  interval.semitones =  (interval.getOrder() == "ascending"? 1 : -1)*setSemitonesFromName(interval)
  interval.qualityText = Theory.intervalQualityDict[interval.quality];
  interval.numberText = Theory.intervalNumberDict[interval.number];
  if(interval.numberText == undefined)
    interval.numberText = interval.number + 'th'
}
const setSemitonesFromName = function(interval){
  let x = interval.number-1
  let semitones = 0;
  let i = 1

  if(interval.number<=8){
    semitones = Theory.intervalsDict[interval.name]
  }
  else{
    while(x>=7){
      x-=7
      semitones+=12
    }

    let r = interval.quality + (interval.number%7 )
    semitones+= Theory.intervalsDict[r]
  }
  
  return semitones
}
