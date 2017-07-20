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



function getIntervalInSemitones(note1,note2){
  let oct1 = note1.slice(-1);
  let rootNote1 = note1.slice(0, -1);

  let oct2 = note2.slice(-1);
  let rootNote2 = note2.slice(0, -1);

  let diff = notesOrder[rootNote2] - notesOrder[rootNote1] + (oct2-oct1)*12
  return diff
}
function getIntervalNumber(note1, note2){
  let oct1 = note1.slice(-1);
  let rootNote1 = note1.slice(0, 1);

  let oct2 = note2.slice(-1);
  let rootNote2 = note2.slice(0, 1);

  let diff = wholeNotesOrder[rootNote2] - wholeNotesOrder[rootNote1] + 1 + (oct2-oct1)*7

  if (oct2>oct1 || (oct2 == oct1 && wholeNotesOrder[rootNote2] >= wholeNotesOrder[rootNote1]))
    return  diff 
  else
    return  (2-diff)
}
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
function getIntervalOrdern(note1,note2){
  let interval  = getIntervalInSemitones(note1,note2)
  if (interval>0)
    return 'ascending'
  else if (interval < 0)
    return 'descending'
  else
    return ''
}
function displayInterval(n1,n2){
  
  let order = getIntervalOrder(n1,n2);
  let quality = getIntervalQuality(n1,n2);
  let number = getIntervalNumber(n1,n2);

  let qualityText = qualityDict[quality];
  let numberText = numberDict[number];

  if(debug){
    console.log("Notes : " + n1 + " - " + n2)
    console.log("Distance : " + getIntervalInSemitones(n1,n2) + " semitones")
    console.log("Interval : " + order + " " + qualityText + " " + numberText ) 
  }

  return [getIntervalInSemitones(n1,n2), quality, number]
}
function getNoteFromInterval(note,interval, intervalOrder){
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

  //looking for triple alteration - start again with a new root note (ex G# doest have a D2 but F# does)
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


