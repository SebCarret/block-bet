const player = (player = null, action) => {
    if (action.type === 'playerInfos' ) {
        return action.player
    } else {
        return player
    }
};

export default player;