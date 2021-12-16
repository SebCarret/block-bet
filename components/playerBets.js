import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Grid, Row, Col, List, Avatar, Button, Tag, Badge, Empty, Typography } from 'antd';
import { DollarOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useIsomorphicEffect } from '../utils/IsomorphicEffect';

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

    const player = useSelector(state => state.player);
    const router = useRouter();
    const screens = useBreakpoint();

    const [betsList, setBetsList] = useState([]);
    const isomorphicEffect = useIsomorphicEffect();

    isomorphicEffect(() => {
        if (player !== null) setBetsList(player.betsList)
    }, [player]);


    if (player === null) {
        return (
            <Row style={{ margin: 10, width: '100%' }}>
                <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                    <Empty
                        image="/wallet.png"
                        description="Please connect your MetaMask wallet to see your bets"
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
                <Row style={{ margin: 10, width: '100%' }}>
                    <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                        <Title level={2} style={{ textAlign: 'center', marginTop: 15, marginBottom: 25 }}>Your bets</Title>
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
            )
        }
    }
};