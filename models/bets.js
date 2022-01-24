import mongoose from 'mongoose';

const betSchema = mongoose.Schema({
    matchId: Number,
    league: String,
    homeTeam: String,
    homeTeamId: Number,
    awayTeam: String,
    awayTeamId: Number,
    amountBet: Number,
    date: Date,
    claimed: Boolean,
    players: [{type: mongoose.Schema.Types.ObjectId, ref: 'Players'}]
});

export default mongoose.models.Bets || mongoose.model('Bets', betSchema);