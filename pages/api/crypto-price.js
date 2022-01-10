import unirest from "unirest";

const getCryptoPrice = async (req, res) => {
    return new Promise((resolve, reject) => {
        unirest.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR")
        .header({'Apikey': process.env.CRYPTOCOMPARE_API_KEY})
        .then(result => {
            res.status(200).json({success: true, value: result.body.EUR});
            resolve();
        })
        .catch(error => {
            res.status(400).json({success: false, error});
            resolve();
        })
    })
};

export default getCryptoPrice;