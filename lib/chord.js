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
    this[_symbols] = 'no name';
    this[_name] = name || 'no name';
    this[_notes] = []
    this[_intervals] = []
    this[_notes] = arg1.map(note => Helpers.isNote(note)? note : new Note(note))
    //Duplicate of the name, for debugging purpose, is public but has no impact on anything
    this.chord = this.getNotesName();
    //Standard name function for all objects
    this.name =  this.getName()
    return this
  }
  //if there is only one argument, assume it represents both the root and name in one combined string
  if(name == undefined){
    let parsed = parseRootPlusName(arg1)
    name = parsed[1]
    arg1 = parsed[0]
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
  this.name =  n
}
//Public 
//Getters
Chord.prototype.getTonic = function(){return this[_tonic]}
Chord.prototype.getSymbols = function(){return this[_symbols]}
Chord.prototype.getName = function(){return this[_name]}
Chord.prototype.getNotes = function(){return this[_notes]}
Chord.prototype.getIntervals = function(){return this[_intervals]}
Chord.prototype.getNotesName = function(){return this.getNotes().map(n => n.getName())};
Chord.prototype.getNotesFrequencies = function(){return this.getNotes().map(n => n.getFrequency())};

Chord.prototype.transpose = function(interval,order){
  let notes = this.getNotes().map(x => x.plusInterval(interval,order))
  setNotes(this,notes)
  setName(this,notes[0].getName())
}

//Private
//Setters
const setTonic = function(chord,newTonic){chord[_tonic] = newTonic}
const setSymbols = function(chord,newSymbols){chord[_symbols] = newSymbols}
const setName = function(chord,newName){chord[_name] = newName}
const setNotes = function(chord,newNotes){chord[_notes] = newNotes}
const setIntervals = function(chord,newIntervals){chord[_intervals] = newIntervals}

