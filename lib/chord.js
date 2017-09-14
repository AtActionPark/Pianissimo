'use strict';

var Interval = require('./interval');
var Helpers = require('./helper');
var Theory = require('./theory');

module.exports = Chord

var _tonic = Symbol('tonic')
var _name = Symbol('notes')
var _symbols = Symbol('notes')
var _notes = Symbol('notes')

function Chord(arg1,name){
  var Note = require('./note');
  //if the first arg is an array, assume that we want to build he chord with an array of notes
  if(Array.isArray(arg1)){
    //for each note in the array, we'll need to check if its a note object or a note name, and act accordingly
    this[_tonic] = Helpers.isNote(arg1[0])? arg1[0]: new Note(arg1[0]);
    this[_symbols] = '?';
    this[_name] = name;
    this[_notes] = []
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
Chord.prototype.getNotesName = function(){return this.getNotes().map(n => n.getName())};




//Private
//Setters
const setTonic = function(chord,newTonic){chord[_tonic] = newTonic}
const setSymbols = function(chord,newSymbols){chord[_symbols] = newSymbols}
const setName = function(chord,newName){chord[_name] = newName}
const setNotes = function(chord,newNotes){chord[_notes] = newNotes}

const parseName = function(n){
  //look for special cases with 7th first
  let maj7 = n.match(/maj7|M7/g)
  //maj7, M7 and min7 will be removed after beeing caught to not mess with the rest of the parsing
  n = n.replace('maj7','');
  n = n.replace('M7','');

  let min7 = n.match(/min7/g)
  n = n.replace('min7','');

  let otherNum = n.match(/[^b]\d+/g)
  if(otherNum)
    otherNum = otherNum[0].match(/[^#]\d+/g)
  if(otherNum)
    otherNum = otherNum[0].match(/[^sus]\d+/g)
  if(otherNum)
    otherNum = otherNum[0].match(/[^add]\d+/g)

  
  //look for quality
  let major = n.match(/M|Major|major/g)
  n = n.replace('Major','');
  n = n.replace('major','');
  let minor = n.match(/(m|min|Min|minor|Minor)/g)
  n = n.replace('min','');
  n = n.replace('minor','');
  n = n.replace('Minor','');
  n = n.replace('Min','');
  let dim = n.match(/(Dim|dim|Diminished|dimished|o|°)/g)
  let aug = n.match(/(Aug|aug|Augmented|augmented|\+)/g)
  let dom = n.match(/(dom|Dom|dominant|Dominant)/g)
  let halfDim = n.match(/ø/g)


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
  console.log('sus: ' + sus) */

  return {'major': major,
    'minor': minor,
    'maj7':maj7,
    'min7':min7,
    'otherNum':otherNum,
    'dim':dim,
    'aug':aug,
    'dom':dom,
    'halfDim':halfDim,
    'sharps':sharps,
    'flats':flats,
    'adds':adds,
    'addsb':addsb,
    'addss':adds,
    'sus':sus}
}
const buildChord = function(chord,parsed){
  let intervals = ['P1','M3','P5']
  
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
  if(parsed['otherNum'] != null){
    for(let i = 0;i<parsed['otherNum'].length;i++){
      let num = parsed['otherNum'][i].slice(1)
      if(num>8){
        intervals = addToIntervals(intervals,'m7')
        for(let i=9;i<=num;i+=2){
          let quality =(i % 7 == 1 || i % 7 == 4|| i % 7 == 5) ? 'P': 'M'
          intervals = addToIntervals(intervals,quality+i)
        }
      }
      if(num == 7){
        intervals = addToIntervals(intervals,'M3')
        intervals = addToIntervals(intervals,'P5')
        intervals = addToIntervals(intervals,'m7')
      }
    }  
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
      if(s>8){
        intervals = addToIntervals(intervals,'m7')
        for(let i=9;i<s;i+=2){
          let quality =(i % 7 == 1 || i % 7 == 4|| i % 7 == 5) ? 'P': 'M'
          intervals = addToIntervals(intervals,quality+i)
        }
      }
      intervals = addToIntervals(intervals,'A'+s)
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
  if(parsed['adds#']!= null){
    for(let i = 0;i<parsed['adds#'].length;i++){
      let s = parsed['adds#'][i].slice(4)
      let quality = 'A'
      intervals = addToIntervals(intervals,quality+s)
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
  console.log(intervals)
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
