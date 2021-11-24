import { useEffect, useState } from 'react';
import { Image, Typography, Statistic, Tag, Button, Result } from 'antd';
import styles from '../../styles/Result.module.css';
import { server } from '../../config';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import TopMenu from '../../components/Navbar';
import { getBetInfos, distributePrizes } from '../../utils/SC-functions';

const { Title, Paragraph } = Typography;
const { Countdown } = Statistic;

// const result = {
//     matchId: 718489,
//     homeTeamId: 95,
//     awayTeamId: 93,
//     status: "Match Finished",
//     score: "1 - 1",
//     winner: "draw",
//     amountBet: 0.001,
//     date: "2021-11-21T14:00:00.000+00:00",
//     claimed: false,
//     players: ["6194e50e9e3ec23efcd97ab7"]
// };

// const playerBet = {
//     amountBet: 0.001,
//     teamSelected: "home"
// };

// const betsHomeTeam = 0.001;
// const betsAwayTeam = 0;
// const betsDraw = 0;

const ResultPage = ({result}) => {

    const [betsHomeTeam, setBetsHomeTeam] = useState(0);
    const [betsAwayTeam, setBetsAwayTeam] = useState(0);
    const [betsDraw, setBetsDraw] = useState(0);

    const player = useSelector(state => state.player);
    const web3 = useSelector(state => state.web3);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (web3 !== null) {
            (async () => {
                const loadBets = await getBetInfos(web3.provider, web3.address, id);
                setBetsHomeTeam(loadBets.homeTeam);
                setBetsAwayTeam(loadBets.awayTeam);
                setBetsDraw(loadBets.draw)
            })()
        };
    }, [web3, id])

    const playerBet = player.betsList.find(e => e.matchId == id);

    let potentialGain;
    let choice;
    switch (playerBet.teamSelected) {
        case 'home':
            potentialGain = playerBet.amountBet + (playerBet.amountBet / (betsHomeTeam + playerBet.amountBet) * (betsAwayTeam + betsDraw));
            choice = result.homeTeam;
            break;
        case 'away':
            potentialGain = playerBet.amountBet + (playerBet.amountBet / (betsAwayTeam + playerBet.amountBet) * (betsHomeTeam + betsDraw));
            choice = result.awayTeam;
            break;
        case 'draw':
            potentialGain = playerBet.amountBet + (playerBet.amountBet / (betsDraw + playerBet.amountBet) * (betsHomeTeam + betsAwayTeam));
            choice = "a draw"
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>BethClic - result</title>
                <meta name="description" content="A bet training app working on Ethereum Ropsten network !" />
                <link rel="icon" href="/betting.png" />
            </Head>
            <TopMenu />
            <Title level={2}>{result.status}</Title>
            <div className={styles.row}>
                <Image src={`https://media.api-sports.io/football/teams/${result.homeTeamId}.png`} width={80} alt="home team logo" />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Title level={2}>{result.score}</Title>
                    <Tag>{`You bet on ${choice}`}</Tag>
                </div>
                <Image src={`https://media.api-sports.io/football/teams/${result.awayTeamId}.png`} width={80} alt="away team logo" />
            </div>
            {
                result.status !== "Match Finished"
                    ? <div className={styles.row}>
                        <Statistic title="Total bets amount" value={`${result.amountBet} ETH`} />
                        <Statistic title="Number of bettors" value={result.players.length} />
                        <Statistic title="Your bet" value={`${playerBet.amountBet} ETH`} />
                        <Statistic title="Potential gain" value={`${potentialGain} ETH`} />
                    </div>
                    : <Result
                        status={result.winner === playerBet.teamSelected ? "success" : "error"}
                        title={result.winner === playerBet.teamSelected ? "Great !" : "Bad news..."}
                        subTitle={
                            result.winner === playerBet.teamSelected
                                ? `You win ${potentialGain} ETH !`
                                : `You lose ${playerBet.amountBet} ETH...`
                        }
                        extra={
                            !result.claimed && result.winner === playerBet.teamSelected
                                ? <Button
                                    type="primary"
                                    size="large"
                                    shape="round"
                                    onClick={() => distributePrizes(web3, id, result.winner)}
                                >
                                    Claim your gain
                                </Button>
                                : null
                        }
                    />
            }
        </div>
    )
};

export default ResultPage;

export async function getServerSideProps({ params }) {
    let bet;
    const getBetDetails = await fetch(`${server}/api/bets/one?matchId=${params.id}`);
    const betDetails = await getBetDetails.json();
    if (betDetails.success) {
        bet = betDetails.bet;
        bet.status = "Not Started";
        bet.score = null;
        bet.winner = null;
        if (new Date() > new Date(bet.date)) {
            const getResult = await fetch(`${server}/api/result?matchId=${params.id}`);
            const response = await getResult.json();
            bet.status = response.result.status;
            bet.score = response.result.score;
            bet.winner = response.result.winner;
        }
    }
    return {
        props: { result: bet }
    }
}