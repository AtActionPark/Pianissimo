(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.module = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Interval = require('./interval');
var Helpers = require('./helper');
var Theory = require('./theory');

module.exports = Chord

var _tonic = Symbol('tonic')
var _name = Symbol('notes')
var _symbols = Symbol('notes')
var _notes = Symbol('notes')
var _intervals = Symbol(' intervals')

function Chord(arg1,name){
  var Note = require('./note');
  //if the first arg is an array, assume that we want to build he chord with an array of notes
  if(Array.isArray(arg1)){
    //for each note in the array, we'll need to check if its a note object or a note name, and act accordingly
    this[_tonic] = Helpers.isNote(arg1[0])? arg1[0]: new Note(arg1[0]);
    this[_symbols] = '?';
    this[_name] = name;
    this[_notes] = []
    this[_intervals] = []
    for(let i = 0;i<arg1.length;i++){
      this[_notes].push(Helpers.isNote(arg1[i])? arg1[i]: new Note(arg1[i]));
    }
    //Duplicate of the name, for debugging purpose, is public but has no impact on anything
    this.chord = this.getNotesName();
    //Standard name function for all objects
    this.name =  this.getName()
    return this
  }
  if(!Helpers.isNote(arg1))
    arg1 = new Note(arg1);

  this[_tonic] = arg1;
  this[_symbols] = name;
  this[_name] = this.getTonic().getRoot() + this.getSymbols();
  this[_notes] = [];
  this[_intervals] = [];


  //parse everything we can find in the name
  let n = this.getName();
  let parsedName = parseName(n)
  
  buildChord(this,parsedName)

  //Duplicate of the name, for debugging purpose, is public but has no impact on anything
  this.chord = this[_notes];
  //Standard name function for all objects
  this.name = this.getTonic().getName() + ' ' + n
}
//Public 
//Getters
Chord.prototype.getTonic = function(){return this[_tonic]}
Chord.prototype.getSymbols = function(){return this[_symbols]}
Chord.prototype.getName = function(){return this[_name]}
Chord.prototype.getNotes = function(){return this[_notes]}
Chord.prototype.getIntervals = function(){return this[_intervals]}
Chord.prototype.getNotesName = function(){return this.getNotes().map(n => n.getName())};


//Private
//Setters
const setTonic = function(chord,newTonic){chord[_tonic] = newTonic}
const setSymbols = function(chord,newSymbols){chord[_symbols] = newSymbols}
const setName = function(chord,newName){chord[_name] = newName}
const setNotes = function(chord,newNotes){chord[_notes] = newNotes}
const setIntervals = function(chord,newIntervals){chord[_intervals] = newIntervals}

const parseName = function(n){
  //look for special cases with 7th first
  let dim7 = n.match(/(Dim7|dim7|Diminished7|dimished7|o7|°7)/g)
  n = n.replace('Dim7','');
  n = n.replace('dim7','');
  n = n.replace('Diminished7','');
  n = n.replace('diminished7','');
  let maj7 = n.match(/Major7|Maj7|maj7|M7|Δ7|Ma7|Δ/g)
  //maj7, M7 and min7 will be removed after beeing caught to not mess with the rest of the parsing
  n = n.replace('Major7','');
  n = n.replace('Maj7','');
  n = n.replace('maj7','');
  n = n.replace('Ma7','');
  n = n.replace('M7','');
  n = n.replace('Δ7','');
  n = n.replace('Δ','');

  let min7 = n.match(/min7|m7|-7/g)
  n = n.replace('min7','');
  n = n.replace('m7','');
  n = n.replace('-7','');

  let otherNum = n.match(/[^b]\d+/g)
  if(otherNum)
    otherNum = otherNum[0].match(/[^#]\d+/g)
  if(otherNum)
    otherNum = otherNum[0].match(/[^sus]\d+/g)
  if(otherNum)
    otherNum = otherNum[0].match(/[^add]\d+/g)

  
  //look for quality
  
  

  

  let aug = n.match(/(Aug|aug|Augmented|augmented|\+)/g)
  n = n.replace('Augmented','');
  n = n.replace('augmented','');
  let dom = n.match(/(dom|Dom|dominant|Dominant)/g)
  n = n.replace('dom','');
  n = n.replace('Dom','');
  n = n.replace('dominant','');
  n = n.replace('Dominant','');
  let halfDim = n.match(/ø|Ø/g)
  let dim = n.match(/(Dim|dim|Diminished|diminished|°|[^j^n]o)/g)
  n = n.replace('Dim','');
  n = n.replace('dim','');
  n = n.replace('Diminished','');
  n = n.replace('diminished','');

  let major = n.match(/M|Major|major|maj/g)
  n = n.replace('Major','');
  n = n.replace('major','');
  n = n.replace('maj','');
  let minor = n.match(/(m|min|Min|minor|Minor|-)/g)
  n = n.replace('m','');
  n = n.replace('minor','');
  n = n.replace('Minor','');
  n = n.replace('Min','');
  n = n.replace('-','');


  //look for add
  let adds = n.match(/add\d+/g)
  let addsb= n.match(/addb\d+/g)
  let addss = n.match(/add#\d+/g)
  n = n.replace('addb','');
  n = n.replace('add#','');

  //look for #/b
  let sharps = n.match(/(#|sharp)\d+/g)
  let flats = n.match(/(b|flat)\d+/g)
  
  //look for sus
  let sus = n.match(/sus\d+/g)
 
/*   console.log('major: ' + major)
  console.log('minor: ' + minor)
  console.log('maj7: ' + maj7)
  console.log('min7: ' + min7)
  console.log('otherNum: ' + otherNum)
  console.log('dim: ' + dim)
  console.log('aug: ' + aug)
  console.log('dom: ' + dom)
  console.log('halfDim: ' + halfDim)
  console.log('sharps: ' + sharps)
  console.log('flats: ' + flats)
  console.log('adds: ' + adds)
  console.log('addss: ' + addss)
  console.log('addsb: ' + addsb)
  console.log('sus: ' + sus)       */
 
  return {'major': major,
    'minor': minor,
    'maj7':maj7,
    'min7':min7,
    'otherNum':otherNum,
    'dim7':dim7,
    'dim':dim,
    'aug':aug,
    'dom':dom,
    'halfDim':halfDim,
    'sharps':sharps,
    'flats':flats,
    'adds':adds,
    'addsb':addsb,
    'addss':addss,
    'sus':sus}
}
const buildChord = function(chord,parsed){
  let intervals = ['P1','M3','P5']
  if(parsed['otherNum'] != null){
    for(let i = 0;i<parsed['otherNum'].length;i++){
      let num = parsed['otherNum'][i].slice(1)
      if(num>8){
        intervals = addToIntervals(intervals,'m7')
        for(let j=9;j<=num;j+=2){
          let quality =(j % 7 == 1 ||j % 7 == 4|| j % 7 == 5) ? 'P': 'M'
          intervals = addToIntervals(intervals,quality+j)
        }
      }
      if(num == 7){
        intervals = addToIntervals(intervals,'M3')
        intervals = addToIntervals(intervals,'P5')
        intervals = addToIntervals(intervals,'m7')
      }
      if(num == 6){
        intervals = addToIntervals(intervals,'M3')
        intervals = addToIntervals(intervals,'P5')
        if(parsed['otherNum'][i].charAt(0) == 'm' ||parsed['otherNum'][i].charAt(0) == 'b'){
          intervals = addToIntervals(intervals,'m3')
          intervals = addToIntervals(intervals,'M'+num)
        }
          
        else
          intervals = addToIntervals(intervals,'M'+num)
      }
    }  
  }
  if(parsed['major'] != null){
    intervals = addToIntervals(intervals,'M3')
    intervals = addToIntervals(intervals,'P5')
  }
  if(parsed['maj7'] != null){
    intervals = addToIntervals(intervals,'M3')
    intervals = addToIntervals(intervals,'P5')
    intervals = addToIntervals(intervals,'M7')
  }
  if(parsed['minor'] != null){
    intervals = addToIntervals(intervals,'m3')
    intervals = addToIntervals(intervals,'P5')
  }
  if(parsed['min7'] != null){
    intervals = addToIntervals(intervals,'m3')
    intervals = addToIntervals(intervals,'P5')
    intervals = addToIntervals(intervals,'m7')
  }
  if(parsed['dim7'] != null){
    intervals = addToIntervals(intervals,'m3')
    intervals = addToIntervals(intervals,'d5')
    intervals = addToIntervals(intervals,'d7')
  }
  if(parsed['dim'] != null){
    intervals = addToIntervals(intervals,'m3')
    intervals = addToIntervals(intervals,'d5')
  }
  if(parsed['aug'] != null){
    intervals = addToIntervals(intervals,'M3')
    intervals = addToIntervals(intervals,'A5')
  }
  if(parsed['dom'] != null){
    intervals = addToIntervals(intervals,'M3')
    intervals = addToIntervals(intervals,'m7')
  }
  if(parsed['halfDim'] != null){
    intervals = addToIntervals(intervals,'m3')
    intervals = addToIntervals(intervals,'d5')
    intervals = addToIntervals(intervals,'m7')
  }
  if(parsed['sharps'] != null){
    for(let i = 0;i<parsed['sharps'].length;i++){
      let s = parsed['sharps'][i].slice(1)
      if(s == 7)
      intervals = addToIntervals(intervals,'M7')
      else{
        if(s>8){

          if(!hasNumber(intervals,7))
            intervals = addToIntervals(intervals,'m7')
          for(let i=9;i<s;i+=2){
            let quality =(i % 7 == 1 || i % 7 == 4|| i % 7 == 5) ? 'P': 'M'
            intervals = addToIntervals(intervals,quality+i)
          }
        }
        intervals = addToIntervals(intervals,'A'+s)
      }
    }
  }
  if(parsed['flats'] != null){
    for(let i = 0;i<parsed['flats'].length;i++){
      let f = parsed['flats'][i].slice(1)

      if(f>8){
        intervals = addToIntervals(intervals,'m7')
        for(let i=11;i<f;i+=2){
          let quality =(i % 7 == 1 || i % 7 == 4) ? 'P': 'M'
          intervals = addToIntervals(intervals,quality+i)
        }
      }
      if(f % 7 == 1 || f % 7 == 4 ||f % 7 ==5)
        intervals = addToIntervals(intervals,'d'+f)
      else
        intervals = addToIntervals(intervals,'m'+f)
    }
  }
  if(parsed['adds']!= null){
    for(let i = 0;i<parsed['adds'].length;i++){
      let s = parsed['adds'][i].slice(3)
      let quality = (s % 7 == 1 || s % 7 == 4) ? 'P': 'M'
      intervals = addToIntervals(intervals,quality+s)
    }
  }
  if(parsed['addsb']!= null){
    for(let i = 0;i<parsed['addsb'].length;i++){
      let s = parsed['addsb'][i].slice(4)
      let quality = (s % 7 == 1 || s % 7 == 4) ? 'd': 'm'
      intervals = addToIntervals(intervals,quality+s)
    }
  }
  if(parsed['addss']!= null){
    for(let i = 0;i<parsed['addss'].length;i++){
      let s = parsed['addss'][i].slice(4)
      if(s % 7 == 0){
        intervals = addToIntervals(intervals,'M'+f)
      }
      else
        intervals = addToIntervals(intervals,'A'+s)
    }
  }
  if(parsed['sus'] != null){
    for(let i = 0;i<parsed['sus'].length;i++){
      let s = parsed['sus'][i].slice(3)
      intervals = removeArray(intervals,'m3')
      intervals = removeArray(intervals,'M3')

      if(s == 2)
        intervals = addToIntervals(intervals,'M'+s)
      else if (s == 4)
        intervals = addToIntervals(intervals,'P'+s)
    }
  }
  
  intervals = sortIntervals(intervals)
  setIntervals(chord,intervals)
  let notes = [chord.getTonic()]
  for(let i = 1;i<intervals.length;i++){
    notes.push(chord.getTonic().plusInterval(intervals[i]))
  }
  
  setNotes(chord,notes)
}
const removeArray = function(arr,el){
  var index = arr.indexOf(el);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr
}
const addToIntervals = function(intervals,interval){
  //intervals = removeArray(intervals,interval)
  let nb = interval.slice(1)
  if(hasNumber(intervals,nb)){
    intervals = removeArray(intervals,'m'+nb)
    intervals = removeArray(intervals,'M'+nb)
    intervals = removeArray(intervals,'d'+nb)
    intervals = removeArray(intervals,'P'+nb)
    intervals = removeArray(intervals,'A'+nb)
  }
  intervals.push(interval)
  return intervals
}
const sortIntervals = function(intervals){
  intervals = intervals.sort(function(a, b){
    var nameA=parseInt(a.match(/\d+/)), nameB=parseInt(b.match(/\d+/));
    if (nameA < nameB) //sort string ascending
     return -1;
    if (nameA > nameB)
     return 1;
    return 0; //default return value (no sorting)
   });
   return intervals
} 
const hasNumber = function(intervals,number){
  let result= false;
  for(let i = 0;i<intervals.length;i++){
    if(parseInt(intervals[i].slice(1)) == number )
      result = true;
  }
  return result
}

},{"./helper":2,"./interval":3,"./note":4,"./theory":6}],2:[function(require,module,exports){
'use strict';
var Note = require('./note');
var Theory = require('./theory');

//Helpers
module.exports = {
  getRandomInt(a,b){
    return Math.floor(Math.random()*(b - a + 1)) + a;
  },
  pickRandomProperty(obj) {
      let keys = Object.keys(obj)
      return keys[ keys.length * Math.random() << 0 ];
  },
  pickRandomArray(arr) {
      return arr[arr.length * Math.random() << 0 ];
  },
  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  },
  isNote(obj){
    return typeof obj == 'object' && obj.getRootAsLetter() != undefined
  },
  isValidNoteName(name){
    return Theory.wholeNotesOrder[name] != undefined || this.getKeyByValue(Theory.letterToName,name.toLowerCase()) != undefined
  },
  isValidNoteNotation(name){
    if(this.isNote(name))
      return true
    let rootRe = new RegExp('[^0-9#bx)]+','g')
    let root = name.match(rootRe)[0]
    return Theory.wholeNotesOrder[root] != undefined || this.getKeyByValue(Theory.letterToName,root.toLowerCase()) != undefined
  },
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  isInterval(name){
    let quality = name.slice(0,1)
    let nb = name.slice(1)

    return (quality == P ||
            quality == M ||
            quality == m ||
            quality == d ||
            quality == A) &&
            Number.isInteger(parseInt(nb))
  }
}
    
},{"./note":4,"./theory":6}],3:[function(require,module,exports){
'use strict';
var Helpers = require('./helper');
var Theory = require('./theory');

//Use symbols for emulating private variables
var _name = Symbol('name');
var _semitones = Symbol('semitones');
var _order = Symbol('order');
var _number = Symbol('number');
var _quality = Symbol('quality');
var _qualityText = Symbol('qualityText');
var _numberText = Symbol('numberText');
var _note1 = Symbol('note1');
var _note2 = Symbol('note2');

exports = module.exports = Interval


//The interval can be specified by givin a name (m2, P5, M9...) and order (ascending, descending)
// or by giving 2 notes
//Accepted names are a combination of quality (P,M,m,A,d) and note name(C,Db,F#,Solbb ...)
function Interval(arg1,arg2){
  var Note = require('./note');
  
  if(Helpers.isNote(arg1) && Helpers.isNote(arg2)){
    this[_note1] = arg1
    this[_note2] = arg2
    computeFromNotes(this)
  }
  
  else if(Helpers.isNote(arg1)  && Helpers.isValidNoteNotation(arg2)){
    this[_note1] = arg1;
    this[_note2] = new Note(arg2);
    computeFromNotes(this)
  }
  else if(Helpers.isValidNoteNotation(arg1) && arg2 && Helpers.isNote(arg2)){
    this[_note1] = new Note(arg1);
    this[_note2] = arg2;
    computeFromNotes(this)
  }
  else if(Helpers.isValidNoteNotation(arg1) && arg2 && Helpers.isValidNoteNotation(arg2)){
    this[_note1] = new Note(arg1);
    this[_note2] = new Note(arg2);
    computeFromNotes(this)
  }
  else{
    this[_name] = arg1;
    this[_order] = arg2;
  
    parseName(this,this.getName(),this.getOrder())
  }
  

  //Duplicate of the name, for debugging purpose, is public but has no impact on anything
  this.interval = this[_name];
  //Standard name function for all objects
  this.name = this.getName
}

//Public getters
Interval.prototype.getName = function(){return this[_name]}; 
Interval.prototype.getSemitones = function(){return this[_semitones]}; 
Interval.prototype.getOrder = function(){return this[_order]}; 
Interval.prototype.getNumber = function(){return this[_number]}; 
Interval.prototype.getQuality = function(){return this[_quality]}; 
Interval.prototype.getQualityText = function(){return this[_qualityText]}; 
Interval.prototype.getNumberText = function(){return this[_numberText]}; 
Interval.prototype.getNote1 = function(){return this[_note1]}; 
Interval.prototype.getNote2 = function(){return this[_note2]}; 
Interval.prototype.getNotes = function(){return [this[_note1], this[_note2]]}
Interval.prototype.getNotesName = function(){return [this[_note1].getName(), this[_note2].getName()]}
//return the order as "ascending" or "descending"
Interval.prototype.getOrderAsString = function(){
  if(this.getOrder() == '+' ||(Number.isInteger(this.getOrder()) && this.getOrder()>0))
    return 'ascending'
  if(this.getOrder() == '-' || (Number.isInteger(this.getOrder()) && this.getOrder()<0))
    return 'descending'
  return this.getOrder()
}
//Inverts the interval and returns it
Interval.prototype.invert = function(){
  //an interval number and its inversion add up to 9
  // for compound intervals, remove the octaves
  let newNumber = 9-this.getNumber() %7

  let newQuality = 'P';
  if(this.getQuality() == 'm') 
    newQuality = 'M'
  if(this.getQuality() == 'M') 
    newQuality = 'm'
  if(this.getQuality() == 'd') 
    newQuality = 'A'
  if(this.getQuality() == 'A') 
    newQuality = 'd'

  parseName(this,newQuality+newNumber, this.getOrder())

  if(this.getNote1() && this.getNote2()){
    setNote1(this,this.getNote2());
    setNote2(this, this.getNote2().plusInterval(this));
  }
  
  return this
}


//Privates
//Setters
const setName = function(interval,newName){interval[_name] = newName};
const setSemitones = function(interval,newSemitones){interval[_semitones] = newSemitones};
const setOrder = function(interval,newOrder){interval[_order] = newOrder};
const setNumber = function(interval,newNumber){interval[_number] = newNumber};
const setQuality = function(interval,newQuality){interval[_quality] = newQuality};
const setQualityText = function(interval,newQualityText){interval[_qualityText] = newQualityText};
const setNumberText = function(interval,newNumberText){interval[_numberText] = newNumberText};
const setNote1 = function(interval,newNote1){interval[_note1] = newNote1};
const setNote2 = function(interval,newNote2){interval[_note2] = newNote2};

const displayNameAsText = function(interval){
  let order = interval.getOrderAsString()
  if(interval.getName() == "P1" || interval.getName() == "d2")
    order = ''
  if(interval.getNumberText() == undefined)
    return '?'
  return  order + " " + interval.getQualityText() + " " + interval.getNumberText()
}
//if the interval is not defined, all the properties can be computed
// by specifying the 2 notes that form the interval
const computeFromNotes = function(interval){
  setIntervalInSemitones(interval)
  setIntervalOrder(interval);
  setIntervalNumber(interval);
  setIntervalQuality(interval);
  
  setName(interval,''+interval.getQuality()+''+interval.getNumber())

  setQualityText(interval,Theory.intervalQualityDict[interval.getQuality()]);
  setNumberText(interval, Theory.intervalNumberDict[interval.getNumber()]);
  if(interval.getNumberText() == undefined)
    setNumberText(interval, interval.getNumber() + 'th')
}
const setIntervalInSemitones = function(interval){
  let oct1 = interval.getNote1().getOctave();
  let rootNote1 = interval.getNote1().getRootAsLetter();
    
  let oct2 = interval.getNote2().getOctave();
  let rootNote2 = interval.getNote2().getRootAsLetter();

  let diff = Theory.notesOrder[rootNote2] - Theory.notesOrder[rootNote1] + (oct2-oct1)*12
  setSemitones(interval,diff);
}
//Sets the interval's numbery (2nd,third...)
const setIntervalNumber = function(interval){
  let oct1 = interval.getNote1().getOctave();
  let rootNote1 =interval.getNote1().getRootNameAsLetter();

  let oct2 = interval.getNote2().getOctave();
  let rootNote2 = interval.getNote2().getRootNameAsLetter();

  let diff = Theory.wholeNotesOrder[rootNote2] - Theory.wholeNotesOrder[rootNote1] + 1 + (oct2-oct1)*7

  //special case for ##
  if(oct1 == oct2 && diff>7)
    diff-=7

  if (oct2>oct1 || (oct2 == oct1 && Theory.wholeNotesOrder[rootNote2] >= Theory.wholeNotesOrder[rootNote1])){
    setNumber(interval,diff) 
  }
  else{
    setNumber(interval,2-diff) 
  } 
}
//Sets the interval's quality (minor, major, perfect...)
const setIntervalQuality = function(interval){
  let oct1 = interval.getNote1().getOctave();
  let rootNote1 = interval.getNote1().getRootAsLetter();
    
  let oct2 = interval.getNote2().getOctave();
  let rootNote2 = interval.getNote2().getRootAsLetter();

  let nb = interval.getNumber() % 7
  let semitones = Math.abs(interval.getSemitones()) % 12

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
      else if(nb == 8 || nb ==  1)
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
  setQuality(interval, quality );
  if(interval.getQuality() == undefined) setQuality(interval, '$')
}
//Sets the interval order (ascending, descending)
const setIntervalOrder = function(interval){
  let semitones = interval.getSemitones()

  if (semitones>0)
    setOrder(interval,'ascending')
  else if (semitones < 0)
    setOrder(interval,'descending')
  else{
    setOrder(interval,'')
    let note1BaseName = interval.getNote1().getRootNameAsLetter()
    let note2BaseName = interval.getNote2().getRootNameAsLetter()

    let diff = Theory.wholeNotesOrder[note2BaseName] - Theory.wholeNotesOrder[note1BaseName] 
    if(diff<-7)
      diff+=7
    if(diff>7)
      diff-=7
    setOrder(interval,diff>=0?'ascending':'descending') 
  }  
}
const parseName = function(interval, name,order){
  setName(interval,name)
  setOrder(interval,order || 'ascending'); 

  let number = new RegExp('[0-9)]+','g')
  setNumber(interval,parseInt(interval.getName().match(number)[0]))

  let quality = new RegExp('[^0-9)]+','g')
  setQuality(interval,interval.getName().match(quality)[0])
  setSemitones(interval,(interval.getOrderAsString() == "ascending"? 1 : -1)*setSemitonesFromName(interval))
  setQualityText(interval, Theory.intervalQualityDict[interval.getQuality()]);
  setNumberText(interval, Theory.intervalNumberDict[interval.getNumber()]);
  if(interval.getNumberText() == undefined)
    setNumberText(interval, interval.getNumber() + 'th')
}
const setSemitonesFromName = function(interval){
  let x = interval.getNumber()-1

  let semitones = 0;
  let i = 1

  if(interval.getNumber()<=8){
    semitones = Theory.intervalsDict[interval.getName()]
  }
  else{
    while(x>=7){
      x-=7
      semitones+=12
    }

    let r = interval.getQuality() + (interval.getNumber()%7 )
    semitones+= Theory.intervalsDict[r]

  }
  return semitones
}



},{"./helper":2,"./note":4,"./theory":6}],4:[function(require,module,exports){
'use strict';
var Theory = require('./theory');
var Interval = require('./interval');
var Scale = require('./scale');
var Chord = require('./chord');
var Helpers = require('./helper');

//Use symbols for emulating private variables
var _name = Symbol('name');
var _root = Symbol('root');
var _rootName = Symbol('rootName');
var _alteration = Symbol('alteration');
var _octave = Symbol('octave');
var _notationType = Symbol('notationType');

exports = module.exports = Note

//name needs to be a capital letter + alterations/octave (D#2)  or a note name+ alt/octave (solb2)
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
  return Theory.wholeNotesOrder[this.getRootName()] != undefined? this.getRoot(): Theory.nameToLetter[this.getRootName().toLowerCase()]+this.getAlteration()
}
Note.prototype.getRootNameAsLetter = function(){
  return Theory.wholeNotesOrder[this.getRootName()] != undefined? this.getRootName(): Theory.nameToLetter[this.getRootName().toLowerCase()]
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
//Returns a Chord objet, with type as specified in argument, and the current note as the tonic
Note.prototype.toChord = function(type){
  return new Chord(this,type);
}
//Returns a Scale objet, with type as specified in argument, and the current note as the tonic
Note.prototype.toInterval = function(note){
  return new Interval(this,note);
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
    setRootName(note,Helpers.capitalizeFirstLetter( Theory.letterToName[note.getRootName()]))
    setRoot(note,note.getRootName()+note.getAlteration())
    setName(note,note.getRoot()+note.getOctave()) 
  }
}


},{"./chord":1,"./helper":2,"./interval":3,"./scale":5,"./theory":6}],5:[function(require,module,exports){
'use strict';
var Interval = require('./interval');
var Chord = require('./chord');
var Helpers = require('./helper');
var Theory = require('./theory');

exports = module.exports = Scale;

//Use symbols for emulating private variables
var _tonic = Symbol('tonic');
var _type = Symbol('type');
var _degree = Symbol('degree');
var _notes = Symbol('notes');

function Scale(tonic,type,degree){
    var Note = require('./note');

    this[_tonic] = Helpers.isNote(tonic)? tonic : new Note(tonic);
    this[_type] = type;
    this[_degree] = degree ||1;
    this[_notes] = [this.getTonic()];

    buildScale(this,this.getDegree());

    //Duplicate of the name, for debugging purpose, is public but has no impact on anything
    this.scale = this[_notes];
    //Standard name function for all objects
    this.name = this.getTonic().getName() + ' ' + this.getType()
}
//Public Getters
Scale.prototype.getTonic = function(){return this[_tonic]};  
Scale.prototype.getType = function(){return this[_type]};  
Scale.prototype.getDegree  = function(){return this[_degree]};  
Scale.prototype.getNotes  = function(){return this[_notes]};  
Scale.prototype.getNotesName = function(){return this.getNotes().map(n => n.getName())};

Scale.prototype.getChords = function(nb){
    //if no nb, assume triad
    nb = nb || 3
    let chords = []
    let length = this.getNotes().length
    let root = this.getTonic().getRoot()

    for (let i = 0;i<length;i++){
        let notes = []
        for(let j = 0;j<nb;j++){
            let n = this.getNotes()[(2*j+i) % length]
            if(2*j+i > length){
                let times = Math.floor((2*j+i) / length)
                for(let k = 0;k<times;k++){
                    n = n.plusInterval('P8')
                }
            }
            notes.push(n)
        }
        let name = root + ' ' + this.getType()+ ' ' + Theory.scaleTones[i+1]
        chords.push( new Chord(notes,name))
    }
    return chords;
}

//Private
//Setters
const setType = function(scale,newType){scale[_type] = newType};
const setDegree = function(scale,newDegree){scale[_degree] = newDegree};
const setNotes = function(scale,newNotes){scale[_notes] = newNotes};

//Looks for the scale type in a dict and builds it on top of the tonic
const buildScale = function(scale,degree){
    //account for values > 7 
    degree = degree % 7;

    let scaleType = Theory.scalesDict[scale.getType().toLowerCase()];

    let notes = [scale.getTonic()]
    
    //Start at 1, as tonic is already included
    for(let i = 1;i<scaleType.length;i++)
        notes.push(notes[0].plusInterval(scaleType[i]));
    
    if(degree>1){
        //mode calculation, start by switching the order of the notes
        // ex: for C dorian (degree 2)
        // [C3,D3,E3,F3,G3,A3,B3] => [D3,E3,F3,G3,A3,B3,C4]
        for(let i = 0;i<degree-1;i++){
            notes.push(notes[0].plusInterval('P8'))
            notes.shift()
        }

        //then transpose all the notes to get back to the tonic
        for(let i = 0;i<notes.length;i++)
            notes[i] = notes[i].plusInterval(scaleType[degree-1], 'descending')
    }   
    //Add the octave to the notes list
    //notes.push(notes[0].plusInterval('P8'));
    //And replace the notes object of the scale
    setNotes(scale,notes);
}

},{"./chord":1,"./helper":2,"./interval":3,"./note":4,"./theory":6}],6:[function(require,module,exports){
'use strict';
module.exports = {
    fullNotesList : ['C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab','A','A#','Bb','B'],
    notesOrder : {
        'Cbb':-2,
        'Cb':-1,
        'C':0,
        'C#':1,
        'C##':2,
        'Cx':2,
        'Dbb':0,
        'Db':1,
        'D':2,
        'D#':3,
        'D##':4,
        'x':4,
        'Ebb':2,
        'Eb':3,
        'E':4,
        'E#':5,
        'E##':6,
        'Ex':6,
        'Fbb':3,
        'Fb':4,
        'F':5,
        'F#':6,
        'F##':7,
        'Fx':7,
        'Gbb':5,
        'Gb':6,
        'G':7,
        'G#':8,
        'G##':9,
        'Gx':9,
        'Abb':7,
        'Ab':8,
        'A':9,
        'A#':10,
        'A##':11,
        'Ax':11,
        'Bbb':9,
        'Bb':10,
        'B':11,
        'B#':12,
        'B##':13,
        'Bx':13
    },
    wholeNotesOrder : {
        'C':1,
        'D':2,
        'E':3,
        'F':4,
        'G':5,
        'A':6,
        'B':7
    },
    letterToName : {
        A:'la',
        B:'si',
        C:'do',
        D:'re',
        E:'mi',
        F:'fa',
        G:'sol'
    },
    nameToLetter : {
        'la':'A',
        'si':'B',
        'do':'C',
        're':'D',
        'mi':'E',
        'fa':'F',
        'sol':'G'
    },
    intervalQualityDict : {
        m: "minor",
        M: "major",
        P: "perfect",
        A: "augmented",
        d: "diminished",
        $: "magical"
    },
    intervalNumberDict : {
        1: "unison",
        2: "second",
        3: "third",
        4: "fourth",
        5: "fifth",
        6: "sixth",
        7: "seventh",
        8: "octave",
        9: "ninth",
        10: "tenth",
        11: "eleventh",
        12: "twelfth",
        13: "thirteenth",
        14: "fourteenth",
        15: "fifteenth",
    },
    intervalsDict : {
        'A0': 12,
        'm0': 10,
        'M0': 11,
        'd0': 9,
        'P1': 0,
        'd2': 0,
        'm2': 1,
        'A1': 1,
        'M2': 2,
        'd3': 2,
        'm3': 3,
        'A2': 3,
        'M3': 4,
        'd4': 4,
        'P4': 5,
        'A3': 5,
        'd5': 6,
        'A4': 6,
        'P5': 7,
        'd6': 7,
        'm6': 8,
        'A5': 8,
        'M6': 9,
        'd7': 9,
        'm7': 10,
        'A6': 10,
        'M7': 11,
        'd8': 11,
        'P8': 12,
        'A7': 12,
        'A8': 13
    },
    chordsDict : {
        'Major': ['M3','P5'],

        'Minor': ['m3','P5'],
        'm': ['m3','P5'],

        'Augmented': ['M3','A5'],
        'aug': ['M3','A5'],
        '+': ['M3','A5'],

        'Dimished': ['m3','D5'],
        'dim': ['m3','D5'],
        '°': ['m3','D5'],

        'SuspendedFourth': ['P4','P5'],
        'sus4': ['P4','P5'],
        'SuspendedSecond': ['M2','P5'],
        'sus2': ['M2','P5'],

        'MinorSixth': ['m3','P5','M6'],
        'm6': ['m3','P5','M6'],
        'MajorSixth': ['M3','P5','M6'],
        '6': ['M3','P5','M6'],
        'SixthAddNinth': ['M3','P5','M6','M9'],
        '6add9': ['M3','P5','M6','M9'],
        'Ninth': ['M3','P5','m7','M9'],
        '9': ['M3','P5','m7','M9'],
        'MinorNinth': ['m3','P5','m7','M9'],
        'm9': ['m3','P5','m7','M9'],
        'MajorNinth': ['M3','P5','M7','M9'],
        'm9': ['M3','P5','M7','M9'],

        'DominantSeventh': ['M3','P5','m7'],
        '7': ['M3','P5','m7'],
        'MinorSeventh': ['m3','P5','m7'],
        'm7': ['m3','P5','m7'],
        'MajorSeventh': ['M3','P5','M7'],
        'M7': ['M3','P5','M7'],

        'AugmentedDominantSeventh': ['M3','A5','m7'],
        'aug7': ['M3','A5','m7'],
        '+7': ['M3','A5','m7'],
        'AugmentedMinorSeventh': ['m3','A5','m7'],
        'augm7': ['m3','A5','m7'],
        '+m7': ['m3','A5','m7'],
        'AugmentedMajorSeventh': ['M3','A5','M7'],
        'augM7': ['M3','A5','M7'],
        '+M7': ['M3','A5','M7'],

        //dimished 7s
        'DiminishedSeventh': ['m3','d5','d7'],
        'dim7': ['m3','d5','d7'],
        '°7': ['m3','d5','d7'],
        // half dimished
        'MinorSeventhFlatFifth': ['m3','d5','m7'],
        'HalfDiminishedSeventh': ['m3','d5','m7'],
        'm7b5': ['m3','d5','m7'],
        'ø': ['m3','d5','m7'],
    },
    scalesDict:{
        //5 notes
        majorpentatonic: ['P1','M2', 'M3', 'P5', 'M6'],
        pentatonic: ['P1','M2', 'M3', 'P5', 'M6'],
        minorpentatonic: ['P1','m3', 'P4', 'P5', 'm7'],
        //6 notes
        blues: ['P1','m3', 'P4', 'd5', 'P5', 'm7'],
        wholetone: ['P1','M2', 'M3', 'A4', 'A5', 'A6'],
        augmented: ['P1','m3', 'M3', 'P5', 'A5', 'M7'],
        promotheus: ['P1','M2', 'M3', 'A4', 'M6', 'm7'],
        tritone: ['P1','m2', 'M2', 'A4', 'P5', 'm7'],
        //7 notes
        major: ['P1','M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
        minor: ['P1','M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
        melodicminor: ['P1','M2', 'm3', 'P4', 'P5', 'M6', 'M7'],
        harmonicminor: ['P1','M2', 'm3', 'P4', 'P5', 'm6', 'M7'],
        harmonicmajor: ['P1','M2', 'M3', 'P4', 'P5', 'm6', 'M7'],
        doubleharmonic: ['P1','m2', 'M3', 'P4', 'P5', 'm6', 'M7'],

        ionian: ['P1','M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
        dorian: ['P1','M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
        phrygian: ['P1','m2', 'm3', 'P4', 'P5', 'm6', 'm7'],
        lydian: ['P1','M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
        mixolydian: ['P1','M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
        aeolian: ['P1','M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
        locrian: ['P1','m2', 'm3', 'P4', 'd5', 'm6', 'm7'],

        enigmatic: ['P1','m2', 'M3', 'A4', 'A5', 'A6', 'M7'],
        halfdimished: ['P1','M2', 'm3', 'P4', 'd5', 'm6', 'm7'],
        hungarianminor: ['P1','M2', 'm3', 'A4', 'P5', 'm6', 'm7'],

        //8 notes
        octatonic: ['P1','m2', 'm3', 'M3','A4', 'P5', 'M6', 'm7'],
        diminished: ['P1','M2', 'm3', 'P4','A4', 'A5', 'M6', 'M7'],
        //12 notes
        chromatic: ['P1','m2', 'M2', 'm3', 'M3', 'P4','A4', 'P5', 'm6', 'M6', 'm7', 'M7'],
        
    },
    A4Freq:440,
    scaleTones:{
        1: 'tonic',
        2: 'supertonic',
        3: 'mediant',
        4: 'subdominant',
        5: 'dominant',
        6: 'submediant',
        7: 'leadingNote',
    }
}


},{}],7:[function(require,module,exports){
'use strict';

var Note = require('./lib/note');
var Interval = require('./lib/interval');
var Chord = require('./lib/chord');
var Scale = require('./lib/scale');
var Helpers = require('./lib/helper');
var Theory = require('./lib/theory');


function noteConstructor(name){
    return new Note(name)
}
function intervalConstructor(arg1,arg2){
    return new Interval(arg1,arg2)
}
function scaleConstructor(tonic,type){
    return new Scale(tonic,type)
}
function chordConstructor(arg1,arg2){
    return new Chord(arg1,arg2)
}
function getRandomNote(octave1,octave2){
    let note =  Helpers.pickRandomArray(Theory.fullNotesList)
    let octave = Helpers.getRandomInt(octave1,octave2)
  
    return new Note(note+octave)
}
function getRandomInterval(){
    let intervalName =  Helpers.pickRandomProperty(Theory.intervalsDict)
    let intervalOrder = Math.random()<0.5? 'ascending' : 'descending'
  
    return new Interval(intervalName, intervalOrder)
}
function setA4(frequency){
    Theory.A4Freq = frequency
}

let solfege = {
    note:noteConstructor,
    interval:intervalConstructor,
    scale:scaleConstructor,
    chord:chordConstructor,
    randomNote:getRandomNote,
    randomInterval:getRandomInterval,
    setA4:setA4,
    Note:Note,
    Interval:Interval,
    Chord:Chord,
    Scale:Scale,
}
exports = module.exports = solfege



let note = solfege.note('C3')
let chord = note.toChord('Ma7#9')

console.log(chord.getIntervals())
console.log(chord.getNotesName())
 



//sus24
//m6/9
//m#7
//C5 ?
//dom7dim5
//7/6






},{"./lib/chord":1,"./lib/helper":2,"./lib/interval":3,"./lib/note":4,"./lib/scale":5,"./lib/theory":6}]},{},[7])(7)
});