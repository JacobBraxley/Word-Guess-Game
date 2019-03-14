
var hangManGame = {
    //Variables
    winCount: 0,
    lossCount: 0, //It really depends how you define a loss.  You are acting within the constraints we've defined.
    numGuessesLeft: 0b1010, //10 guesses.  I don't want people to lose really.  Just accept the inevitable. 
    currentTargetIndex: 0,
    wordsToGuess: ["Skynet", "Daleks", "Borg", "Bender", "Ultron"],
    wordInProgressSounds: ["skynet.mp3", "dalek.wav", "borg.mp3", "bender.mp3", "ultron.mp3"],
    wordWinSounds: ["skynetWin.wav", "dalekWin.mp3", "borgWin.mp3", "benderWin.mp3", "benderWin.mp3"],
    userGuesses: [],
    revealedWord: "",
    activeWord: document.getElementById("activeWord"),
    guessesLeftDisplay: document.getElementById("remainingGuesses"),

    //Functions
    playAudioFile: function (audioFile, loopIt = true) {
        var audio = document.getElementById("myAudio");
        audio = new Audio('assets/audio/' + audioFile);
        audio.loop = loopIt;
        audio.play();
    },

    //Create a new array (mapped) off the old array using transform.
    map: function (array, transform) {
        let mapped = [];
        for (let element of array) {
            mapped.push(transform(element));
        }
        return mapped;
    },

    testMe: function (testVar) {
        var search = "bob";

        var result;
        if (this.userGuesses.includes("x")) {
            result = [String("x").toUpperCase(), " "];
        } else {
            result = ["_", " "];
        }
        console.log(result);
        console.log(this.userGuesses.includes(testVar) ? [String(testVar).toUpperCase(), " "] : ["_", " "]);
    },

    progressDisplay: function () {
        this.guessesLeftDisplay.innerHTML = this.numGuessesLeft.toString(2);
        var currentTarget = this.wordsToGuess[this.currentTargetIndex];

        //foreach char in the array, add it and a space if you can find it in the user guesses, otherwise add _ and a space.
        var asArray = this.map(currentTarget, x => (this.userGuesses.includes(x) ? String(x).toUpperCase() : "_"));

        var asStringWithSpaces = asArray.join(' ');

        //update the website
        this.activeWord.innerHTML = asStringWithSpaces;
        return asStringWithSpaces;
    },

    loadNextWord: function () {
        //Update Index, sound, guesses avaialble, clear guess array, display word.
        this.wordInProgressSounds(++this.currentTargetIndex);
        this.numGuessesLeft = 0b1010;
        this.userGuesses = [];
        this.progressDisplay();
    },

    evaluateWinLoss: function () {
        if (this.numGuessesLeft == 0) { //Loss
            var as = "bob";
        }
        else if (!this.activeWord.innerHTML.includes("_")) { //Win
            this.playAudioFile(this.wordWinSounds[this.currentTargetIndex], false);
            window.setTimeout(this.loadNextWord, 3000);
            //TODO add show function for progress.
        }
    },

    handleKeyPress: function (key) {
        var myRegEx = /[^a-z]/i;
        if (!myRegEx.test(key)) {
            var toUpper = String(key).toUpperCase();
            //Ignore repicks.
            if (!this.userGuesses.includes(toUpper)) {
                //Your robot overlords are happy to count non-alpha keys as wrong guesses.
                //petition if you think our compassion subroutines are at all likely to activate.
                this.userGuesses.push(toUpper);
                if (this.wordWinSounds[this.currentTargetIndex].includes(toUpper)) {
                    this.progressDisplay();
                }
                else {
                    this.numGuessesLeft--;
                }

                document.getElementById("guessesSoFar").innerHTML += " " + toUpper;
            }

            this.guessesLeftDisplay.innerHTML = this.numGuessesLeft.toString(2);
            this.evaluateWinLoss();
        }
    }
};

document.onkeyup = function (event) {
    hangManGame.handleKeyPress(event.key);
}

//Initial Display.
hangManGame.progressDisplay();