$(document).ready(function(){ 
  let s = new Solfege()
  let note = 'B3'

  let interval = new Interval('P8', 'ascending' )

  let resultNote = s.getNoteFromInterval(note, interval)

  let resultInterval = s.getIntervalFromNotes(note, resultNote)
 
  //console.log('-----')
  //console.log(note)
  //console.log(resultNote)
  //console.log(resultInterval.name)
  runTest()
});
























