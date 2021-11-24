import DbConnect from '../../../models/connection';
import playerModel from '../../../models/player';
import betsModel from '../../../models/bets';

const handleBet = async (req, res) => {

    const { type } = req.query;

    await DbConnect();

    switch (type) {
        case 'all':
            try {
                const allBets = await betsModel.find();
                let finalList = allBets.length > 0 ? allBets.filter(bet => new Date(bet.date) >= new Date()) : allBets;
                res.status(200).json({ success: true, list: finalList })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'one':
            try {
                const bet = await betsModel.findOne({ matchId: req.query.matchId });
                bet ? res.status(200).json({ success: true, bet }) : res.status(200).json({ success: false, error: "no bet found with this matchId..." })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'claim':
            try {
                const matchId = Number(req.body.matchId);
                const betToUpdate = await betsModel.updateOne({ matchId: matchId }, { claimed: true });
                betToUpdate.modifiedCount === 1
                    ? res.status(200).json({ success: true, message: "this bet is now over !" })
                    : res.status(200).json({ success: false, message: "error while updating this bet... Please try again" })
            } catch (error) {
                res.status(400).json({ success: false, message: error })
            }
            break;
        case 'add':
            try {
                let success = false;
                let message;
                let betToFind = await betsModel.findOne({ matchId: req.body.matchId });
                if (betToFind) {
                    if (!betToFind.players.includes(req.body.userId)) {
                        betToFind.amountBet += Number(req.body.amountBet);
                        betToFind.players.push(req.body.userId);
                        const saveBet = await betToFind.save();
                        if (saveBet) {
                            success = true;
                            message = "player added to players list !"
                        } else {
                            message = "Error while adding player to players list... Please try again"
                        }
                    } else {
                        message = "player already present in players list"
                    }
                } else {
                    let newBet = new betsModel({
                        matchId: Number(req.body.matchId),
                        league: req.body.league,
                        homeTeam: req.body.homeTeam,
                        homeTeamId: req.body.homeTeamId,
                        awayTeam: req.body.awayTeam,
                        awayTeamId: req.body.awayTeamId,
                        amountBet: Number(req.body.amountBet),
                        date: req.body.date,
                        claimed: false,
                        players: [req.body.userId]
                    });
                    const betSaved = await newBet.save();
                    if (betSaved) {
                        success = true;
                        message = "new bet created in database !"
                    } else {
                        message = "error while saving new bet in database... Please try again"
                    }
                }
                res.status(200).json({ success, message })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
            break;
        case 'user':
            try {
                let success = false;
                let list;
                let player = await playerModel.findById(req.query.userId);
                if (player) {
                    success = true;
                    list = player.betsList;
                }
                res.status(200).json({ success, list })
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
    }
};

export default handleBet;

