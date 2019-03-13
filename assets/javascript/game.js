
var hangManGame = {
    //Variables
    winCount : 0,
    lossCount : 0, //It really depends how you define a loss.  You are acting within the constraints we've defined.
    numGuessesLeft : 0b1010, //10 guesses.  I don't want people to lose really.  Just accept the inevitable. 
    currentTargetIndex : 0,
    wordsToGuess : ["Skynet", "Daleks", "Borg", "Ultron", "Bender" ],
    wordInProgressSounds : ["skynet.mp3", "dalek.wav"],
    wordWinSounds : [],
    userGuesses : [],
    revealedWord : "",

    //Functions
    playAudioFile: function (audioFile, loopIt = true) {
        var audio = document.getElementById("myAudio");
        audio = new Audio('assets/audio/' + audioFile);
        audio.loop = loopIt;
        audio.play();
    },

    //Create a new array (mapped) off the old array using transform.
    map : function(array, transform) {
        let mapped = [];
        for (let element of array) {
            mapped.push(transform(element));
        }
        return mapped;
    },

    testMe: function(testVar) {
        var search = "bob";

        var result;
        if(this.userGuesses.includes("x")) {
            result = [String("x").toUpperCase(), " "];
        } else {
            result = ["_", " "];
        }
        console.log(result);
        console.log(this.userGuesses.includes(testVar) ? [String(testVar).toUpperCase(), " "] : ["_", " "]);
    },

    progressDisplay: function () {
        var currentTarget = wordsToGuess[currentTargetIndex];
        //foreach char in the array, add it and a space if you can find it in the user guesses, otherwise add _ and a space.
        var asArray = map(currentTarget, x => (this.userGuesses.includes(x) ? String(x).toUpperCase() : "_") );
        
        var asStringWithSpaces = asArray.join(' ');

        //update the website
        document.getElementById("activeWord").innerHTML = asStringWithSpaces;
        return asStringWithSpaces;
    },

    handleKeyPress: function(key) {
        //Ignore repicks.
        if(!userGuesses.includes(key)) {
            //Your robot overlords are happy to count non-alpha keys as wrong guesses.
            //petition if you think our compassion subroutines are at all likely to activate.
            userGuesses.push(key);
            numGuessesLeft--;
            progressDisplay();
        }
    }
};

document.onkeyup = function (event) {
    hangManGame.handleKeyPress(event.key);
}