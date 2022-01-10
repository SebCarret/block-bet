import unirest from 'unirest';

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    unirest.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${req.query.leagueId}&season=2021`)
      .header({ 'x-rapidapi-key': process.env.API_FOOTBALL_KEY, 'x-rapidapi-host': 'api-football-v1.p.rapidapi.com/v3/' })
      .then(results => {
        res.status(200).json({success: true, calendar: results.body.response });
        resolve()
      })
      .catch(error => {
        res.status(400).json({success: false, error});
        resolve();
    })
  })
};
