import Web3 from 'web3';

const getWeb3 = () => {
    let web3;
    try {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum)
            try {
                window.ethereum.enable()
            } catch (error) {
                console.log("connection to Ethereum rejected by user");
            }
        } else if (window.web3){
            web3 = new Web3(window.web3.currentProvider);
            console.log("connection to another provider");
        } else {
            console.log('Please install MetaMask to access Ethereum blockchain !')
        }
    } catch (error) {
        console.log(error);
    };
    return web3
};

export default getWeb3;