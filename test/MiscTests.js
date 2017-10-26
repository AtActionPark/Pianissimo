'use strict';

var pianissimo = require('../pianissimo');
var Helpers = require('../lib/helper');

//100 random tests to try to find forgotten edge cases
QUnit.test("Interval to notes", function (assert) {
    for (let i = 0; i < 100; i++) {
        let note = pianissimo.randomNote(3, 4)
        let interval = pianissimo.randomInterval()
        let targetNote = note.plusInterval(interval)

        if (targetNote == 'impossible to compute')
            continue
        let computedInterval = pianissimo.interval(note, targetNote)
        if (computedInterval.getQuality() == '$')
            continue


        assert.equal(interval.getSemitones(), computedInterval.getSemitones(), "rootNote: " + note.getName() + '-' + targetNote.getName() + ' -  intervalNameBasic: ' + interval.getName() + ' -  intervalNameComputed: ' + computedInterval.getName());
    }
});
QUnit.test("Notes to Interval", function (assert) {
    for (let i = 0; i < 100; i++) {
        let note1 = pianissimo.randomNote(3, 4)
        let note2 = pianissimo.randomNote(3, 4)

        let interval = pianissimo.interval(note1, note2)

        let note = note1.plusInterval(interval)
        if (note == 'impossible to compute') continue

        assert.equal(note.getName(), note2.getName(), 'Notes: ' + note1.getName() + '-' + note2.getName() + ' - Interval: ' + interval.name)
    }
});









