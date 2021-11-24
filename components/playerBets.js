import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { List, Avatar, Button, Tag, Badge, Empty } from 'antd';
import { DollarOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

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

export default function AllBets() {

    const player = useSelector(state => state.player);
    const router = useRouter();

    const [betsList, setBetsList] = useState([]); 

    useEffect(() => {
        if (player !== null) setBetsList(player.betsList)
    }, [player]);


    if (player === null) {
        return (
            <>
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
            </>
        )
    } else {
        if (player.betsList.length === 0) {
            return (
                <>
                    <h1>You havn't bet yet...</h1>
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
                </>
            )
        } else {
            return (
                <>
                    <h1>Your bets</h1>
                    <List
                        bordered
                        style={{ width: '50%' }}
                        itemLayout="horizontal"
                        dataSource={betsList}
                        renderItem={item =>
                        (<List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={`/picto-${item.league}.png`} />}
                                title={`${item.homeTeam} - ${item.awayTeam}`}
                                description={<Tag icon={<ClockCircleOutlined />} color={new Date(item.date) < new Date() ? "#ff4d4e" : "#87d068"}>
                                    {new Date(item.date) > new Date() ? 'Incoming' : 'Finished'}
                                    </Tag>}
                            />
                            <div style={{ marginRight: 25 }}>
                                <Badge count={item.amountBet} color="blue">
                                    <Avatar src="/picto-ethereum.png" />
                                </Badge>
                            </div>
                            <div>
                                <Tag icon={<DollarOutlined />} color="#FAAC14">{item.teamSelected}</Tag>
                            </div>
                            <div>
                                <Button
                                    shape="round"
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
                </>
            )
        }
    }
};