import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { List, Avatar, Button, Badge, Empty, Spin } from 'antd';
import { DollarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { server } from '../config';

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

export default function AllBets() {

    const [betsList, setBetsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadList = async () => {
            const request = await fetch(`${server}/api/bets/all`);
            const response = await request.json();
            if (response.success) {
                for (let bet of response.list) {
                    bet.players = bet.players.length;
                    bet.date = new Date(bet.date).toLocaleDateString()
                }
                setBetsList(response.list);
                setLoading(false)
            };

        };
        loadList()
    }, []);

    if (loading) {
        return <Spin size="large" style={{marginTop: 25}} />
    } else {
        if (betsList.length === 0) {
            return (<>
                <h1>No incoming bets...</h1>
                <Empty
                    description="Be the next to bet on a match !"
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
            </>)
        } else {
            return (
                <>
                    <h1>Bets availables</h1>
                    <List
                        bordered
                        style={{ width: '50%' }}
                        itemLayout="horizontal"
                        dataSource={betsList}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={`/picto-${item.league}.png`} />}
                                    title={`${item.homeTeam} - ${item.awayTeam}`}
                                    description={item.date}
                                />
                                <div style={{ marginRight: 25 }}>
                                    <Badge count={item.amountBet} color="blue">
                                        <Avatar src="/picto-ethereum.png" />
                                    </Badge>
                                </div>
                                <div style={{ marginRight: 25 }}>
                                    <Badge count={item.players} color="blue">
                                        <Avatar icon={<UserOutlined />} />
                                    </Badge>
                                </div>
                                <div>
                                    <Button
                                        shape="round"
                                        type="primary"
                                        icon={<DollarOutlined />}
                                        onClick={() => router.push(`/match/${item.matchId}`)}
                                    >
                                        BET
                                    </Button>
                                </div>
                            </List.Item>
                        )}
                    />
                </>
            )
        }
    }
};