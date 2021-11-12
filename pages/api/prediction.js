import unirest from 'unirest';

export default function handler(req, res) {
    try {
        unirest.get(`https://api-football-v1.p.rapidapi.com/v3/predictions?fixture=${req.query.matchId}`)
            .header({ 'x-rapidapi-key': process.env.API_FOOTBALL_KEY, 'x-rapidapi-host': 'api-football-v1.p.rapidapi.com/v3/' })
            .end(function (results) {

                let lastHomeResults = results.body.response[0].teams.home.league.form;
                lastHomeResults = lastHomeResults.slice(lastHomeResults.length - 5);
                let lastAwayResults = results.body.response[0].teams.away.league.form;
                lastAwayResults = lastAwayResults.slice(lastAwayResults.length - 5);
                const homeStats = {
                    played: results.body.response[0].teams.home.league.fixtures.played.home,
                    win: results.body.response[0].teams.home.league.fixtures.wins.home,
                    draw: results.body.response[0].teams.home.league.fixtures.draws.home,
                    lose: results.body.response[0].teams.home.league.fixtures.loses.home,
                };
                const awayStats = {
                    played: results.body.response[0].teams.away.league.fixtures.played.away,
                    win: results.body.response[0].teams.away.league.fixtures.wins.away,
                    draw: results.body.response[0].teams.away.league.fixtures.draws.away,
                    lose: results.body.response[0].teams.away.league.fixtures.loses.away,
                };

                const fixture = {
                    home: {
                        team: results.body.response[0].teams.home.name,
                        logo: results.body.response[0].teams.home.logo,
                        lastResults: lastHomeResults.split(''),
                        homeStats
                    },
                    away: {
                        team: results.body.response[0].teams.away.name,
                        logo: results.body.response[0].teams.away.logo,
                        lastResults: lastAwayResults.split(''),
                        awayStats
                    },
                    predictions: {
                        home: Number(results.body.response[0].predictions.percent.home.replace("%", "")),
                        draw: Number(results.body.response[0].predictions.percent.draw.replace("%", "")),
                        away: Number(results.body.response[0].predictions.percent.away.replace("%", ""))
                    }
                }
                res.status(200).json({ fixture })
            })
    } catch (error) {
        res.status(400).json({ error })
    }
};
