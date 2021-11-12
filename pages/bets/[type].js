import { useRouter } from 'next/router';
import styles from '../../styles/Bets.module.css';
import TopMenu from '../../components/Navbar';
import { List, Avatar, Button, Tag, Badge } from 'antd';
import { DollarOutlined, UserOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';

const allBets = [
    {
        matchId: 718484,
        league: "fr",
        homeTeam: "Lyon",
        awayTeam: "Marseille",
        players: 5,
        amountBet: 5,
        date: new Date().toLocaleDateString()
    },
    {
        matchId: 718487,
        league: "fr",
        homeTeam: "PSG",
        awayTeam: "Nantes",
        players: 10,
        amountBet: 5,
        date: new Date().toLocaleDateString()
    },
    {
        matchId: 718490,
        league: "fr",
        homeTeam: "Troyes",
        awayTeam: "Saint Etienne",
        players: 8,
        amountBet: 5,
        date: new Date().toLocaleDateString()
    }
];

const userBets = [
    {
        matchId: 718484,
        league: "fr",
        homeTeam: "Lyon",
        awayTeam: "Marseille",
        amountBet: 1,
        teamSelected: "draw",
        date: new Date().toLocaleDateString()
    },
    {
        matchId: 718487,
        league: "fr",
        homeTeam: "PSG",
        awayTeam: "Nantes",
        amountBet: 2,
        teamSelected: "home",
        date: new Date().toLocaleDateString()
    }
];

const BetsList = () => {

    const router = useRouter();
    const { type } = router.query;

    return (
        <div className={styles.container}>
            <TopMenu />
            <h1>{type === 'all' ? 'Bets availables' : 'Your bets'}</h1>
            {
                type === 'all'
                    ? <List
                        bordered
                        style={{ width: '50%' }}
                        itemLayout="horizontal"
                        dataSource={allBets}
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
                    : <List
                        bordered
                        style={{ width: '50%' }}
                        itemLayout="horizontal"
                        dataSource={userBets}
                        renderItem={item =>
                        (<List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={`/picto-${item.league}.png`} />}
                                title={`${item.homeTeam} - ${item.awayTeam}`}
                                description={<Tag icon={<ClockCircleOutlined />} color="#87d068">Incoming</Tag>}
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
                                    onClick={() => router.push(`/match/${item.matchId}`)}
                                >
                                    DETAILS
                                </Button>
                            </div>
                        </List.Item>
                        )}
                    />
            }

        </div>
    )
};

export default BetsList;