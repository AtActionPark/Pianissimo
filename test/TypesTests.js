'use strict';

const pianissimo = require('../pianissimo');
const Note = require('../lib/note');
const Interval = require('../lib/interval');
const Scale = require('../lib/scale');
const Chord = require('../lib/chord');

QUnit.module('Expected Types', function () {

    QUnit.test('Note functions', function (assert) {
        const note = pianissimo.note('C3');
        const note2 = pianissimo.note(60);
        assert.equal(note.constructor, Note);
        assert.equal(note2.constructor, Note);
        assert.equal(typeof note.getRoot(), 'string');
        assert.equal(typeof note.getRootName(), 'string');
        assert.equal(typeof note.getOctave(), 'number');
        assert.true(note.getNotationType() === 'letter' || note.getNotationType() === 'name');
        assert.equal(typeof note.getMidiNumber(), 'number');
        assert.equal(typeof note.getRootAsLetter(), 'string');
        assert.equal(typeof note.getRootNameAsLetter(), 'string');
        assert.equal(typeof note.getFrequency(), 'number');
        assert.equal(note.plusInterval(pianissimo.randomInterval()).constructor, Note);
        assert.equal(note.toInterval('C5').constructor, Interval);
        assert.equal(note.toScale('minor').constructor, Scale);
    });

    QUnit.test('Interval functions', function (assert) {
        const interval = pianissimo.interval(pianissimo.note('C4'), pianissimo.note('E4'));
        const interval2 = pianissimo.interval('m3', '+');
        assert.equal(interval.constructor, Interval);
        assert.equal(interval2.constructor, Interval);
        assert.equal(typeof interval.getName(), 'string');
        assert.equal(typeof interval.getSemitones(), 'number');
        assert.equal(typeof interval.getOrder(), 'string');
        assert.equal(typeof interval.getOrderAsString(), 'string');
        assert.equal(typeof interval.getNumber(), 'number');
        assert.equal(typeof interval.getQuality(), 'string');
        assert.equal(typeof interval.getQualityText(), 'string');
        assert.equal(typeof interval.getNumberText(), 'string');
        assert.equal(interval.getNote1().constructor, Note);
        assert.equal(interval.getNote2().constructor, Note);
        assert.equal(interval.getNotes()[0].constructor, Note);
        assert.equal(interval.getNotes()[1].constructor, Note);
        assert.equal(typeof interval.getNotesName()[0], 'string');
        assert.equal(typeof interval.getNotesName()[1], 'string');
        assert.equal(typeof interval.getNotesFrequencies()[0], 'number');
        assert.equal(typeof interval.getNotesFrequencies()[1], 'number');
        assert.equal(interval.invert().constructor, Interval);
    });

    QUnit.test('Scale functions', function (assert) {
        const scale = pianissimo.scale('C3', 'minor');
        const scale2 = pianissimo.scale('C3', 'minor', 3);
        assert.equal(scale.constructor, Scale);
        assert.equal(scale2.constructor, Scale);
        assert.equal(scale.getTonic().constructor, Note);
        assert.equal(typeof scale.getName(), 'string');
        assert.equal(typeof scale.getType(), 'string');
        assert.equal(typeof scale.getDegree(), 'number');
        assert.equal(scale.getNotes().constructor, Array);
        assert.equal(scale.getNotes()[0].constructor, Note);
        assert.equal(scale.getNotesName().constructor, Array);
        assert.equal(typeof scale.getNotesName()[0], 'string');
        assert.equal(scale.getNotesFrequencies().constructor, Array);
        assert.equal(typeof scale.getNotesFrequencies()[0], 'number');
        assert.equal(scale.getChords(3).constructor, Array);
        assert.equal(scale.getChords(3)[0].constructor, Chord);
    });

    QUnit.test('Chord functions', function (assert) {
        const chord = pianissimo.chord('Sol#7b9');
        assert.equal(chord.constructor, Chord);
        assert.equal(chord.getTonic().constructor, Note);
        assert.equal(typeof chord.getSymbols(), 'string');
        assert.equal(typeof chord.getName(), 'string');
        assert.equal(chord.getNotes().constructor, Array);
        assert.equal(chord.getNotes()[0].constructor, Note);
        assert.equal(chord.getNotesName().constructor, Array);
        assert.equal(typeof chord.getNotesName()[0], 'string');
        assert.equal(chord.getNotesFrequencies().constructor, Array);
        assert.equal(typeof chord.getNotesFrequencies()[0], 'number');
        assert.equal(chord.findAlternateNames().constructor, Array);
        assert.equal(typeof chord.findAlternateNames()[0], 'string');
        assert.equal(typeof chord.findBestName(), 'string');

        assert.equal(typeof chord.transpose, 'function');
        assert.equal(typeof chord.invert, 'function');
    });

    QUnit.test('Misc pianissimo functions', function (assert) {
        assert.equal(pianissimo.randomNote().constructor, Note);
        assert.equal(pianissimo.randomInterval().constructor, Interval);
        assert.equal(pianissimo.randomScale().constructor, Scale);
        assert.equal(pianissimo.randomScale(pianissimo.randomNote()).constructor, Scale);
        assert.equal(typeof pianissimo.setA4, 'function');
    });
});
