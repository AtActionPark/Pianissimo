document.getElementById("chordName").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        let name = $("#chordName").val()
        nameToNotes(name)
    }
});
document.getElementById("parseButton").onclick = function () {
    let name = $("#chordName").val()
    nameToNotes(name)
};

document.getElementById("notesList").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        let notes = $("#notesList").val()
        notesToName(notes)
    }
});
document.getElementById("nameButton").onclick = function () {
    let notes = $("#notesList").val()
    notesToName(notes)
};

const nameToNotes = function (name) {
    let chord = pianissimo.chord(name)
    let notes = chord.getNotesName()
    let intervals = chord.getIntervals()

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
const notesToName = function (notes) {
    let n = notes.split(" ")
    let chord = pianissimo.chord(n)
    let best = chord.findBestName()

    $("#resultChord").html(best)
}