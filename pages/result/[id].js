import { Image, Typography, Statistic } from 'antd';
import styles from '../../styles/Result.module.css';
import { server } from '../../config';
import Head from 'next/head';

const { Title, Paragraph } = Typography;

const resultPage = ({ result }) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>BethClic</title>
                <meta name="description" content="A bet training app working on Ethereum Ropsten network !" />
                <link rel="icon" href="/betting.png" />
            </Head>
            <h1>Final score</h1>
            <div className={styles.row}>
                <Image src={result.homeLogo} width={80} alt="home team logo" />
                <Title level={2}>{result.score}</Title>
                <Image src={result.awayLogo} width={80} alt="away team logo" />
            </div>
            <div className={styles.row}>
                <Statistic title="Total bets amount" value={`${10} ETH`} />
                <Statistic title="Number of bettors" value={5} />
                <Statistic title="Gain per winner" value={`${1} ETH`} />
            </div>
        </div>
    )
};

export default resultPage;

export async function getServerSideProps({ params }) {
    const request = await fetch(`${server}/api/result?matchId=${params.id}`);
    const response = await request.json();
    return {
        props: { result: response.result }
    }
}