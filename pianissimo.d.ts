declare module "pianissimo" {

    type OrderString = 'ascending' | 'descending';
    type Order = '+' | '-' | number | OrderString;
    type ScaleType = (
        // 5 notes
        | 'majorpentatonic'
        | 'pentatonic'
        | 'minorpentatonic'
        // 6 notes
        | 'blues'
        | 'wholetone'
        | 'augmented'
        | 'promotheus'
        | 'tritone'
        // 7 notes
        | 'major'
        | 'minor'
        | 'melodicminor'
        | 'harmonicminor'
        | 'harmonicmajor'
        | 'doubleharmonic'

        | 'ionian'
        | 'dorian'
        | 'phrygian'
        | 'lydian'
        | 'mixolydian'
        | 'aeolian'
        | 'locrian'

        | 'enigmatic'
        | 'halfdimished'
        | 'hungarianminor'
        // 8 notes
        | 'octatonic'
        | 'diminished'
        // 12 notes
        | 'chromatic'
    );
    type RootLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

    interface Note {
        /** e.g. 'C#4' */
        getName(): string;
        /** e.g. 'C#' */
        getRoot(): string;
        /** e.g. 'C' */
        getRootName(): string;
        /** e.g. '#' */
        getAlteration(): string;
        /** e.g. 4 */
        getOctave(): number;
        getNotationType(): 'letter' | 'name';
        /** e.g. 61 */
        getMidiNumber(): number;

        getRootAsLetter(): string;
        getRootNameAsLetter(): RootLetter;
        getFrequency(): number;

        /** adds an interval to the note, and returns the resulting note object. 
         * Arguments can be an interval object, an interval name (order will be ascending) or an interval name and order */
        plusInterval(interval: Interval | string, order?: Order): Note;
        /**  */
        toInterval(note: string): Interval;
        /** returns a scale object built on the current note. 
         * Arguments can be the name of the scale, and the degree to start on (optional) */
        toScale(type: ScaleType, degree?: number): Scale;
    }

    interface Interval {
        getName(): string;
        getSemitones(): number;
        getOrder(): Order;
        getOrderAsString(): OrderString;
        getNumber(): number;
        getQuality(): string;
        getQualityText(): string;
        getNumberText(): string;
        /** undefined, or the note used to create the interval */
        getNote1(): Note | undefined;
        /** undefined, or the note used to create the interval */
        getNote2(): Note | undefined;
        /** returns [note1,note2] */
        getNotes(): [Note, Note];
        /** returns [note1.getName(),note2.getName()] */
        getNotesName(): [string, string];
        /** returns [note1.getFrequency(),note2.getFrequency()] */
        getNotesFrequencies(): [number, number];

        /** Inverts the interval and returns it */
        invert(): Interval;
    }

    interface Scale {
        /** e.g. 'C3' */
        getTonic(): Note;
        /** e.g. 'C minor' */
        getName(): string;
        /** e.g. 'minor' */
        getType(): ScaleType;
        /** e.g. 1 */
        getDegree(): number;
        /** will return an array of note objects */
        getNotes(): Note[];
        /** will return the name of the notes: ['C3','D3','Eb3','D3','G3','Ab3','Bb3','C4'] */
        getNotesName(): string[];
        /** will return the frequencies of the notes: [130.81, 145.83, 155.56, 174.61, 196, 207.65, 233.08] */
        getNotesFrequencies(): number[];
        /** returns an array of chords built on the scale, along with diatonic function. 
         * Accepts an optional 'number' argument, to specify the number of notes per chord */
        getChords(numNotes: number): Chord[];
    }

    interface Chord {
        getTonic(): Note;
        getSymbols(): string;
        getName(): string;
        /** will return an array of note objects */
        getNotes(): Note[];
        /** will return the name of the notes: ['C3','Eb3','Bb3'] */
        getNotesName(): string[];
        /** will return the frequencies of the notes: [130.8, 155.56, 233.08] */
        getNotesFrequencies(): number[];
        /** adds an interval to the chord, and returns the resulting chord object. 
         * Arguments can be an interval object, an interval name (order will be ascending) or an interval name and order */
        transpose(interval: Interval): void;
        transpose(intervalName: string, order?: Order): void;
        /** will return an inverted version of the chord. Order will specify the number of inversions. 
         * Will default to 1 if no order is specified. */
        invert(order?: Order): void;
        /** will return a list of possible names for the chord, along with notes order and intervals */
        findAlternateNames(): string[];
        /** will return the shortest name from the possible nams list and set it. */
        findBestName(): string;
    }

    /** returns a note object from a name or midi note number */
    function note(name: string | number): Note;
    /** returns an interval object from a name and order (optional) */
    function interval(name: string, order?: Order): Interval;
    /** returns an interval object from 2 notes */
    function interval(note1: Note | string, note2: Note | string): Interval;
    /** returns a scale object from a note, a scale name, and a degree (optional) */
    function scale(tonic: Note | string, type: ScaleType, degree?: number): Scale;
    /** returns a chord object from a note, and a chord name */
    function chord(tonic: Note, name: string): Chord;
    /** returns a chord object from a chord name */
    function chord(name: string): Chord;
    /** returns a random note object */
    function randomNote(): Note;
    /** returns a random interval object */
    function randomInterval(): Interval;
    /** returns a random scale object. The tonic is optional, and will be random if not specified */
    function randomScale(tonic?: Note): Scale;
    /** sets the frequency of A4 (default: 440Hz) */
    function setA4(frequency: number): void;
}
