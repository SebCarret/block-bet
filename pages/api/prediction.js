import unirest from 'unirest';

export default function handler(req, res) {
    try {
        unirest.get(`https://api-football-v1.p.rapidapi.com/v3/predictions?fixture=${req.query.matchId}`)
            .header({ 'x-rapidapi-key': process.env.API_FOOTBALL_KEY, 'x-rapidapi-host': 'api-football-v1.p.rapidapi.com/v3/' })
            .end(function (results) {
                const fixture = {
                    homeTeam: results.body.response[0].teams.home.name,
                    homeLogo: results.body.response[0].teams.home.logo,
                    awayTeam: results.body.response[0].teams.away.name,
                    awayLogo: results.body.response[0].teams.away.logo,
                    homeChance: Number(results.body.response[0].predictions.percent.home.replace("%", "")),
                    drawChance: Number(results.body.response[0].predictions.percent.draw.replace("%", "")),
                    awayChance: Number(results.body.response[0].predictions.percent.away.replace("%", ""))
                }
                res.status(200).json({ fixture })
            })
    } catch (error) {
        res.status(400).json({ error })
    }
};
