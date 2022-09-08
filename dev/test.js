// this is just awful. don't run this!

let 
  isDodoExtinct = false,
  reactionToDodoExtinction = 'we killed them all. WHYYY?',
  reactionToDodoSurvival = 'still got \'em, let\'s eat one!',
  counter = 0,
  interval = 3000;

function obsessOverNews() {
  setTimeout( () => {
    (isDodoExtinct === true) ?
    console.log(reactionToDodoExtinction) :
    console.log(reactionToDodoSurvival);
    counter++;
    if(counter < 10) { getFrantic() }
  }, interval);
}

function getFrantic() {
  setTimeout(() => {
    console.log('frantic');
    (isDodoExtinct === true) ?
    reactionToDodoExtinction += '?' :
    reactionToDodoSurvival += '!';
  }, interval + 500);
  obsessOverNews();
}

function maddeningCycle() {
  obsessOverNews();
}

maddeningCycle();
