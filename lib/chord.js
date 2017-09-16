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
  let dim7 = n.match(/(Dim7|dim7|Diminished7|dimished7|o7|°7|bb7)/g)
  n = n.replace(/(Dim7|dim7|Diminished7|dimished7|o7|°7|bb7)/g,'');

  let maj9 = n.match(/Major9|Maj9|maj9|M9|Δ9|Ma9/g)
  n = n.replace(/Major9|Maj9|maj9|M9|Δ9|Ma9/g,'');

  let maj11 = n.match(/Major11|Maj11|maj11|M11|Δ11|Ma11/g)
  n = n.replace(/Major11|Maj11|maj11|M11|Δ11|Ma11/g,'');

  let maj13 = n.match(/Major13|Maj13|maj13|M13|Δ13|Ma13/g)
  n = n.replace(/Major13|Maj13|maj13|M13|Δ13|Ma13/g,'');

  let maj7 = n.match(/Major7|Maj7|maj7|M7|Δ7|Ma7|Δ/g)
  n = n.replace(/Major7|Maj7|maj7|M7|Δ7|Ma7|Δ/g,'');

  let min7 = n.match(/min7|m7|-7/g)
  n = n.replace(/min7|m7|-7/g,'');

  let otherNum = n.match(/[^b]\d+/g)
  if(otherNum)
    otherNum = otherNum[0].match(/[^#]\d+/g)
  if(otherNum)
    otherNum = otherNum[0].match(/[^sus]\d+/g)
  if(otherNum)
    otherNum = otherNum[0].match(/[^add]\d+/g)
  

  let aug = n.match(/(##|Aug|aug|Augmented|augmented|\+)/g)
  n = n.replace(/(##|Aug|aug|Augmented|augmented|\+)/g,'');
  
  let dom = n.match(/(dom|Dom|dominant|Dominant)/g)
  n = n.replace(/(dom|Dom|dominant|Dominant)/g,'');

  let halfDim = n.match(/ø|Ø|hdin|halfDim/g)
  let dim = n.match(/(bb|Dim|dim|Diminished|diminished|°|[^j^n]o)b*#*\d*/g)
  n = n.replace(/(bb|Dim|dim|Diminished|diminished|°|[^j^n]o)b*#*\d*/g,'');

  let major = n.match(/M|Major|major|maj/g)
  //dont remove M, as it is present in Minor
  n = n.replace(/Major|major|maj/g,'');

  let minor = n.match(/(m|min|Min|minor|Minor|-)/g)
  n = n.replace(/(m|min|Min|minor|Minor|-)/g,'');
 
  //look for add
  let adds = n.match(/(\/|add)\d+/g)
  let addsb= n.match(/(\/|addb)\d+/g)
  let addss = n.match(/(\/|add#)\d+/g)
  n = n.replace(/(\/|add)\d+/g,'');
  n = n.replace(/(\/|add#)\d+/g,'');
  n = n.replace(/(\/|addb)\d+/g,'');

  //look for #/b
  let sharps = n.match(/(#|sharp)\d+/g)
  let flats = n.match(/(b|flat)\d+/g)
  
  //look for sus
  let sus = n.match(/sus\d+/g)
  //sus not 2 or 4 
  let sus2 = n.match(/sus[^2^4]/g)
 
  return {'major': major,
    'minor': minor,
    'maj7':maj7,
    'maj9':maj9,
    'maj11':maj11,
    'maj13':maj13,
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
    'sus':sus,
    'sus2':sus2}
}
const buildChord = function(chord,parsed){
  let intervals = ['P1','M3','P5']
  if(parsed['otherNum'] != null){
    for(let i = 0;i<parsed['otherNum'].length;i++){
      let num = parsed['otherNum'][i].slice(1)
    //      if(num == 5 &&){
    //      intervals = removeArray(intervals,3)
    //    intervals = addToIntervals(intervals,'P8')
      //}
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
  if(parsed['maj9'] != null){
    intervals = addToIntervals(intervals,'M3')
    intervals = addToIntervals(intervals,'P5')
    intervals = addToIntervals(intervals,'M7')
    intervals = addToIntervals(intervals,'M9')
  }
  if(parsed['maj11'] != null){
    intervals = addToIntervals(intervals,'M3')
    intervals = addToIntervals(intervals,'P5')
    intervals = addToIntervals(intervals,'M7')
    intervals = addToIntervals(intervals,'M9')
    intervals = addToIntervals(intervals,'P11')
  }
  if(parsed['maj13'] != null){
    intervals = addToIntervals(intervals,'M3')
    intervals = addToIntervals(intervals,'P5')
    intervals = addToIntervals(intervals,'M7')
    intervals = addToIntervals(intervals,'M9')
    //should the 11th be added?
    intervals = addToIntervals(intervals,'P11')
    intervals = addToIntervals(intervals,'M13')
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
      let s = parsed['sharps'][i].match(/\d+/g)
      if(s == 7)
      intervals = addToIntervals(intervals,'M7')
      else{
        if(s>8){
          if(!hasNumber(intervals,7))
            intervals = addToIntervals(intervals,'m7')
        }
        intervals = addToIntervals(intervals,'A'+s)
      }
    }
  }
  if(parsed['flats'] != null){
    for(let i = 0;i<parsed['flats'].length;i++){
      let f = parsed['flats'][i].match(/\d+/g)

      if(f>8){
        intervals = addToIntervals(intervals,'m7')
      }
      if(f % 7 == 1 || f % 7 == 4 ||f % 7 ==5)
        intervals = addToIntervals(intervals,'d'+f)
      else
        intervals = addToIntervals(intervals,'m'+f)
    }
  }
  if(parsed['adds']!= null){
    for(let i = 0;i<parsed['adds'].length;i++){
      let s = parsed['adds'][i].match(/\d+/g)
      let quality = (s % 7 == 1 || s % 7 == 4) ? 'P': 'M'
      intervals = addToIntervals(intervals,quality+s)
    }
  }
  if(parsed['addsb']!= null){
    for(let i = 0;i<parsed['addsb'].length;i++){
      let s = parsed['addsb'][i].match(/\d+/g)
      let quality = (s % 7 == 1 || s % 7 == 4) ? 'd': 'm'
      intervals = addToIntervals(intervals,quality+s)
    }
  }
  if(parsed['addss']!= null){
    for(let i = 0;i<parsed['addss'].length;i++){
      let s = parsed['addss'][i].match(/\d+/g)
      if(s % 7 == 0){
        intervals = addToIntervals(intervals,'M'+f)
      }
      else
        intervals = addToIntervals(intervals,'A'+s)
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
    }
  }
  if(parsed['sus2'] != null){
    intervals = removeArray(intervals,'m3')
    intervals = removeArray(intervals,'M3')
    intervals = addToIntervals(intervals,'P4')
    if(parsed['sus2'][0] == 'b9'){
      intervals = addToIntervals(intervals,'M9')
    }
    
  }
  
  
  intervals = sortIntervals(intervals)
  //console.log(intervals)
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
