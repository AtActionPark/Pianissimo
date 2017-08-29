'use strict';
var solfege = require('../index');

QUnit.test( "Interval to notes", function( assert ) {
    for(let i = 0;i<100;i++){
        let note = solfege.randomNote(3,4)
        let interval = solfege.randomInterval()
        let targetNote = note.plusInterval(interval)
        
        if(targetNote == 'impossible to compute')
            continue
        let computedInterval = solfege.interval(note,targetNote)
        if(computedInterval.quality == '$')
            continue
        
        
        assert.equal( interval.semitones ,computedInterval.semitones, "rootNote: " + note.name + '-' + targetNote.name + ' -  intervalNameBasic: '+ interval.name + ' -  intervalNameComputed: '+ computedInterval.name);
    } 
});
QUnit.test( "Notes to Interval", function( assert ) {
    for(let i = 0;i<100;i++){
        let note1 = solfege.randomNote(3,4)
        let note2 = solfege.randomNote(3,4)

        let interval = solfege.interval(note1,note2)

        let note = note1.plusInterval(interval)
        if(note == 'impossible to compute' ) continue

        assert.equal(note.name, note2.name,'Notes: '+note1.name+'-'+note2.name+' - Interval: ' + interval.name )
    } 
});  









