'use strict';

var Interval = require('./interval');
var Helpers = require('./helper');
var Theory = require('./theory');

exports = module.exports = Scale;

function Scale(_tonic,_type,_degree){
    var Note = require('./note');

    let tonic = Helpers.isNote(_tonic)? _tonic : new Note(_tonic);
    let type = _type;
    let degree = _degree || 1;
    let notes = [tonic];

    this.getNotes = function(){return notes};
    this.getNotesName = function(){return notes.map(n => n.name)};
    this.setNotes = function(newNotes){notes = newNotes};

    this.getType = function(){return type};
    this.setType = function(newType){type = newType};

    this.getTonic = function(){return tonic};

    buildChord(this,degree);
}
Scale.prototype.changeMode = function(degree){
    buildChord(this,degree)
}

const buildChord = function(scale,degree){
    //account for values > 7 
    degree = degree % 7;

    let scaleType = Theory.scalesDict[scale.getType()];
    let notes = [scale.getTonic()]
    
    //Start at 1, as tonic is already included
    for(let i = 1;i<scaleType.length;i++)
        notes.push(notes[0].plusInterval(scaleType[i]));
    
    if(degree>1){
        //mode calculation, start by switching the order of the notes
        // ex: for C dorian (degree 2)
        // [C3,D3,E3,F3,G3,A3,B3] => [D3,E3,F3,G3,A3,B3,C4]
        for(let i = 0;i<degree-1;i++){
            notes.push(notes[0].plusInterval('P8'))
            notes.shift()
        }

        //then transpose all the notes to get back to the tonic
        for(let i = 0;i<notes.length;i++)
            notes[i] = notes[i].plusInterval(scaleType[degree-1], 'descending')
    }   
    //Add the octave to the notes list
    notes.push(notes[0].plusInterval('P8'));
    //And replace the notes object of the scale
    scale.setNotes(notes);
}
