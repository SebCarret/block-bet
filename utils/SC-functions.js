import contract from '@truffle/contract';
import BettingContract from './Betting.json';

const betContract = contract(BettingContract);
const weiConversion = 1000000000000000000;

export const getBetInfos = async (provider, address, id) => {
    await betContract.setProvider(provider);
    const instance = await betContract.deployed();
    const alreadyBet = await instance.checkPlayerExists(address, id);
    let havePlayerBet = alreadyBet ? true : false;
    const getBetsHome = await instance.AmountHome(id);
    const homeTeam = getBetsHome / weiConversion;
    const getBetsAway = await instance.AmountAway(id);
    const awayTeam = getBetsAway / weiConversion;
    const getBetsDraw = await instance.AmountDraw(id);
    const draw = getBetsDraw / weiConversion;

    return {
        havePlayerBet,
        homeTeam,
        awayTeam,
        draw
    }
};

export const distributePrizes = async (web3, id, result) => {
    await betContract.setProvider(web3.provider);
    const instance = await betContract.deployed();
    await instance.distributePrizes(id, result, { from: web3.address });
};