//lets generate a random song, create a seed, load it, and compare to the original 
QUnit.config.autostart = false;
let unitTest = false

function runTest(){
	if(!unitTest)
		QUnit.start()

	startTest()
}
function startTest(){
	if(!unitTest){
    	$('body').append('<div id="qunit"></div><div id="qunit-fixture"></div>')
  	}
  	unitTest = true;

    //Take a random note/interval pair
    //Compute the result note (note + interval)
    //Compute the interval between the original note and the result note, and make sure its the same
	QUnit.test( "Interval to notes", function( assert ) {
        let s = new Solfege()
        for(let i = 0;i<100;i++){
            let note = s.getRandomNoteFull(3,4) 
            let order = Math.random()<0.5 ? 'ascending':'descending'
            let intervalName = s.getRandomInterval()
            let interval = new Interval(intervalName, order)
            
            let targetNote = s.getNoteFromInterval(note, interval)
            if(targetNote == undefined)
                continue;
            let computedInterval = s.getIntervalFromNotes(note,targetNote)
            if(computedInterval.quality == '$')
                continue
            
            assert.equal( interval.semitones ,computedInterval.semitones, "rootNote: " + note + '-' + targetNote + ' -  intervalNameBasic: '+ interval.name + ' -  intervalNameComputed: '+ computedInterval.name);
        }
    });
      QUnit.test( "Notes to Interval", function( assert ) {
        let s = new Solfege()
        for(let i = 0;i<100;i++){
            let note1 = s.getRandomNoteFull(3,4) 
            let note2 = s.getRandomNoteFull(3,4) 

            let interval = s.getIntervalFromNotes(note1,note2)

            let note = s.getNoteFromInterval(note1, interval)
            if(note == 'impossible to compute' ) continue

            assert.equal(note, note2,'Notes: '+note1+'-'+note2+' - Interval: ' + interval.name )
        } 
	}); 
    QUnit.test( "Create triads", function( assert ) {
        let s = new Solfege()
        for(let i = 0;i<100;i++){
            let note = s.getRandomNoteFull(3,4) 
            let triad = s.buildTriad(note, 'minor')
            let interval = s.getIntervalFromNotes(triad[0], triad[1])
            assert.equal(interval.semitones, 3)
        }
	});
}







