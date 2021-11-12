import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Table, Image, Button, Typography, Switch } from 'antd';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import TopMenu from '../components/Navbar';

import Fixtures from '../datas/ligue1_fixtures.json';

const { Paragraph } = Typography;
const { calendar } = Fixtures;

export default function Home() {

  const [list, setList] = useState([]);
  const [isSwitched, setIsSwitched] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    getNextMatchs()
  }, []);

  const getPrevMatchs = () => {
    let finalList = [];
    for (let match of calendar) {
      if (new Date() > new Date(match.fixture.date)) {
        finalList.push({
          home: match.teams.home,
          date: match.fixture.date,
          away: match.teams.away,
          id: match.fixture.id,
        })
      }
    };
    finalList = finalList.sort((a, b) => new Date(a.date) - new Date(b.date));
    setList(finalList);
  };

  const getNextMatchs = () => {
    let finalList = [];
    for (let match of calendar) {
      if (new Date() <= new Date(match.fixture.date)) {
        finalList.push({
          home: match.teams.home,
          date: match.fixture.date,
          away: match.teams.away,
          id: match.fixture.id,
        })
      }
    };
    finalList = finalList.sort((a, b) => new Date(a.date) - new Date(b.date));
    setList(finalList);
  };

  const switchChange = check => {
    setIsSwitched(check);
    check ? getPrevMatchs() : getNextMatchs()
  };

  const goToMatchPage = id => {
    let index;
    for (let match of list) {
      if (match.id === id) index = list.indexOf(match)
    };
    dispatch({ type: 'getDate', date: list[index].date });
    isSwitched ? router.push(`/result/${id}`) : router.push(`/match/${id}`)
  };

  const columns = [
    {
      title: 'Home team',
      dataIndex: 'home',
      key: 'home',
      render: team => (
        <div className={styles.home}>
          <Paragraph className={styles.homeName}>{team.name}</Paragraph>
          <Image src={team.logo} width={50} />
        </div>

      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: date => new Date(date).toLocaleDateString()
    },
    {
      title: 'Away team',
      dataIndex: 'away',
      key: 'away',
      render: team => (
        <div className={styles.away}>
          <Image src={team.logo} width={50} />
          <Paragraph className={styles.awayName}>{team.name}</Paragraph>
        </div>

      )
    },
    {
      title: 'Bet',
      dataIndex: 'id',
      key: 'id',
      render: id => <Button type="primary" onClick={() => goToMatchPage(id)}>{isSwitched ? 'RESULT' : 'BET'}</Button>
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>BethClic</title>
        <meta name="description" content="A bet training app working on Ethereum Ropsten network !" />
        <link rel="icon" href="/betting.png" />
      </Head>
      <TopMenu />
      {/* <div className={styles.title}>
        <h1 className={styles.h1}>Choose your match :</h1>
        <Switch checkedChildren="Next" unCheckedChildren="Past" onChange={switchChange}/>
      </div> */}
      <Table dataSource={list} columns={columns} style={{ width: '50%' }} />
    </div>
  )
};
