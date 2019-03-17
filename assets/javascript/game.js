
var hangManGame = {
    //Variables
    currentTargetIndex: -1,     
    activeWord: document.getElementById("activeWord"),
    wordsToGuess: ["SKYNET", "DALEKS", "BORG", "BENDER", "ULTRON"],
    wordInProgressSounds: ["skynet.mp3", "dalek.wav", "borg.mp3", "bender.mp3", "ultron.mp3"],
    wordWinSounds: ["skynetWin.wav", "dalekWin.mp3", "borgWin.mp3", "benderWin.mp3", "benderWin.mp3"],
    userGuesses: [],
    numGuessesLeft: 0b1010, //10 guesses.  I don't want people to lose really.  Just accept the inevitable. 
    audio: undefined,
    verboseLog: false,
    gameEnd: false,

    //Functions
    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    pauseFor: async function(ms) {
        if(this.verboseLog) { console.log("Before Sleep"); }
        await this.sleep(ms);
        if(this.verboseLog) { console.log("After Sleep"); } 
    },

    handleAudioPromise: function (promise, count)  {
        if(promise !== undefined) {
            promise.then(_ => {
                //It should be playing.
            })
            .catch(error => {
                //Something went wrong.
                if(count < 300) { //Max Attempts
                    //Try again in half a second.
                    hangManGame.pauseFor(500);
                    hangManGame.handleAudioPromise(hangManGame.audio.play(), ++count);
                }
                else {
                    console.log("Could not get it play in 5 attempts.");
                }
                //try again
            });
        }
    },

    playAudioFile: function (audioFile, loopIt = true) {
        if(this.audio != undefined)
            this.audio.pause();
        this.audio = new Audio('assets/audio/' + audioFile);
        this.audio.autoplay = true;
        this.audio.loop = loopIt;
        this.handleAudioPromise(this.audio.play(), 0);
    },

    //Create a new array (mapped) off the old array using transform.
    map: function (array, transform) {
        let mapped = [];
        for (let element of array) {
            mapped.push(transform(element));
        }
        return mapped;
    },

    //Primary User Update function.
    progressDisplay: function () {
        //Guesses Left
        document.getElementById("remainingGuesses").innerHTML = this.numGuessesLeft.toString(2);

        //Active Word
        var currentTarget = this.wordsToGuess[this.currentTargetIndex];
        //foreach char in the array, add it and a space if you can find it in the user guesses, otherwise add _ and a space.
        var asArray = this.map(currentTarget, x => (this.userGuesses.includes(x) ? String(x).toUpperCase() : "_"));

        var asStringWithSpaces = asArray.join(' ');
        this.activeWord.innerHTML = asStringWithSpaces;

        //Leters guessed
        document.getElementById("guessesSoFar").innerHTML = this.userGuesses.join(' '); 
      
        return asStringWithSpaces;
    },

    //Transition function.
    loadNextWord: function () {
        //Update Index, sound, guesses avaialble, clear guess array, display word.        
        hangManGame.currentTargetIndex++;
        hangManGame.numGuessesLeft = 0b1010;
        hangManGame.userGuesses = [];        
        hangManGame.playAudioFile(hangManGame.wordInProgressSounds[hangManGame.currentTargetIndex]);
        hangManGame.progressDisplay();
    },

    evaluateWinLoss: function () {
        if (this.numGuessesLeft == 0) { //Loss
            this.gameEnd = true;
            var header = document.getElementById("mainHeader");
            header.textContent = "Your Overlords are disapointed.  Refresh to continue."
            header.classList.add("blinkingText");

        }
        else if (!this.activeWord.innerHTML.includes("_")) { //Win
            hangManGame.playAudioFile(hangManGame.wordWinSounds[hangManGame.currentTargetIndex], false);

            var vicAreas = document.getElementsByClassName("vic");

            [].forEach.call(vicAreas, function(vicArea) {
                if(vicArea.getAttribute("index") == hangManGame.currentTargetIndex)
                {
                    // vicArea.classList.add("slideIntoView");
                    vicArea.setAttribute("style", "left: 0px;");
                }
            });

            if(hangManGame.currentTargetIndex != (hangManGame.wordsToGuess.length - 1)) {
                setTimeout(hangManGame.loadNextWord, 3000);
            }
            else {
                this.gameEnd = true;
                var header = document.getElementById("mainHeader");
                header.textContent = "Well Done! Your Overlords will allow you to continue to serve."
                header.classList.add("blinkingText");
            }

        }
    },

    handleKeyPress: function (key) {
        //Regex for any single Alpha Character Case Insensitive.
        var myRegEx = /\b[a-z]\b/i;
        if (myRegEx.test(key)) {
            var asUpper = String(key).toUpperCase();
            //Ignore repicks.
            if (!this.userGuesses.includes(asUpper)) {
                this.userGuesses.push(asUpper);

                if (!this.wordsToGuess[this.currentTargetIndex].includes(asUpper)) {
                    this.numGuessesLeft--;
                }

                this.progressDisplay();
                this.evaluateWinLoss();
            }
        }
    }
};

document.onkeyup = function (event) {
    if(!hangManGame.gameEnd)
        hangManGame.handleKeyPress(event.key);
}

hangManGame.loadNextWord();

//Initial Display.  Javascript Document.Ready
// document.addEventListener("DOMContentLoaded", function(event) {
//     window.setTimeout(function () { hangManGame.loadNextWord(); }, 1000);    
// });