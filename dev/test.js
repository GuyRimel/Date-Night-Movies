// this is just awful. don't run this!

let 
  isDodoExtinct = true,
  reactionToDodoExtinction = 'we killed them all. WHYYY?',
  reactionToDodoSurvival = 'still got \'em, let\'s eat one!',
  interval = 3000;

function obsessOverNews() {
  setInterval( () => {
    (isDodoExtinct === true) ?
      console.log(reactionToDodoExtinction + 'obsessed: ' + new Date()) :
      console.log(reactionToDodoSurvival + 'obsessed: ' + new Date());
  }, interval);
  getMoreFrantic();
}

function getMoreFrantic() {
  setInterval(() => {
    (isDodoExtinct === true) ?
    reactionToDodoExtinction += '?' :
    reactionToDodoSurvival += '!';
  }, interval + 500);
  console.log('got frantic: ' + new Date());
}

function maddeningCycle() {
  obsessOverNews();
}

for(i=0; i<3; i++){
  maddeningCycle();
}