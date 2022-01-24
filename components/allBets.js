import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid, Row, Col, List, Avatar, Button, Badge, Empty, Spin, Typography } from 'antd';
import { DollarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { server } from '../config';
import { useIsomorphicEffect } from '../utils/IsomorphicEffect';
import { useDispatch } from 'react-redux';

// const allBets = [
//     {
//         matchId: 718484,
//         league: "fr",
//         homeTeam: "Lyon",
//         awayTeam: "Marseille",
//         players: 5,
//         amountBet: 5,
//         date: new Date().toLocaleDateString()
//     },
//     {
//         matchId: 718487,
//         league: "fr",
//         homeTeam: "PSG",
//         awayTeam: "Nantes",
//         players: 10,
//         amountBet: 5,
//         date: new Date().toLocaleDateString()
//     },
//     {
//         matchId: 718490,
//         league: "fr",
//         homeTeam: "Troyes",
//         awayTeam: "Saint Etienne",
//         players: 8,
//         amountBet: 5,
//         date: new Date().toLocaleDateString()
//     }
// ];

const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function AllBets() {

    const [betsList, setBetsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const screens = useBreakpoint();
    const dispatch = useDispatch();

    const isomorphicEffect = useIsomorphicEffect();

    isomorphicEffect(() => {
        const loadList = async () => {
            const request = await fetch('/api/bets/all');
            const response = await request.json();
            if (response.success) {
                for (let bet of response.list) {
                    bet.players = bet.players.length;
                }
                setBetsList(response.list);
                setLoading(false)
            };

        };
        loadList()
    }, []);

    if (loading) {
        return <Spin size="large" style={{ marginTop: 25 }} />
    } else {
        if (betsList.length === 0) {
            return (<Row style={{ margin: 10, width: '100%' }}>
                <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                    <Title level={2} style={{ textAlign: 'center', marginTop: 15, marginBottom: 25 }}>No incoming bets...</Title>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                    <Empty
                        description="Be the next to bet on a match !"
                    >
                        <Button
                            icon={<EyeOutlined />}
                            type="primary"
                            // shape="round"
                            size="large"
                            onClick={() => router.push("/")}
                        >
                            See matchs
                        </Button>
                    </Empty>
                </Col>
            </Row>)
        } else {
            return (
                <Row style={{ margin: 10, width: '100%' }}>
                    <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                        <Title level={2} style={{ textAlign: 'center', marginTop: 15, marginBottom: 25 }}>Bets availables</Title>
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                        <List
                            bordered
                            style={{ width: '100%' }}
                            itemLayout="horizontal"
                            dataSource={betsList}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={`/picto-${item.league}.png`} />}
                                        title={`${item.homeTeam} - ${item.awayTeam}`}
                                        description={screens.sm === false ? `Players : ${item.players} - Amount : ${item.amountBet} ETH` : new Date(item.date).toLocaleDateString()}
                                    />
                                    {screens.sm &&
                                        <div style={{ marginRight: 25 }}>
                                            <Badge count={item.amountBet} color="blue">
                                                <Avatar src="/picto-ethereum.png" />
                                            </Badge>
                                        </div>}
                                    {screens.sm &&
                                        <div style={{ marginRight: 25 }}>
                                            <Badge count={item.players} color="blue">
                                                <Avatar icon={<UserOutlined />} />
                                            </Badge>
                                        </div>
                                    }
                                    <div>
                                        <Button
                                            // shape="round"
                                            ghost
                                            type="primary"
                                            icon={<DollarOutlined />}
                                            onClick={() => {
                                                dispatch({ type: 'getDate', date: item.date });
                                                router.push(`/match/${item.matchId}`)
                                            }}
                                        >
                                            BET
                                        </Button>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            )
        }
    }
};