  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAi6JMqN98EEDyvVu_LL_7p1KMVNq_F7rs",
    authDomain: "train-6cf8c.firebaseapp.com",
    databaseURL: "https://train-6cf8c.firebaseio.com",
    projectId: "train-6cf8c",
    storageBucket: "train-6cf8c.appspot.com",
    messagingSenderId: "388629488373"
  };
  firebase.initializeApp(config);

var database = firebase.database();

function Train(name, destination, time, frequency){
	this.destination = destination;
	this.frequency = frequency;
	this.name = name;
	this.time = time;
}
 var trains = [];

$('#submit').on('click', function(e){
	e.preventDefault();
	trains.push(
		new Train(
			$('#name-input').val(), 
			$('#destination-input').val(), 
			$('#time-input').val(), 
			$('#frequency-input').val()
		)
	);
			$('#name-input').val(""); 
			$('#destination-input').val(""); 
			$('#time-input').val(""); 
			$('#frequency-input').val(""); 

	database.ref().set({trains:trains});
})

database.ref().on(
	"value", 
	function(response){
		trains = response.val().trains;
		loadTrains();
	}, 
	function(error){
		alert("Error getting train info.")
	}
);

function formatMinutes(minutes){
	if (minutes<10){
		minutes = "0" + minutes;
	}
	return minutes;
}

function loadTrains(){
	$('#train-schedule').html("");
	for(key in trains){
		$('#train-schedule').append($('<tr>')
			.html($('<td>').html(trains[key].name))
			.append($('<td>').html(trains[key].destination))
			.append($('<td>').html(trains[key].frequency))
			.append($('<td>').html(new Date().getHours() + ":" + 
				formatMinutes(new Date().getMinutes() + timeToTrain(trains[key]))))
			.append($('<td>').html(timeToTrain(trains[key])))
		);
	}
}

function timeToTrain (aTrain){
    var tFrequency = aTrain.frequency;

    // Time is 3:30 AM
    var firstTime = aTrain.time;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    return tRemainder;
}

