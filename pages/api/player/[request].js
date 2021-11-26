import DbConnect from '../../../models/connection';
import playerModel from '../../../models/player';
import bcrypt from 'bcrypt';
import BetsList from '../../bets/[type]';

const playerInfo = async (req, res) => {

    const { request } = req.query;

    await DbConnect();

    switch (request) {
        case 'connect':
            try {
                const player = await playerModel.findOne({ address: req.body.address });
                if (!player) {
                    const newPlayer = new playerModel({ address: req.body.address });
                    const playerSaved = await newPlayer.save();
                    playerSaved ? res.status(200).json({ success: true, player: playerSaved }) : res.status(200).json({ success: false, error: "This player already exists in bethClic database sorry..." })
                } else {
                    res.status(200).json({ success: true, player })
                }
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'add-bet':
            try {
                let success = false;
                let message;
                let playerUpdated;
                const player = await playerModel.findById(req.body.userId);
                if (player) {
                    let bet = await player.betsList.find(e => e.matchId == req.body.matchId);
                    if (!bet) {
                        let matchId = Number(req.body.matchId);
                        let amountBet = Number(req.body.amountBet);
                        player.betsList.push({
                            matchId: matchId,
                            league: req.body.league,
                            homeTeam: req.body.homeTeam,
                            awayTeam: req.body.awayTeam,
                            amountBet: amountBet,
                            teamSelected: req.body.teamSelected,
                            claimed: false,
                            win: false,
                            date: req.body.date
                        });
                        const betSaved = await player.save();
                        if (betSaved) {
                            success = true;
                            message = "Bet saved for this player !";
                            playerUpdated = betSaved
                        } else {
                            message = "An error occured during saving bet... Please try again"
                        }
                    } else {
                        message = "A bet already exists on this match"
                    }
                } else {
                    message = "This player doesn't exist sorry..."
                };
                res.status(200).json({ success, message, player: playerUpdated })
            } catch (error) {
                res.status(400).json({ success: false, message: error })
            }
            break;
        case 'close':
            try {
                let success = false;
                let message
                const player = await playerModel.findById(req.body.userId);
                if (player){
                    const matchId = Number(req.body.matchId);
                    const betToFind = player.betsList.find(bet => bet.matchId == matchId);
                    if (betToFind){
                        betToFind.claimed = true;
                        if (betToFind.teamSelected === req.body.winner) betToFind.win = true;
                        const playerSaved = await player.save();
                        if (playerSaved){
                            success = true;
                            message = "Bet updated for this player !"
                        } else {
                            message = "Error while updating bet for this player... Please try again"
                        }
                    } else {
                        message = "No bet found with this match ID..."
                    }
                } else {
                    message = "No player found with this ID..."
                };
                res.status(200).json({success, message})
            } catch (error) {
                res.status(400).json({ success: false, message: error })
            }
    }
};

export default playerInfo;