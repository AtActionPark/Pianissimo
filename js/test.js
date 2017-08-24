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

	QUnit.test( "A14", function( assert ) {
        for(let i = 0;i<1000;i++){
            let s = new Solfege()

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
            
            assert.equal( interval.semitones ,computedInterval.semitones, "rootNote: " + note + '-' + targetNote + ' -  intervalName: '+ intervalName );
        }
	});
}







