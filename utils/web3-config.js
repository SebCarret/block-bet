import Web3 from 'web3';

const getWeb3 = async () => {
    let connected = false;
    let provider;
    let accounts;
    let chainId;
    if (window.ethereum) {
        try {
            connected = true;
            provider = await window.ethereum.on('connect', infos => console.log(infos));
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.log(error);
        }
    };
    return {
        connected,
        provider,
        accounts
    }
};

export default getWeb3;