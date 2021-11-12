import { Typography, Progress, Image, Card, Badge, Tooltip, Divider } from 'antd';
import { CheckCircleOutlined, MinusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from '../styles/Match.module.css';

const { Title } = Typography;

const TeamCard = (props) => {

    const {type, fixture} = props;

    let logo = type === 'home' ? fixture.home.logo : fixture.away.logo;
    let lastResults = type === 'home' ? fixture.home.lastResults : fixture.away.lastResults;
    let teamStats = type === 'home' ? fixture.home.homeStats :  fixture.away.awayStats;

    return (
        <Card
            cover={<Image src={logo} width={80} />}
            className={styles.card}
        >
            <div className={styles.cardBody}>
                <Title level={5}>Last 5 results</Title>
                <div className={styles.stats}>
                    {
                        lastResults.map((result, i) => {
                            let type;
                            let icon;
                            let score;
                            if (result == "W") {
                                type = "success";
                                icon = <CheckCircleOutlined style={{ color: '#52C41A' }} />;
                                score = "Win"
                            } else if (result == "D") {
                                type = "warning";
                                icon = <MinusCircleOutlined style={{ color: '#FAAC14' }} />;
                                score = "Draw"
                            } else {
                                type = "error";
                                icon = <CloseCircleOutlined style={{ color: '#FF4D4E' }} />
                                score = "Lose"
                            };
                            return (
                                <Tooltip title={score}>
                                    <Badge count={icon} />
                                </Tooltip>
                            )
                        })
                    }
                </div>
                <Divider />
                <Title level={5}>{type === 'home' ? 'Home statistics' : 'Away statistics'}</Title>
                <div className={styles.progress}>
                    <Progress
                        percent={Math.round(teamStats.win / teamStats.played * 100)} size="small"
                        format={() => `${teamStats.win} victories`}
                    />
                    <Progress
                        percent={Math.round(teamStats.draw / teamStats.played * 100)} size="small"
                        format={() => `${teamStats.draw} draws`}
                    />
                    <Progress
                        percent={Math.round(teamStats.lose / teamStats.played * 100)} size="small"
                        format={() => `${teamStats.lose} defeats`}
                    />
                </div>
            </div>
        </Card>
    )
};

export default TeamCard;