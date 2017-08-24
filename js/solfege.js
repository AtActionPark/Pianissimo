"use strict";
(function(){

  let rootNotes = {
    'C': 261.626,
    'C#':277.183,
    'D':293.665,
    'D#':311.127,
    'E':329.628,
    'F':349.228,
    'F#':369.994,
    'G':391.995,
    'G#':415.305,
    'A':440,
    'A#':466.164,
    'B':493.883
  }
  let enharmonics = {
    'Db': 'C#',
    'Eb': 'D#',
    'E#': 'F',
    'Fb': 'E',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#',
    'Cb': 'B',
    'B#': 'C',
    'C##': 'D',
    'Cbb': 'A#',
    'D##': 'E',
    'Dbb': 'C',
    'E##': 'F#',
    'Ebb': 'D',
    'F##': 'G',
    'Fbb': 'D#',
    'G##': 'A',
    'Gbb': 'F',
    'A##': 'B',
    'Abb': 'G',
    'B##': 'C#',
    'Bbb': 'A',
  }
  let fullNotesList = ['C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab','A','A#','Bb','B']
  ///INTERVALS///
  let notesOrder = {
    'Cbb':-2,
    'Cb':-1,
    'C':0,
    'C#':1,
    'C##':2,
    'Dbb':0,
    'Db':1,
    'D':2,
    'D#':3,
    'D##':4,
    'Ebb':2,
    'Eb':3,
    'E':4,
    'E#':5,
    'E##':6,
    'Fbb':3,
    'Fb':4,
    'F':5,
    'F#':6,
    'F##':7,
    'Gbb':5,
    'Gb':6,
    'G':7,
    'G#':8,
    'G##':9,
    'Abb':7,
    'Ab':8,
    'A':9,
    'A#':10,
    'A##':11,
    'Bbb':9,
    'Bb':10,
    'B':11,
    'B#':12,
    'B##':13
  }
  let wholeNotesOrder = {
    'C':1,
    'D':2,
    'E':3,
    'F':4,
    'G':5,
    'A':6,
    'B':7
  }
  let qualityDict = {
    m: "minor",
    M: "major",
    P: "perfect",
    A: "augmented",
    d: "diminished",
    $: "magical"
  }
  let numberDict = {
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
  }
  let intervalsDict = {
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
    'd9': 12,
    'm9': 13,
    'A8': 13,
    'M9': 14,
    'd10': 14,
    'm10': 15,
    'A9': 15,
    'M10': 16,
    'd11': 16,
    'P11': 17,
    'A10': 17,
    'd12': 18,
    'A11': 18,
    'P12': 19,
    'A13': 19,
    'm13': 20,
    'A12': 20,
    'M13': 21,
    'd14': 21,
    'm14': 22,
    'A13': 22,
    'M14': 23,
    'd15': 23,
    'P15': 24,
    'A14': 24
  }

  let Solfege = function(settings){
  }
  //Returns the frequency in Hz of a named note + octave (ex: C3, D#2, ...)
  Solfege.prototype.getFrequency = function(note){
    let oct = note.slice(-1);
    let rootNote = note.slice(0, -1);

    if("undefined" === typeof rootNotes[rootNote] ){
      if(rootNote === 'B#' || rootNote === 'B#'){
        return rootNotes[enharmonics[rootNote]]*Math.pow(2,(oct-2));
      }
      else if (rootNote === 'Cb' || rootNote === 'Cbb'){
        return rootNotes[enharmonics[rootNote]]*Math.pow(2,(oct-4));
      }
      else{
        return rootNotes[enharmonics[rootNote]]*Math.pow(2,(oct-3));
      }
    }
    else
      return rootNotes[rootNote]*Math.pow(2,(oct-3));
  }
  //Returns a random note between octave 1 and 2.
  //Only natural and sharps
  Solfege.prototype.getRandomNote = function(octave1,octave2){
    let note =  pickRandomProperty(rootNotes)
    let octave = getRandomInt(octave1,octave2)

    return note+octave
  }
  //Returns a random note between octave 1 and 2
  //Natural, sharps and flats
  Solfege.prototype.getRandomNoteFull = function(octave1,octave2){
    let note =  pickRandomArray(fullNotesList)
    let octave = getRandomInt(octave1,octave2)

    return note+octave
  }
  //Takes a note and an interval, and computes the second note
  //Returns an array with the initial note, the resulting note, and the interval as text
  Solfege.prototype.getNoteFromInterval = function(note,interval){
    if(interval.quality == '$')
      return 'impossible to compute'
    //console.log('-----' )
    let initialOctave = parseInt(note.slice(-1));
    let octave = initialOctave;
    let rootNote = note.slice(0, -1);
    let rootNoteBaseNoteName = rootNote.substring(0,1);
    let rootNoteMod = note.slice(1, -1);
    let order = (interval.order == "ascending"||  interval.order == '')? 1 : -1

    //Add the interval number to the root note to find the result note
    //We dont care about alterations, just about the note index in the wholeNotesOrder list
    let resultNoteIndex = (wholeNotesOrder[rootNoteBaseNoteName] + order*(interval.number-1))%7;
    // 4 + 1*(2-1) = 5
    //console.log(interval)
    if(resultNoteIndex == 0)
      resultNoteIndex = 7;
    if(resultNoteIndex < 0)
      resultNoteIndex += 7;
    let resultNoteName = getKeyByValue(wholeNotesOrder, resultNoteIndex);
    let semitones = interval.semitones
    //console.log('ResultNoteName: ' + resultNoteName)
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
    //console.log('NewSemitones: ' + semitones)
    
    let diffFromNames = (notesOrder[resultNoteName] - notesOrder[rootNote])*order
    if(diffFromNames!=0 && rootNote.substring(0,1) == resultNoteName){
      diffFromNames =  (octave-initialOctave)*7
      if(rootNoteMod == '#')
        semitones+=1
      if(rootNoteMod == 'b')
        semitones-=1
    }
     
    //console.log('rootOrder: ' + notesOrder[rootNote])
   // console.log('resultOrder: ' + notesOrder[resultNoteName])
    //console.log('DiffFromName: ' + diffFromNames)
    if (diffFromNames<0 || Math.sign(diffFromNames) == -0){
      diffFromNames+=12
      octave+=order*1
    }
    //console.log('DiffFromName: ' + diffFromNames)
    
    //console.log('Octave: ' + octave)

    if((interval.number % 7 == 1 ) && interval.quality != 'd'  )
      octave-=1*order
      
    if((interval.number % 7 == 0) && interval.quality == 'A'  )
      octave-=1*order

    let d = order*diffFromNames-semitones
    //console.log('D: ' + d)
    if(d>2)
      d-=12
    if(d<-2)
      d+=12

    //console.log(d)

    let mod = ''
    if(d == 1)
      mod = 'b'
    if(d == -1)
      mod = '#' 

    if(d == 2 )
      mod = 'bb'
    if(d == -2)
      mod = '##'


    //looking for triple alteration - start again with a new root note (ex G# doesnt have a D2 but F# does)
    if(d>=3 || d <=-3){
      console.log('Can not build a ' +interval.order + ' ' +interval.name + " on " + note + '. Picking a new random note')
      return undefined
      return this.getNoteFromInterval(this.getRandomNoteFull(3,4), interval)
    }
    
    let result = resultNoteName + mod + octave
    //console.log('-----')
    return result
  }
  Solfege.prototype.buildTriad = function(root, quality){
    let third
    let fifth

    switch (quality){
      case 'major':
        third = this.getNoteFromInterval(root,'M3','ascending')[1]
        fifth = this.getNoteFromInterval(third,'m3','ascending')[1]
        break;
      case 'minor':
        third = this.getNoteFromInterval(root,'m3','ascending')[1]
        fifth = this.getNoteFromInterval(third,'M3','ascending')[1]
        break;
      case 'diminished':
        third = this.getNoteFromInterval(root,'m3','ascending')[1]
        fifth = this.getNoteFromInterval(third,'m3','ascending')[1]
        break;
      case 'augmented':
        third = this.getNoteFromInterval(root,'M3','ascending')[1]
        fifth = this.getNoteFromInterval(third,'M3','ascending')[1]
        break;
      default:
        console.log('Unrecognized argument: quality')
        return [root]
    }
    return [root,third,fifth];
  }
  //Returns an interval from 2 notes
  Solfege.prototype.getIntervalFromNotes = function(n1,n2){
    let interval = new Interval()
    interval.computeFromNotes(n1,n2)

    return interval
  }
  Solfege.prototype.getRandomInterval = function(){
    return pickRandomProperty(intervalsDict)
  }
 
  //Interval object can be created with name and order or with no arguments
  // if thats the case, the properties will be computed later 
  let Interval = function(name, order){
    this.name = name
    this.order = order;
    if(name != undefined){
      this.number = parseInt(this.name.substring(1));
      this.quality = this.name.substring(0,1);
      this.semitones =  (this.order == "ascending"? 1 : -1)*intervalsDict[name]

      this.qualityText = qualityDict[this.quality];
      this.numberText = numberDict[this.number];
    }
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

    this.qualityText = qualityDict[this.quality];
    this.numberText = numberDict[this.number];
  }
  Interval.prototype.display = function(){
    console.log("Distance : " + this.semitones + " semitones")
    console.log("Interval : " + this.displayNameAsText() ) 
    return this
  }
  Interval.prototype.displayNameAsText = function(){
    let order = this.order
    if(this.name == "P1" || this.name == "d2")
      order = ''
    if(this.numberText == undefined)
      return '?'
    return  order + " " + this.qualityText + " " + this.numberText
  }
  Interval.prototype.setIntervalInSemitones = function(note1,note2){
    let oct1 = note1.slice(-1);
    let rootNote1 = note1.slice(0, -1);
      
    let oct2 = note2.slice(-1);
    let rootNote2 = note2.slice(0, -1);

    let diff = notesOrder[rootNote2] - notesOrder[rootNote1] + (oct2-oct1)*12
    this.semitones = diff
  }
  //Sets the interval's numbery (2nd,third...)
  Interval.prototype.setIntervalNumber = function(note1, note2){
    let oct1 = note1.slice(-1);
    let rootNote1 = note1.slice(0, 1);
    if(notesOrder[rootNote1]==undefined)
      rootNote1 = enharmonics[rootNote1]

    let oct2 = note2.slice(-1);
    let rootNote2 = note2.slice(0, 1);
    if(notesOrder[rootNote2]==undefined)
      rootNote2 = enharmonics[rootNote2]

    let diff = wholeNotesOrder[rootNote2] - wholeNotesOrder[rootNote1] + 1 + (oct2-oct1)*7

    //special case for ##
    if(oct1 == oct2 && diff>7)
      diff-=7

    if (oct2>oct1 || (oct2 == oct1 && wholeNotesOrder[rootNote2] >= wholeNotesOrder[rootNote1])){
      this.number = diff 
    }
    else{
      //console.log(2-diff)
      this.number =  (2-diff)
    } 
  }
  //Sets the interval's quality (minor, major, perfect...)
  Interval.prototype.setIntervalQuality = function(note1,note2){
    let oct1 = note1.slice(-1);
    let rootNote1 = note1.slice(0, -1);

    let oct2 = note2.slice(-1);
    let rootNote2 = note2.slice(0, -1);

    let nb = Math.abs(this.number)
    let semitones = Math.abs(this.semitones)
    let quality;

    switch (semitones){
      case 0:
        if(nb == 1)
          quality = 'P';
        else if(nb == 2)
          quality = 'd';
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
      case 13:
        if(nb == 8)
          quality = 'A';
        else if(nb == 9)
          quality = 'm';
        break;
      case 14:
        if(nb == 9)
          quality = 'M';
        else if(nb == 10)
          quality = 'd';
        break;
      case 15:
        if(nb == 9)
          quality = 'A';
        else if(nb == 10)
          quality = 'm';
        break;
      case 16:
        if(nb == 10)
          quality = 'M';
        else if(nb == 11)
          quality = 'd';
        break;
      case 17:
        if(nb == 10)
          quality = 'A';
        else if(nb == 11)
          quality = 'P';
        break;
      case 18:
        if(nb == 11)
          quality = 'A';
        else if(nb == 12)
          quality = 'd';
        break;
      case 19:
        if(nb == 12)
          quality = 'P';
        else if(nb == 6)
          quality = '13';
        break;
      case 20:
        if(nb == 12)
          quality = 'A';
        else if(nb == 13)
          quality = 'm';
        break;
      case 21:
        if(nb == 14)
          quality = 'd';
        else if(nb == 13)
          quality = 'M';
        break;
      case 22:
        if(nb == 14)
          quality = 'm';
        else if(nb == 13)
          quality = 'A';
        break;
      case 23:
        if(nb == 14)
          quality = 'M';
        else if(nb == 15)
          quality = 'd';
        break;
      case 24:
        if(nb == 15)
          quality = 'P';
        else if(nb == 14)
          quality = 'A';
        else if(nb == 16)
          quality = 'd';
        break;
    }
    this.quality =   quality 
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
      let note1BaseName =note1.substring(0,1)
      let note2BaseName =note2.substring(0,1)

      let diff = wholeNotesOrder[note2BaseName] - wholeNotesOrder[note1BaseName] 
      if(diff<-7)
        diff+=7
      if(diff>7)
        diff-=7
      this.order = diff>0?'ascending':'descending'
      //console.log('Diff = ' + diff)
    }
      
  }

  //Helpers
  function getRandomInt(a,b){

    return Math.floor(Math.random()*(b - a + 1)) + a;
  }
  function pickRandomProperty(obj) {
      let keys = Object.keys(obj)
      return keys[ keys.length * Math.random() << 0 ];
  }
  function pickRandomArray(arr) {

      return arr[arr.length * Math.random() << 0 ];
  }
  function getKeyByValue(object, value) {

    return Object.keys(object).find(key => object[key] === value);
  }
})();

