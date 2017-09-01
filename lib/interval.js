'use strict';
var Note = require('./note');
var Helpers = require('./helper');
var Theory = require('./theory');


//The interval can be specified by givin a name (m2, P5, M9...) and order (ascending, descending)
// or by giving 2 notes
function Interval(arg1,arg2){
  if(Helpers.isNote(arg1) && Helpers.isNote(arg2)){
    this.n1 = arg1;
    this.n2 = arg2;
    this.computeFromNotes(this.n1,this.n2)
  }
  else{
    this.parseName(arg1,arg2)
  }
}
Interval.prototype.parseName = function(name,order){
  this.name = name;
  this.order = order || 'ascending';
  this.number = parseInt(this.name.substring(1));
  this.quality = this.name.substring(0,1);
  this.semitones =  (this.getOrder() == "ascending"? 1 : -1)*this.setSemitonesFromName()
  this.qualityText = Theory.intervalQualityDict[this.quality];
  this.numberText = Theory.intervalNumberDict[this.number];
  if(this.numberText == undefined)
    this.numberText = this.number + 'th'
}
Interval.prototype.getOrder = function(){
  if(this.order == '+' ||(Number.isInteger(this.order) && this.order>0))
    return 'ascending'
  if(this.order == '-' || (Number.isInteger(this.order) &&this.order<0))
    return 'descending'
  return this.order
}
Interval.prototype.setSemitonesFromName = function(){
  let x = this.number-1
  let semitones = 0;
  let i = 1

  if(this.number<=8){
    semitones = Theory.intervalsDict[this.name]
  }
  else{
    while(x>=7){
      x-=7
      semitones+=12
    }

    let r = this.quality + (this.number%7 )
    semitones+= Theory.intervalsDict[r]
  }
  
  return semitones
}
//if the interval is not defined, all the properties can be computed
// by specifying the 2 notes that form the interval
Interval.prototype.computeFromNotes = function(n1,n2){
  this.setIntervalInSemitones(n1,n2)
  this.setIntervalOrder(n1,n2);
  this.setIntervalNumber(n1,n2);
  this.setIntervalQuality(n1,n2);

  if(this.quality == undefined) this.quality = '$'
  this.name = ''+this.quality+''+this.number

  this.qualityText = Theory.intervalQualityDict[this.quality];
  this.numberText = Theory.intervalNumberDict[this.number];
  if(this.numberText == undefined)
    this.numberText = this.number + 'th'


}
Interval.prototype.displayNameAsText = function(){
  let order = this.getOrder()
  if(this.name == "P1" || this.name == "d2")
    order = ''
  if(this.numberText == undefined)
    return '?'
  return  order + " " + this.qualityText + " " + this.numberText
}
Interval.prototype.setIntervalInSemitones = function(note1,note2){
  let oct1 = note1.octave;
  let rootNote1 = note1.getRoot();
    
  let oct2 = note2.octave;
  let rootNote2 = note2.getRoot();

  let diff = Theory.notesOrder[rootNote2] - Theory.notesOrder[rootNote1] + (oct2-oct1)*12
  this.semitones = diff
}
//Sets the interval's numbery (2nd,third...)
Interval.prototype.setIntervalNumber = function(note1, note2){
  let oct1 = note1.octave;
  let rootNote1 = note1.getRootBaseNote();

  let oct2 = note2.octave;
  let rootNote2 = note2.getRootBaseNote();

  let diff = Theory.wholeNotesOrder[rootNote2] - Theory.wholeNotesOrder[rootNote1] + 1 + (oct2-oct1)*7

  //special case for ##
  if(oct1 == oct2 && diff>7)
    diff-=7

  if (oct2>oct1 || (oct2 == oct1 && Theory.wholeNotesOrder[rootNote2] >= Theory.wholeNotesOrder[rootNote1])){
    this.number = diff 
  }
  else{
    //console.log(2-diff)
    this.number =  (2-diff)
  } 
}
//Sets the interval's quality (minor, major, perfect...)
Interval.prototype.setIntervalQuality = function(note1,note2){
  let oct1 = note1.octave;
  let rootNote1 = note1.getRoot();

  let oct2 = note2.octave;
  let rootNote2 = note2.getRoot();

  let nb = this.number>=7? Math.abs(this.number)%7  :Math.abs(this.number)

  let semitones = Math.abs(this.semitones)%12

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
  this.quality =  quality 
}
//Sets the interval order (ascending, descending)
Interval.prototype.setIntervalOrder = function(note1,note2){
  let interval = this.semitones

  if (interval>0)
    this.order =  'ascending'
  else if (interval < 0)
    this.order =  'descending'
  else{
    this.order = ''
    let note1BaseName =note1.rootBaseNote
    let note2BaseName =note2.rootBaseNote

    let diff = Theory.wholeNotesOrder[note2BaseName] - Theory.wholeNotesOrder[note1BaseName] 
    if(diff<-7)
      diff+=7
    if(diff>7)
      diff-=7
    this.order = diff>=0?'ascending':'descending'
  }  
}
Interval.prototype.invert = function(){
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

  this.parseName(this.name, this.order)
  console.log(this.name)

  if(this.n1 && this.n2){
    this.n1 = this.n2;
    this.n2 = this.n2.plusInterval(this);
  }
  
  return this
}
module.exports = Interval