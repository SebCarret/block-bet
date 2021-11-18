const player = (player = null, action) => {
    if (action.type === 'playerInfos' ) {
        console.log(action.player);
        return action.player
    } else {
        return player
    }
};

export default player;