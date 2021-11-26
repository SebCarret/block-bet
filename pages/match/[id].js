import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import styles from '../../styles/Match.module.css';
import { Row, Col, Avatar, Typography, Progress, Form, Input, Button, Select, Statistic, notification } from 'antd';
import { DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import TopMenu from '../../components/Navbar';
import TeamCard from '../../components/TeamCard';
import { useSelector, useDispatch } from 'react-redux';
import { server } from '../../config';
import { getBetInfos, setBet } from '../../utils/SC-functions';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { Countdown } = Statistic;

// const fixture = {
//   homeTeam: 'Nice',
//   homeLogo: 'https://media.api-sports.io/football/teams/84.png',
//   homeId: 84,
//   awayTeam: 'Lyon',
//   awayLogo: "https://media.api-sports.io/football/teams/80.png",
//   awayId: 80,
//   date: "2021-10-24T11:00:00+00:00",
//   homeChance: 10,
//   drawChance: 45,
//   awayChance: 45
// };

export default function Match({ fixture }) {

  const [betsHomeTeam, setBetsHomeTeam] = useState(0);
  const [betsAwayTeam, setBetsAwayTeam] = useState(0);
  const [betsDraw, setBetsDraw] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const date = useSelector(state => state.date);
  const web3 = useSelector(state => state.web3);
  const player = useSelector(state => state.player);
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (web3 !== null) {
      (async () => {
        const loadBets = await getBetInfos(web3.provider, web3.address, id);
        setBetsHomeTeam(loadBets.homeTeam);
        setBetsAwayTeam(loadBets.awayTeam);
        setBetsDraw(loadBets.draw);
        setDisabled(loadBets.havePlayerBet)
      })()
    }
  }, [web3, id]);

  // const connectWallet = async () => {
  //   const Web3 = await getWeb3();
  //   await betContract.setProvider(Web3.currentProvider);
  //   let address;
  //   let provider = Web3.currentProvider;
  //   await Web3.eth.getAccounts((error, accounts) => {
  //     address = accounts[0];
  //   });
  //   getBetInfos(provider, address, id);
  //   dispatch({ type: 'web3Infos', provider, address })
  // };

  // const getBetInfos = async (provider, address, id) => {
  //   await betContract.setProvider(provider);
  //   const instance = await betContract.deployed();
  //   const alreadyBet = await instance.checkPlayerExists(address, id);
  //   if (alreadyBet) setDisabled(true);
  //   const getBetsHome = await instance.AmountHome(id);
  //   setBetsHomeTeam(getBetsHome / weiConversion);
  //   const getBetsAway = await instance.AmountAway(id);
  //   setBetsAwayTeam(getBetsAway / weiConversion);
  //   const getBetsDraw = await instance.AmountDraw(id);
  //   setBetsDraw(getBetsDraw / weiConversion);
  // };

  const onBetClick = async values => {
    setLoading(true);
    await setBet(web3, id, values.team, Number(values.bet));
    let win;
    let message;
    if (values.team === "home") {
      setBetsHomeTeam(betsHomeTeam + Number(values.bet));
      win = Number(values.bet) + (Number(values.bet) / (betsHomeTeam + Number(values.bet)) * (betsAwayTeam + betsDraw));
      message = `You win ${win.toFixed(4)} ETH if ${fixture.home.team} win !`
    } else if (values.team === "away") {
      setBetsAwayTeam(betsAwayTeam + Number(values.bet));
      win = Number(values.bet) + (Number(values.bet) / (betsAwayTeam + Number(values.bet)) * (betsHomeTeam + betsDraw));
      message = `You win ${win.toFixed(4)} ETH if ${fixture.away.team} win !`
    } else {
      setBetsDraw(betsDraw + Number(values.bet));
      win = Number(values.bet) + (Number(values.bet) / (betsDraw + Number(values.bet)) * (betsHomeTeam + betsAwayTeam));
      message = `You win ${win.toFixed(4)} ETH if it will be a draw !`;
    };

    const datas = JSON.stringify({
      userId: player._id,
      matchId: id,
      league: 'fr',
      homeTeam: fixture.home.team,
      homeTeamId: fixture.home.id,
      awayTeam: fixture.away.team,
      awayTeamId: fixture.away.id,
      amountBet: Number(values.bet),
      teamSelected: values.team,
      date: date
    });

    const request = await fetch(`${server}/api/player/add-bet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: datas
    });
    const response = await request.json();
    if (response.success) dispatch({ type: 'playerInfos', player: response.player })

    const requestTwo = await fetch(`${server}/api/bets/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: datas
    });
    const responseTwo = await requestTwo.json();

    if (values) {
      notification['success']({
        message: 'Thanks for your bet',
        description: message
      })
      form.resetFields();
    }
    setLoading(false)
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>BethClic</title>
        <meta name="description" content="A bet training app working on Ethereum Ropsten network !" />
        <link rel="icon" href="/betting.png" />
      </Head>
      <TopMenu />
      <h1>{web3 !== null ? "It's time to bet !" : "Please connect your MetaMask wallet to bet"}</h1>
      <div className={styles.row}>
        <TeamCard type="home" fixture={fixture} />
        {/* <Title level={2} style={{width: '33%', textAlign: 'center'}}>VS</Title> */}
        <Countdown
          style={{ width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          title="Match starts in :"
          prefix={<ClockCircleOutlined />}
          value={date}
          format="DD:HH:mm:ss"
        />
        <TeamCard type="away" fixture={fixture} />
      </div>
      <div className={styles.row}>
        <div className={styles.prediction}>
          <Paragraph>Chances of victory</Paragraph>
          <Progress type="circle" percent={fixture.predictions.home} width={80} />
        </div>
        <div className={styles.prediction}>
          <Paragraph>Chances of draw</Paragraph>
          <Progress type="circle" percent={fixture.predictions.draw} width={80} />
        </div>
        <div className={styles.prediction}>
          <Paragraph>Chances of victory</Paragraph>
          <Progress type="circle" percent={fixture.predictions.away} width={80} />
        </div>
      </div>
      {
        web3 !== null
          ? <Form form={form} layout="inline" onFinish={onBetClick} className={styles.form}>
            <Form.Item
              name="team"
              rules={[
                { required: true, message: 'Please select a result' }
              ]}
            >
              <Select defaultValue="The winner will be :" style={{ width: 180 }}>
                <Option value="home">{fixture.home.team}</Option>
                <Option value="away">{fixture.away.team}</Option>
                <Option value="draw">Nobody (draw)</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="bet"
              rules={[
                { required: true, message: 'Your bet is required' },
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject();
                    }
                    if (isNaN(value)) {
                      return Promise.reject("Your bet has to be a number.");
                    }
                    if (value < 0.0001) {
                      return Promise.reject('Min. bet required: 0.0001 ETH.');
                    }
                    return Promise.resolve();
                  }
                }),
              ]}
            >
              <Input type="number" placeholder="0.0001 ETH" />
            </Form.Item>
            <Form.Item>
              <Button loading={loading} disabled={disabled} type="primary" htmlType="submit" icon={<DollarOutlined />}>BET</Button>
            </Form.Item>
          </Form>
          : null
      }
      {
        web3 !== null
          ? <div className={styles.statsContainer}>
            <Statistic title={`Total bet on ${fixture.home.team}`} value={`${betsHomeTeam} ETH`} />
            <Statistic title={`Total bet on ${fixture.away.team}`} value={`${betsAwayTeam} ETH`} />
            <Statistic title='Total bet on a draw' value={`${betsDraw} ETH`} />
            <Countdown title="Time left to bet" value={date} format="DD:HH:mm:ss" />
          </div>
          : null
      }
    </div>
  )
};

export async function getServerSideProps({ params }) {
  const request = await fetch(`${server}/api/prediction?matchId=${params.id}`);
  const response = await request.json();
  return {
    props: { fixture: response.fixture }
  }
}
