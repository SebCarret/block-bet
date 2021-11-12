const getDate = (state = null, action) => {
    if (action.type === 'web3Infos'){
        return {
            provider: action.provider,
            address: action.address
        }
    } else {
        return state
    }
};

export default getDate;