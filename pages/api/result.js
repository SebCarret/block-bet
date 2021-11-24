import unirest from 'unirest';

export default async function handler(req, res) {
    try {
        await unirest.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${req.query.matchId}`)
            .header({ 'x-rapidapi-key': process.env.API_FOOTBALL_KEY, 'x-rapidapi-host': 'api-football-v1.p.rapidapi.com/v3/' })
            .end(function (results) {
                const date = new Date(results.body.response[0].fixture.date);   
                let status = results.body.response[0].fixture.status.long;
                let score = status === "Match Finished" ? `${results.body.response[0].goals.home} - ${results.body.response[0].goals.away}` : null;
                let winner;
                switch (results.body.response[0].teams.home.winner) {
                    case true:
                        winner = "home";
                        break;
                    case false:
                        winner = "away"
                        break;
                    default: 
                        winner = status === "Match Finished" ? "draw" : null
                        break;
                }
                const result = {
                    status,
                    date,
                    // homeTeam: results.body.response[0].teams.home.name,
                    // homeLogo: results.body.response[0].teams.home.logo,
                    // awayTeam: results.body.response[0].teams.away.name,
                    // awayLogo: results.body.response[0].teams.away.logo,
                    score,
                    winner
                }
                res.status(200).json({ result })
            });
    } catch (error) {
        res.status(400).json({ error })
    }
};
