'use strict';

const pianissimo = require('../pianissimo');

// Scale
QUnit.test('scaleCreate', function(assert) {
  const note = pianissimo.note('C3');

  // Basic creation
  let scale = pianissimo.scale(note, 'major');
  assert.equal(scale.getTonic(), note);
  assert.equal(scale.getType(), 'major');
  assert.equal(scale.getNotes()[0].getName(), 'C3');
  assert.equal(scale.getNotes()[4].getName(), 'G3');

  // Short hand creation
  scale = pianissimo.scale('C3', 'minor');
  assert.equal(scale.getTonic().getName(), 'C3');
  assert.equal(scale.getType(), 'minor');
  assert.equal(scale.getNotes()[0].getName(), note.getName());
  assert.equal(scale.getNotes()[4].getName(), 'G3');
});
QUnit.test('scaleGetChords', function(assert) {
  const scale = pianissimo.scale('C3', 'major');
  const chords = scale.getChords(4);
  assert.equal(chords.length, 7);
  assert.equal(chords[4].getName(), 'C major dominant');
  assert.equal(chords[4].getNotesName()[3], 'F4');
});
