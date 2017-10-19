'use strict';
var Interval = require('./interval');
var Chord = require('./chord');
var Helpers = require('./helper');
var Theory = require('./theory');

exports = module.exports = Scale;

//Use symbols for emulating private variables
var _tonic = Symbol('tonic');
var _type = Symbol('type');
var _degree = Symbol('degree');
var _notes = Symbol('notes');

function Scale(tonic, type, degree) {
    var Note = require('./note');

    this[_tonic] = Helpers.isNote(tonic) ? tonic : new Note(tonic);
    this[_type] = type;
    this[_degree] = degree || 1;
    this[_notes] = [this.getTonic()];

    buildScale(this, this.getDegree());

    //Duplicate of the name, for debugging purpose, is public but has no impact on anything
    this.scale = this[_notes];
}
//Public Getters
Scale.prototype.getTonic = function () { return this[_tonic] };
Scale.prototype.getType = function () { return this[_type] };
Scale.prototype.getName = function () { return this.getTonic().getRootName() + ' ' + this.getType() };
Scale.prototype.getDegree = function () { return this[_degree] };
Scale.prototype.getNotes = function () { return this[_notes] };
Scale.prototype.getNotesName = function () { return this.getNotes().map(n => n.getName()) };
Scale.prototype.getNotesFrequencies = function () { return this.getNotes().map(n => n.getFrequency()) };

Scale.prototype.getChords = function (nb) {
    //if no nb, assume triad
    nb = nb || 3
    let chords = []
    let length = this.getNotes().length
    let root = this.getTonic().getRoot()

    for (let i = 0; i < length; i++) {
        let notes = []
        for (let j = 0; j < nb; j++) {
            let n = this.getNotes()[(2 * j + i) % length]
            if (2 * j + i > length) {
                let times = Math.floor((2 * j + i) / length)
                for (let k = 0; k < times; k++) {
                    n = n.plusInterval('P8')
                }
            }
            notes.push(n)
        }
        let name = root + ' ' + this.getType() + ' ' + Theory.scaleTones[i + 1]
        chords.push(new Chord(notes, name))
    }
    return chords;
}

//Private
//Setters
const setType = function (scale, newType) { scale[_type] = newType };
const setDegree = function (scale, newDegree) { scale[_degree] = newDegree };
const setNotes = function (scale, newNotes) { scale[_notes] = newNotes };

//Looks for the scale type in a dict and builds it on top of the tonic
const buildScale = function (scale, degree) {
    //account for values > 7 
    degree = degree % 7;

    let scaleType = Theory.scalesDict[scale.getType().toLowerCase()];

    let tonic = scale.getTonic()
    let notes = scaleType.map(note => tonic.plusInterval(note))

    if (degree > 1) {
        //mode calculation, start by switching the order of the notes
        // ex: for C dorian (degree 2)
        // [C3,D3,E3,F3,G3,A3,B3] => [D3,E3,F3,G3,A3,B3,C4]
        for (let i = 0; i < degree - 1; i++) {
            notes.push(notes[0].plusInterval('P8'))
            notes.shift()
        }

        //then transpose all the notes to get back to the tonic
        notes = notes.map(note => note.plusInterval(scaleType[degree - 1], 'descending'))
    }
    //Add the octave to the notes list
    //notes.push(notes[0].plusInterval('P8'));
    //And replace the notes object of the scale
    setNotes(scale, notes);
}
