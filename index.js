const solfege = module

document.getElementById("chordName").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        let name = $("#chordName").val()
        ex(name)
    }
});

document.getElementById("notesList").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        let notes = $("#notesList").val()
        ex2(notes)    
    }
});

document.getElementById("button1").onclick = function () {
    let name = $("#chordName").val()
    ex(name)
};
document.getElementById("button2").onclick = function () {
    let notes = $("#notesList").val()
    ex2(notes)
};

const ex = function (name) {
    let chord = solfege.chord(name)
    let notes = chord.getNotesName()
    let intervals = chord.getIntervals()
    console.log(chord)

    let notesResult = ''
    for (let i = 0; i < notes.length; i++) {
        notesResult += notes[i]
        if (i < notes.length - 1)
            notesResult += ' / '
    }

    let intervalsResult = ''
    for (let i = 0; i < intervals.length; i++) {
        intervalsResult += intervals[i]
        if (i < intervals.length - 1)
            intervalsResult += ' / '
    }

    $("#resultIntervals").html(intervalsResult)
    $("#resultNotes").html(notesResult)
}

const ex2 = function (notes) {
    let n = notes.split(" ")
    console.log(n)
    let chord = solfege.chord(n)
    let best = chord.findBestName()

    $("#resultChord").html(best)
}