(function(){
  let debug = true;

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
  ///INTERVALS///
  let notesOrder = {
    'Cb':-1,
    'C':0,
    'C#':1,
    'Db':1,
    'D':2,
    'D#':3,
    'Eb':3,
    'E':4,
    'E#':5,
    'Fb':4,
    'F':5,
    'F#':6,
    'Gb':6,
    'G':7,
    'G#':8,
    'Ab':8,
    'A':9,
    'A#':10,
    'Bb':10,
    'B':11,
    'B#':12
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
    d: "diminished"
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

  Solfege = function(settings){
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
    let note =  pickRandomProperty(notesOrder)
    let octave = getRandomInt(octave1,octave2)

    return note+octave
  }
  //Returns an interval name from 2 notes
  Solfege.prototype.getIntervalFromNotes = function(n1,n2){

    return new IntervalFromNotes(n1,n2)
  }
  //Takes a note and an interval, and computes the second note
  //Returns an array with the initial note, the resulting note, and the interval as text
  Solfege.prototype.getNoteFromInterval = function(note,interval,intervalOrder){
    let oct = parseInt(note.slice(-1));
    let rootNote = note.slice(0, -1);

    let intervalNumber = parseInt(interval.substring(1));
    let intervalQuality = interval.substring(0,1);

    let order = intervalOrder == "ascending"? 1 : -1

    let resultNote = (wholeNotesOrder[rootNote.substring(0,1)] + order*(intervalNumber-1))%7;

    if(resultNote == 0)
      resultNote = 7;
    if(resultNote < 0)
      resultNote += 7;

    let resultNoteName = getKeyByValue(wholeNotesOrder, resultNote);

    let semitones = order*intervalsDict[interval]

    let resultOctave = oct;

    while(semitones > 12){
      resultOctave+=1;
      semitones-=12
    }
    while(semitones < -12){
      resultOctave-=1;
      semitones+=12
    }
    if(semitones == 12)
      resultOctave+=1
    if(semitones == -12)
      resultOctave-=1


    let diffFromNames = (notesOrder[resultNoteName] - notesOrder[rootNote])*order

    if (diffFromNames<0 || Math.sign(diffFromNames) == -0){
      diffFromNames+=12
      resultOctave+=order*1

      //horrible
      if((intervalNumber == 1 || intervalNumber == 8 || intervalNumber == 15) && intervalQuality != 'd'  )
        resultOctave-=1*order
      if((intervalNumber == 7 || intervalNumber == 14) && intervalQuality == 'A'  )
        resultOctave-=1*order
    }

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

    //looking for triple alteration - start again with a new root note (ex G# doesnt have a D2 but F# does)
    if(d>=3 || d <=-3){
      console.log('Can not build a ' +intervalOrder + ' ' +interval + " on " + note + '. Picking a new random note')
      return getNoteFromInterval(getRandomNoteFull(), interval, intervalOrder)
    }

    let result = resultNoteName + mod + resultOctave

    let qualityText = qualityDict[intervalQuality];
    let numberText = numberDict[intervalNumber];
    if(interval == "P1" || interval == "d2")
      intervalOrder = ''

    let answer =  qualityText + " " + numberText

    if(debug){
      console.log("Notes : " + note + " - " + result)
      console.log("Distance : " + order*intervalsDict[interval] + " semitones")
      console.log("Interval : " + intervalOrder + " " + answer)
    }
    
    return [note, result,answer];
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

  IntervalFromNotes = function(n1,n2){
    this.n1 = n1
    this.n2 = n2
    this.order = getIntervalOrder(n1,n2);
    this.quality = getIntervalQuality(n1,n2);
    this.number = getIntervalNumber(n1,n2);
    this.semitones = getIntervalInSemitones(n1,n2)

    this.qualityText = qualityDict[this.quality];
    this.numberText = numberDict[this.number];
  }
  IntervalFromNotes.prototype.display = function(){
    console.log("Notes : " + this.n1 + " - " + this.n2)
    console.log("Distance : " + this.semitones + " semitones")
    console.log("Interval : " + this.order + " " + this.qualityText + " " + this.numberText ) 
  }
  IntervalFromName = function(name, order){
    this.name = name
    this.order = order;

    this.number = parseInt(name.substring(1));
    this.quality = name.substring(0,1);
    this.semitones =  (this.order == "ascending"? 1 : -1)*intervalsDict[name]

    this.semitones = getIntervalInSemitones(n1,n2)

    this.qualityText = qualityDict[this.quality];
    this.numberText = numberDict[this.number];
  }
  IntervalFromName.prototype.display = function(){
    console.log("Notes : " + this.n1 + " - " + this.n2)
    console.log("Distance : " + this.semitones + " semitones")
    console.log("Interval : " + this.order + " " + this.qualityText + " " + this.numberText ) 
  }


  function getIntervalInSemitones(note1,note2){
    let oct1 = note1.slice(-1);
    let rootNote1 = note1.slice(0, -1);
    if(notesOrder[rootNote1]==undefined)
      rootNote1 = enharmonics[rootNote1]

    let oct2 = note2.slice(-1);
    let rootNote2 = note2.slice(0, -1);
    if(notesOrder[rootNote2]==undefined)
      rootNote2 = enharmonics[rootNote2]

    let diff = notesOrder[rootNote2] - notesOrder[rootNote1] + (oct2-oct1)*12
    return diff
  }
  //Returns the interval's numbery (2nd,third...)
  function getIntervalNumber(note1, note2){
    let oct1 = note1.slice(-1);
    let rootNote1 = note1.slice(0, 1);
    if(notesOrder[rootNote1]==undefined)
      rootNote1 = enharmonics[rootNote1]

    let oct2 = note2.slice(-1);
    let rootNote2 = note2.slice(0, 1);
    if(notesOrder[rootNote2]==undefined)
      rootNote2 = enharmonics[rootNote2]

    let diff = wholeNotesOrder[rootNote2] - wholeNotesOrder[rootNote1] + 1 + (oct2-oct1)*7

    if (oct2>oct1 || (oct2 == oct1 && wholeNotesOrder[rootNote2] >= wholeNotesOrder[rootNote1]))
      return  diff 
    else
      return  (2-diff)
  }
  //Returns the interval's quality (minor, major, perfect...)
  function getIntervalQuality(note1,note2){
    let oct1 = note1.slice(-1);
    let rootNote1 = note1.slice(0, -1);

    let oct2 = note2.slice(-1);
    let rootNote2 = note2.slice(0, -1);

    let nb = Math.abs(getIntervalNumber(note1,note2))
    let semitones = Math.abs(getIntervalInSemitones(note1,note2))
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
        if(nb == 48)
          quality = 'P';
        else if(nb == 14)
          quality = 'A';
        break;
    }
    return  quality 
  }
  function getIntervalOrder(note1,note2){
    let interval  = getIntervalInSemitones(note1,note2)
    if (interval>0)
      return 'ascending'
    else if (interval < 0)
      return 'descending'
    else
      return ''
  }
  function getNextNote(note){
    let oct = note.slice(-1);
    let rootNote = note.slice(0, -1);

    let octResult = (rootNote == 'B')? parseInt(oct) + 1 : oct


    let notes = Object.keys(rootNotes)
    let n = notes.indexOf(rootNote) + 1
    let rootNoteResult = (rootNote == 'B')? 'C': notes[n]

    return rootNoteResult + octResult
  }

  //Helpers random
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


