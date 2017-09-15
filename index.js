let solfege = module

document.getElementById("button").onclick = function () { 
    let note = $("#note").val()
    let alt = $("#alteration").val()
    let name = $("#chordName").val()

    let n = solfege.note(note+alt)
    let chord = n.toChord(name)

    let notes = chord.getNotesName()
    let intervals = chord.getIntervals()

    let notesResult = ''
    for(let i = 0;i<notes.length;i++){
        notesResult+=notes[i] 
        if(i<notes.length-1)
        notesResult+=' - '
    }

    let intervalsResult = ''
    for(let i = 0;i<intervals.length;i++){
        intervalsResult+=intervals[i] 
        if(i<intervals.length-1)
        intervalsResult+=' - '
    }

    $("#resultIntervals").html(intervalsResult)
    $("#resultNotes").html(notesResult)
};
