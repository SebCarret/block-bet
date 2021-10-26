import unirest from 'unirest';

export default function handler(req, res) {
  try {
    unirest.get('https://api-football-v1.p.rapidapi.com/v3/fixtures?league=61&season=2021')
      .header({ 'x-rapidapi-key': process.env.API_FOOTBALL_KEY, 'x-rapidapi-host': 'api-football-v1.p.rapidapi.com/v3/' })
      .end(function (results) {
        res.status(200).json({ calendar: results.body.response })
      })
  } catch (error) {
    res.status(400).json({ error })
  }
};
