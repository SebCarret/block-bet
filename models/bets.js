import mongoose from 'mongoose';

const betSchema = mongoose.Schema({
    matchId: Number,
    league: String,
    homeTeam: String,
    awayTeam: String,
    amountBet: Number,
    date: Date,
    players: [{type: mongoose.Schema.Types.ObjectId, ref: 'players'}]
});

export default mongoose.models.Bets || mongoose.model('Bets', betSchema);