'use strict';
var Note = require('../lib/note');
var Interval = require('../lib/interval');
var Chord = require('../lib/chord');
var Helpers = require('../lib/helper');
var Theory = require('../lib/theory');

QUnit.test( "Interval to notes", function( assert ) {

    for(let i = 0;i<100;i++){
        let note = Helpers.getRandomNoteFull(3,4) 
        let order = Math.random()<0.5 ? 'ascending':'descending'
        let intervalName = Helpers.getRandomInterval()
        let interval = new Interval(intervalName, order)
        
        let targetNote = note.getNoteFromInterval(interval)
        if(targetNote == 'impossible to compute')
            continue
        let computedInterval = s.getIntervalFromNotes(note,targetNote)
        if(computedInterval.quality == '$')
            continue
        
        
        assert.equal( interval.semitones ,computedInterval.semitones, "rootNote: " + note.name + '-' + targetNote.name + ' -  intervalNameBasic: '+ interval.name + ' -  intervalNameComputed: '+ computedInterval.name);
    } 
});
/* QUnit.test( "Notes to Interval", function( assert ) {
    let s = new Solfege()
    for(let i = 0;i<100;i++){
        let note1 = s.getRandomNoteFull(3,4) 
        let note2 = s.getRandomNoteFull(3,4) 

        let interval = s.getIntervalFromNotes(note1,note2)

        let note = s.getNoteFromInterval(note1, interval)
        if(note == 'impossible to compute' ) continue

        assert.equal(note.name, note2.name,'Notes: '+note1.name+'-'+note2.name+' - Interval: ' + interval.name )
    } 
});  */









