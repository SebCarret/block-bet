const getDate = (state = null, action) => {
    if (action.type === 'getDate'){
        return action.date
    } else {
        return state
    }
};

export default getDate;