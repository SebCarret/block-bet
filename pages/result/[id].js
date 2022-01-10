import { useEffect, useState } from 'react';
import { Row, Col, Image, Typography, Statistic, Tag, Button, Result, Badge } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import styles from '../../styles/Result.module.css';
import { server } from '../../config';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import TopMenu from '../../components/Navbar';
import { getBetInfos, distributePrizes } from '../../utils/SC-functions';
import { useIsomorphicEffect } from '../../utils/IsomorphicEffect';

const { Title } = Typography;
const { Countdown } = Statistic;

const ResultPage = ({ result }) => {

    const [betsHomeTeam, setBetsHomeTeam] = useState(0);
    const [betsAwayTeam, setBetsAwayTeam] = useState(0);
    const [betsDraw, setBetsDraw] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isClaimed, setIsClaimed] = useState(result.claimed);

    const player = useSelector(state => state.player);
    const web3 = useSelector(state => state.web3);
    const change = useSelector(state => state.change);
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;

    const isomorphicEffect = useIsomorphicEffect();

    isomorphicEffect(() => {
        if (web3 !== null) {
            (async () => {
                const loadBets = await getBetInfos(web3.provider, web3.address, id);
                setBetsHomeTeam(loadBets.homeTeam);
                setBetsAwayTeam(loadBets.awayTeam);
                setBetsDraw(loadBets.draw);
                if (change === null) {
                    const request = await fetch('/api/crypto-price');
                    const response = await request.json();
                    dispatch({ type: 'getValue', value: response.value })
                  }
            })()
        };
    }, [web3, id])

    const playerBet = player.betsList.find(e => e.matchId == id);

    const onClaimClick = async () => {

        setLoading(true);

        await distributePrizes(web3, id, result.winner);

        const datas = JSON.stringify({
            matchId: id,
            userId: player._id,
            winner: result.winner
        });

        const claimRequest = await fetch('/api/bets/claim', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: datas
        });

        const claimResponse = await claimRequest.json();

        await fetch('/api/player/close', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: datas
        });

        if (claimResponse.success) setIsClaimed(true);
        setLoading(false)
    };

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
            <Row className={styles.row}>
                <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                    <Title level={2} style={{ textAlign: 'center' }}>{result.status}</Title>
                </Col>
            </Row>
            <Row className={styles.row}>
                <Col className={styles.teams} xs={8} md={{ span: 6, offset: 3 }}>
                    <Image preview={false} src={`https://media.api-sports.io/football/teams/${result.homeTeamId}.png`} width={80} alt="home team logo" />
                </Col>
                <Col xs={8} md={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Title level={2}>{result.score}</Title>
                    <Tag>{`You bet on ${choice}`}</Tag>
                </Col>
                <Col className={styles.teams} xs={8} md={6}>
                    <Image preview={false} src={`https://media.api-sports.io/football/teams/${result.awayTeamId}.png`} width={80} alt="away team logo" />
                </Col>
            </Row>
            {
                result.status !== "Match Finished"
                    ? <Row id={styles.lastRow}>
                        <Col className={styles.statistics} xs={12} md={{ span: 4, offset: 4 }}>
                            <Statistic title="Number of bettors" value={result.players.length} />
                        </Col>
                        <Col className={styles.statistics} xs={12} md={4}>
                            <Statistic title="Total bets amount" value={result.amountBet * change} precision={2} suffix="€" />
                            <Tag color="gold" className={styles.conversion}>{`${result.amountBet} ETH`}</Tag>
                        </Col>
                        <Col className={styles.statistics} xs={12} md={4}>
                            <Statistic title="Your bet" value={playerBet.amountBet * change} precision={2} suffix="€" />
                            <Tag color="gold" className={styles.conversion}>{`${playerBet.amountBet} ETH`}</Tag>
                        </Col>
                        <Col className={styles.statistics} xs={12} md={4}>
                            <Statistic title="Potential gain" value={potentialGain * change} precision={2} suffix="€" />
                            <Tag color="gold" className={styles.conversion}>{`${potentialGain} ETH`}</Tag>
                        </Col>
                    </Row>
                    : <Result
                        status={result.winner === playerBet.teamSelected ? "success" : "error"}
                        title={result.winner === playerBet.teamSelected ? "Great !" : "Bad news..."}
                        subTitle={
                            result.winner === playerBet.teamSelected
                                ? `You win ${(potentialGain * change).toFixed(2)} € !`
                                : `You lose ${(playerBet.amountBet * change).toFixed(2)} €...`
                        }
                        extra={
                            !isClaimed && result.winner === playerBet.teamSelected
                                ? <Button
                                    type="primary"
                                    size="large"
                                    shape="round"
                                    icon={<DollarOutlined />}
                                    loading={loading}
                                    onClick={onClaimClick}
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
};