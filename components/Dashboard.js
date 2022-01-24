import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Grid, Row, Col, List, Avatar, Button, Tag, Badge, Empty, Typography, Statistic, Divider } from 'antd';
import { DollarOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useIsomorphicEffect } from '../utils/IsomorphicEffect';
import styles from '../styles/Bets.module.css';

// const userBets = [
//     {
//         matchId: 718484,
//         league: "fr",
//         homeTeam: "Lyon",
//         awayTeam: "Marseille",
//         amountBet: 1,
//         teamSelected: "draw",
//         date: new Date().toLocaleDateString()
//     },
//     {
//         matchId: 718487,
//         league: "fr",
//         homeTeam: "PSG",
//         awayTeam: "Nantes",
//         amountBet: 2,
//         teamSelected: "home",
//         date: new Date().toLocaleDateString()
//     }
// ];
const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function AllBets() {

    const dispatch = useDispatch();
    const player = useSelector(state => state.player);
    const change = useSelector(state => state.change);
    const router = useRouter();
    const screens = useBreakpoint();

    const [betsList, setBetsList] = useState([]);
    const [number, setNumber] = useState(0);
    const [winPercentage, setWinPercentage] = useState(0);
    const [win, setWin] = useState(0);
    const [lost, setLost] = useState(0);

    const isomorphicEffect = useIsomorphicEffect();

    isomorphicEffect(() => {
        (async () => {
            if (player !== null) {
            
            setBetsList(player.betsList.filter(bet => (!bet.claimed && new Date(bet.date) <= new Date() )|| new Date(bet.date) >= new Date()));
            const prevBets = player.betsList.filter(bet => bet.claimed && new Date(bet.date) < new Date());
            setNumber(prevBets.length);
            let correctBets = 0;
            let amountWon = 0;
            let amountLost = 0;
            for (let bet of prevBets) {
                if (bet.win) {
                    amountWon += bet.gain;
                    correctBets++;
                } else {
                    amountLost += bet.amountBet
                }
            };
            setWinPercentage(correctBets * 100 / prevBets.length);
            setWin(amountWon);
            setLost(amountLost);
            if (change === null) {
                const request = await fetch('/api/crypto-price');
                const response = await request.json();
                dispatch({ type: 'getValue', value: response.value })
            }
        }
    })();
    }, [player]);


    if (player === null) {
        return (
            <Row style={{ margin: 10, width: '100%' }}>
                <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                    <Empty
                        image="/wallet.png"
                        description="Please connect your MetaMask wallet to access to your dahboard"
                    >
                        {/* <Button
                        icon={<EyeOutlined />}
                        type="primary"
                        shape="round"
                        onClick={() => router.push("/")}
                    >
                        See matchs
                    </Button> */}
                    </Empty>
                </Col>
            </Row>
        )
    } else {
        if (player.betsList.length === 0) {
            return (
                <Row style={{ margin: 10, width: '100%' }}>
                    <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                        <Title level={2} style={{ textAlign: 'center', marginTop: 15, marginBottom: 25 }}>You havn't bet yet...</Title>
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                        <Empty
                            description="It's time to bet !"
                        >
                            <Button
                                icon={<EyeOutlined />}
                                type="primary"
                                shape="round"
                                onClick={() => router.push("/")}
                            >
                                See matchs
                            </Button>
                        </Empty>
                    </Col>
                </Row>
            )
        } else {
            return (
                <>
                    <Row style={{ margin: 10, width: '100%' }}>
                        <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                            <Title level={1} style={{ textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Welcome back !</Title>
                        </Col>
                    </Row>
                    <Row style={{ margin: 10, width: '100%' }}>
                        <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                            <Divider style={{marginBottom: 25}}>PREVIOUS</Divider>
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 3, offset: 6 }} className={styles.statComponent}>
                            <Statistic className={styles.stats} title="You bet" value={number} suffix="times" />
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 3 }} className={styles.statComponent}>
                            <Statistic className={styles.stats} title="You were right" value={winPercentage} precision={2} suffix="%" />
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 3 }} className={styles.statComponent}>
                            <Statistic className={styles.stats} title="You won" value={win * change} valueStyle={{ color: '#3f8600' }} precision={2} suffix="€" />
                            <Tag className={styles.conversion} color="gold">{`${win.toFixed(2)} ETH`}</Tag>
                        </Col>
                        <Col xs={{ span: 12 }} md={{ span: 3 }} className={styles.statComponent}>
                            <Statistic className={styles.stats} title="You lost" value={lost * change} valueStyle={{ color: '#cf1322' }} precision={2} suffix="€" />
                            <Tag className={styles.conversion} color="gold">{`${lost.toFixed(2)} ETH`}</Tag>
                        </Col>
                    </Row>
                    <Row style={{ margin: 10, width: '100%' }}>
                        <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                            <Divider style={{marginBottom: 25}}>INCOMING</Divider>
                        </Col>
                        <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                            <List
                                bordered
                                style={{ width: '100%' }}
                                itemLayout="horizontal"
                                dataSource={betsList}
                                renderItem={item =>
                                (<List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={`/picto-${item.league}.png`} />}
                                        title={`${item.homeTeam} - ${item.awayTeam}`}
                                        description={<Tag icon={<ClockCircleOutlined />} color={new Date(item.date) < new Date() ? "#ff4d4e" : "#87d068"}>{new Date(item.date) > new Date() ? 'Incoming' : 'Finished'}</Tag>}
                                    />
                                    {screens.sm &&
                                        <div style={{ marginRight: 25 }}>
                                            <Badge count={item.amountBet} color="blue">
                                                <Avatar src="/picto-ethereum.png" />
                                            </Badge>
                                        </div>
                                    }
                                    {screens.sm &&
                                        <div>
                                            <Tag icon={<DollarOutlined />} color="#FAAC14">{item.teamSelected}</Tag>
                                        </div>
                                    }
                                    <div>
                                        <Button
                                            // shape="round"
                                            ghost
                                            type="primary"
                                            icon={<EyeOutlined />}
                                            onClick={() => router.push(`/result/${item.matchId}`)}
                                        >
                                            DETAILS
                                        </Button>
                                    </div>
                                </List.Item>
                                )}
                            />
                        </Col>
                    </Row>
                </>

            )
        }
    }
};