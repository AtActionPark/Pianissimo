'use strict';

const pianissimo = require('../pianissimo');

// 100 random tests to try to find forgotten edge cases
QUnit.test('Interval to notes', function(assert) {
  for (let i = 0; i < 100; i++) {
    const note = pianissimo.randomNote(3, 4);
    const interval = pianissimo.randomInterval();
    const targetNote = note.plusInterval(interval);

    if (targetNote == 'impossible to compute') continue;
    const computedInterval = pianissimo.interval(note, targetNote);
    if (computedInterval.getQuality() == '$') continue;

    assert.equal(
      interval.getSemitones(),
      computedInterval.getSemitones(),
      'rootNote: ' +
        note.getName() +
        '-' +
        targetNote.getName() +
        ' -  intervalNameBasic: ' +
        interval.getName() +
        ' -  intervalNameComputed: ' +
        computedInterval.getName()
    );
  }
});
QUnit.test('Notes to Interval', function(assert) {
  for (let i = 0; i < 100; i++) {
    const note1 = pianissimo.randomNote(3, 4);
    const note2 = pianissimo.randomNote(3, 4);

    const interval = pianissimo.interval(note1, note2);

    const note = note1.plusInterval(interval);
    if (note == 'impossible to compute') continue;

    assert.equal(
      note.getName(),
      note2.getName(),
      'Notes: ' + note1.getName() + '-' + note2.getName() + ' - Interval: ' + interval.name
    );
  }
});
