const getDate = (state = null, action) => {
    if (action.type === 'web3Infos'){
        return {
            provider: action.provider,
            address: action.address
        }
    } else if (action.type === "accountChanged"){
        let stateCopy = {...state};
        stateCopy.address = action.address;
        return stateCopy
    } else if (action.type === "chainChanged"){
        let stateCopy = {...state};
        stateCopy.provider.chainId = action.chainId;
        return stateCopy
    }
     else {
        return state
    }
};

export default getDate;