const change = (state = null, action) => {
    if (action.type === 'getValue'){
        return action.value
    } else {
        return state
    }
};

export default change;