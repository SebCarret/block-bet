import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import styles from '../../styles/Match.module.css';
import { Row, Col, Avatar, Typography, Progress, Form, Input, Button, Select, Statistic, notification, Divider, Empty, Tag } from 'antd';
import { DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import TopMenu from '../../components/Navbar';
import TeamCard from '../../components/TeamCard';
import { useSelector, useDispatch } from 'react-redux';
import { server } from '../../config';
import { getBetInfos, setBet } from '../../utils/SC-functions';
import { useIsomorphicEffect } from '../../utils/IsomorphicEffect';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { Countdown } = Statistic;

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
        setDisabled(loadBets.havePlayerBet);
        if (change === null) {
          const request = await fetch('/api/crypto-price');
          const response = await request.json();
          dispatch({ type: 'getValue', value: response.value })
        }
      })()
    }
  }, [web3, id]);

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
      league: fixture.country,
      homeTeam: fixture.home.team,
      homeTeamId: fixture.home.id,
      awayTeam: fixture.away.team,
      awayTeamId: fixture.away.id,
      amountBet: Number(values.bet),
      teamSelected: values.team,
      date: date
    });

    const request = await fetch('/api/player/add-bet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: datas
    });
    const response = await request.json();
    if (response.success) dispatch({ type: 'playerInfos', player: response.player })

    const requestTwo = await fetch('/api/bets/add', {
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
      <Row className={styles.row}>
        <Col xs={24} md={{ span: 6, offset: 3 }}>
          <TeamCard type="home" fixture={fixture} />
        </Col>
        <Col xs={24} md={6}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 10 }}>
            <Countdown
              className={styles.statComponent}
              title="Match starts in :"
              prefix={<ClockCircleOutlined />}
              value={date}
              format="DD[d] HH[h] mm[m] ss[s]"
            />
            <Divider orientation="center"><Avatar size={50} >VS</Avatar></Divider>
            {
              web3 !== null
                ? <Form form={form} layout="vertical" onFinish={onBetClick} className={styles.form}>
                  <Form.Item
                    name="team"
                    rules={[
                      { required: true, message: 'Please select a result' }
                    ]}
                  >
                    <Select defaultValue="The winner will be :" style={{ width: "100%" }}>
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
                    <Button
                      style={{ width: "100%" }}
                      size="large"
                      loading={loading}
                      disabled={disabled}
                      type="primary"
                      htmlType="submit"
                      icon={<DollarOutlined />}
                    >
                      BET
                    </Button>
                  </Form.Item>
                </Form>
                : <Empty
                  image="/wallet.png"
                  description="Please connect your MetaMask wallet to bet"
                />
            }
          </div>
        </Col>
        <Col xs={24} md={6}>
          <TeamCard type="away" fixture={fixture} />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col className={styles.prediction} xs={8} md={{ span: 6, offset: 3 }}>
          <Paragraph>Victory % for {fixture.home.team}</Paragraph>
          <Progress type="circle" percent={fixture.predictions.home} width={80} />
        </Col>
        <Col className={styles.prediction} xs={8} md={6}>
          <Paragraph>Chances of draw</Paragraph>
          <Progress type="circle" percent={fixture.predictions.draw} width={80} />
        </Col>
        <Col className={styles.prediction} xs={8} md={6}>
          <Paragraph>Victory % for {fixture.away.team}</Paragraph>
          <Progress type="circle" percent={fixture.predictions.away} width={80} />
        </Col>
      </Row>
      {
        web3 !== null
          ? <Row className={styles.row}>
            <Col xs={8} md={{ span: 6, offset: 3 }} className={styles.statComponent}>
              <Statistic
                title={`Total bet on ${fixture.home.team}`}
                value={betsHomeTeam * change}
                precision={2}
                suffix="€"
              />
              <Tag className={styles.conversion} color="gold">{`${betsHomeTeam.toFixed(2)} ETH`}</Tag>
            </Col>
            <Col xs={8} md={6} className={styles.statComponent}>
              <Statistic
                title='Total bet on a draw'
                value={betsDraw * change}
                precision={2}
                suffix="€"
              />
              <Tag className={styles.conversion} color="gold">{`${betsDraw.toFixed(2)} ETH`}</Tag>
            </Col>
            <Col xs={8} md={6} className={styles.statComponent}>
              <Statistic
                title={`Total bet on ${fixture.away.team}`}
                value={betsAwayTeam * change}
                precision={2}
                suffix="€"
              />
              <Tag className={styles.conversion} color="gold">{`${betsAwayTeam.toFixed(2)} ETH`}</Tag>
            </Col>
          </Row>
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
