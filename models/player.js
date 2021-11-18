import mongoose from 'mongoose';

const betsSchema = mongoose.Schema({
    matchId: Number,
    league: String,
    homeTeam: String,
    awayTeam: String,
    amountBet: Number,
    teamSelected: String,
    date: Date
});

const playerSchema = mongoose.Schema({
    address: String,
    betsList: [betsSchema]
})

export default mongoose.models.Players || mongoose.model('Players', playerSchema);