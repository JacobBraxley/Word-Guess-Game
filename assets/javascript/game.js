
var winCount = 0;
var lossCount = 0;
var numGuessesLeft = 0;
var currentTargetIndex = -1;
var wordsToGuess = [];
var wordWinSounds = [];
var userGuesses = [];
var revealedWord = "";

var playAudioFile = function (audioFile) { new Audio('assets/audio/' + audioFile).play(); };