const parseName = function(n){
  //special case for powerchords, if the first char is a 5
  let powerchord = false;
  if(n.charAt(1) == '5')
    powerchord = true;

  let no = n.match(/no\d+/g)
  n = n.replace(/no\d+/g,'');

  let slash = n.match(/\/[^0-9]+/g)
  n = n.replace(/\/[^0-9]+/g,'');


  let majx = n.match(/(Major|Maj|maj|M|Δ|Ma|Δ)\d+|Δ/g)
  n = n.replace(/(Major|Maj|maj|M|Δ|Ma|Δ)\d+|Δ/g,'');

  let otherNum = n.match(/[^♯♭b#sd]\d+/g)

  let aug = n.match(/(♯♯|##|Aug|aug|Augmented|augmented|\+)/g)
  n = n.replace(/(♯♯|##|Aug|aug|Augmented|augmented|\+)/g,'');
  
  let dom = n.match(/(dom|Dom|dominant|Dominant)/g)
  n = n.replace(/(dom|Dom|dominant|Dominant)/g,'');

  let halfDim = n.match(/ø|Ø|hdin|halfDim/g)
  n = n.replace(/ø|Ø|hdin|halfDim/g,'');

  //the o symbol is problematic as it can appear in a bunch of places. Make sure its not the o in major, minor, do or sol
  let dim = n.match(/(♭♭|bb|Dim|dim|Diminished|diminished|°|[^jnDSds]o)♭*b*♯*#*\d*/g)
  //dont remove the b&# as we need them to add the note later
  n = n.replace(/(♭♭|bb|Dim|dim|Diminished|diminished|°|[^jnDSds]o)\d*/g,'');

  let major = n.match(/M|Major|major|maj/g)
  //dont remove M, as it is present in Minor
  n = n.replace(/Major|major|maj/g,'');

  let minor = n.match(/(m|min|Min|minor|Minor|-)/g)
  n = n.replace(/(m|min|Min|minor|Minor|-)/g,'');
 
  //look for add
  let add = n.match(/(\/|add(b*|#*|♭*|♯*))\d+/g)
  n = n.replace(/(\/|add(b*|#*|♭*|♯*))\d+/g,'');

  //look for #/b
  let sharps = n.match(/(♯|#|sharp)\d+/g)
  let flats = n.match(/(♭|b|flat)\d+/g)
  
  //look for sus
 
  let sus = n.match(/sus\d*/g)
 
  return {
    major,
    minor,
    majx,
    otherNum,
    dim,
    aug,
    dom,
    halfDim,
    sharps,
    flats,
    add,
    sus,
    powerchord,
    no,
    slash
  }
}
const parseRootPlusName = function(n){
  let root,alt =' ',name;

  root = n.match(/^(Do|do|Re|re|Mi|mi|Fa|fa|Sol|sol|La|la|Si|si|A|a|B|b|C|c|D|d|E|e|F|f|G|g)#*b*♯*♭*/g)[0]
  n = n.replace(/^(Do|do|Re|re|Mi|mi|Fa|fa|Sol|sol|La|la|Si|si|A|a|B|b|C|c|D|d|E|e|F|f|G|g)#*b*♯*♭*/g,'');
  return [root,n]
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
  if(parsed['majx'] != null){
    for(let i = 0;i<parsed['majx'].length;i++){
      let nb = parsed['majx'][i].match(/\d+/g)

      intervals = addToIntervals(intervals,'M3')
      intervals = addToIntervals(intervals,'P5')
      
      if(nb == undefined){
        intervals = addToIntervals(intervals,'M7')
      }
      else if(nb == 6){
        intervals = addToIntervals(intervals,'M6')
      }
      else{
        for(let j = 7;j<=nb;j+=2){
          let q = j%7 == 4 ? 'P':'M'
          intervals = addToIntervals(intervals,q+j)
        }
      }
    }
  }
  if(parsed['minor'] != null){
    intervals = addToIntervals(intervals,'m3')
    intervals = addToIntervals(intervals,'P5')
  }
  if(parsed['aug'] != null){
    intervals = addToIntervals(intervals,'M3')
    intervals = addToIntervals(intervals,'A5')
  }
  if(parsed['halfDim'] != null){
    intervals = addToIntervals(intervals,'m3')
    intervals = addToIntervals(intervals,'d5')
    intervals = addToIntervals(intervals,'m7')
  }
  if(parsed['sharps'] != null){
    for(let i = 0;i<parsed['sharps'].length;i++){
      let s = parsed['sharps'][i].match(/\d+/g)
      if(s == 7)
      intervals = addToIntervals(intervals,'M7')
      else{
        intervals = addToIntervals(intervals,'A'+s)
      }
    }
  }
  if(parsed['flats'] != null){
    for(let i = 0;i<parsed['flats'].length;i++){
      let f = parsed['flats'][i].match(/\d+/g)
      if(f % 7 == 1 || f % 7 == 4 ||f % 7 ==5)
        intervals = addToIntervals(intervals,'d'+f)
      else
        intervals = addToIntervals(intervals,'m'+f)
    }
  }
  if(parsed['add']!= null){
    for(let i = 0;i<parsed['add'].length;i++){
      let s = parsed['add'][i].match(/\d+/g)
      let altb = parsed['add'][i].match(/b+|♭+/g)
      let alts = parsed['add'][i].match(/#+|♯+/g)
      let quality = (s % 7 == 1 || s % 7 == 4) ? 'P': 'M'
      if(altb)
        quality = (s % 7 == 1 || s % 7 == 4) ? 'd': 'm'
      else if (alts)
        quality = (s % 7 == 0) ? 'M': 'A'

      intervals = addToIntervals(intervals,quality+s)
    }
  }
  if(parsed['dim'] != null){
    intervals = addToIntervals(intervals,'m3')
    intervals = addToIntervals(intervals,'d5')

    let nb = parsed['dim'][0].match(/\d+/)
    if(nb == 3)
      intervals = addToIntervals(intervals,'d3')
    if(nb>=7)
      intervals = addToIntervals(intervals,'d7')
  }
  if(parsed['sus'] != null){
    for(let i = 0;i<parsed['sus'].length;i++){
      let s = parsed['sus'][i].match(/\d+/g)
      intervals = removeArray(intervals,'m3')
      intervals = removeArray(intervals,'M3')
      
      if(s == 2 || s == 9)
        intervals = addToIntervals(intervals,'M2')
      else if (s == 4  )
        intervals = addToIntervals(intervals,'P4')
      else if(s ==24){
        intervals = addToIntervals(intervals,'M2')
        intervals = addToIntervals(intervals,'P4')
      }
      else if (s == null)
        intervals = addToIntervals(intervals,'P4')
    } 
  }
  if(parsed['dom'] != null){
    intervals = addToIntervals(intervals,'M3')
    intervals = addToIntervals(intervals,'m7')
  }
  if(parsed['powerchord']){
    intervals = removeArray(intervals,'m3')
    intervals = removeArray(intervals,'M3')
    intervals = addToIntervals(intervals,'P8')
  }
  if(parsed['no'] != null){
    for(let i=0;i<parsed['no'].length;i++){
      let nb = parsed['no'][i].match(/\d+/)
      intervals = removeArray(intervals,'d'+nb)
      intervals = removeArray(intervals,'m'+nb)
      intervals = removeArray(intervals,'M'+nb)
      intervals = removeArray(intervals,'P'+nb)
      intervals = removeArray(intervals,'A'+nb)
    }
  }

  intervals = sortIntervals(intervals)
  setIntervals(chord,intervals)

  let tonic = chord.getTonic()
  let notes = intervals.map(x => tonic.plusInterval(x))
  setNotes(chord,notes)

  if(parsed['slash'] != null){
    let note = parsed['slash'][0].replace(/\//,'')

    let index = hasNote(chord,note)
    if(index>0){
      let n = notes[index].plusInterval('P8','descending')
      notes.unshift(n)
      notes.splice(index+1,1)

      let interval = intervals[index]
      let newInterval = new Interval(interval).invert()
      intervals.unshift('-' + newInterval.getName())
      intervals.splice(index+1,1)

      setIntervals(chord,intervals)
      setNotes(chord,notes)
    }
    else if (index<0){

      let newInterval = new Interval(tonic, note + (tonic.getOctave()-1))
      intervals.unshift('-' + newInterval.getName())

      let n = tonic.plusInterval(newInterval,'descending')
      notes.unshift(n)

      setIntervals(chord,intervals)
      setNotes(chord,notes)
    }
  }
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
  return intervals.reduce(function(hasNumber,interval){
    return hasNumber || (parseInt(interval.slice(1)) == number)
  },false)
}
const hasNote = function(chord,note){
  let notes = chord.getNotesName()
  for(let i = 0;i<notes.length;i++){
    if(notes[i].replace(/\d+/,'') == note)
      return i;
  }
  return -1;
}
