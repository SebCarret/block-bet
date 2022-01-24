const player = (player = null, action) => {
    if (action.type === 'playerInfos' ) {
        return action.player
    } else if (action.type === 'betUpdated'){
        let playerCopy = {...player};
        let betToFind = playerCopy.betsList.find(e => e.matchId === action.bet.matchId);
        betToFind.claimed = action.bet.claimed;
        if (action.bet.win){
            betToFind.win = action.bet.win;
            betToFind.gain = action.bet.gain
        }
        return playerCopy;
    } else {
        return player
    }
};

export default player;