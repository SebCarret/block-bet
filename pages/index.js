import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Row, Col, Table, Image, Button, Typography, Divider, Switch, Avatar } from 'antd';
import { ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import TopMenu from '../components/Navbar';
import { useIsomorphicEffect } from '../utils/IsomorphicEffect';

// import datas from leagues
import Leagues from '../datas/leagues.json';
import Ligue1 from '../datas/ligue1_fixtures.json';
import PremierLeague from '../datas/premier-league_fixtures.json';
import LaLiga from '../datas/laliga_fixtures.json';
import SerieA from '../datas/serieA_fixtures.json';
import Bundesliga from '../datas/bundesliga_fixtures.json';

const { Paragraph } = Typography;

export default function Home() {

  const [list, setList] = useState([]);
  const [isSwitched, setIsSwitched] = useState(false);
  const [leagueSelected, setLeagueSelected] = useState('fr');
  const [leagueName, setLeagueName] = useState('Ligue 1 Uber Eats');

  const router = useRouter();
  const dispatch = useDispatch();

  const isomorphicEffect = useIsomorphicEffect()

  isomorphicEffect(() => {
    getNextMatchs(leagueSelected)
  }, [leagueSelected]);

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

  const getNextMatchs = (country) => {

    let leagueToDisplay;
    const leagueToFind = Leagues.list.find(e => e.country === country);
    setLeagueName(leagueToFind.name);

    switch (country) {
      case 'fr':
        leagueToDisplay = Ligue1;
        break;
      case 'uk':
        leagueToDisplay = PremierLeague;
        break;
      case 'es':
        leagueToDisplay = LaLiga;
        break;
      case 'it':
        leagueToDisplay = SerieA;
        break;
      case 'all':
        leagueToDisplay = Bundesliga;
    };

    const { calendar } = leagueToDisplay;

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
      title: '',
      dataIndex: 'home',
      key: 'home',
      responsive: ['md'],
      width:"200px",
      render: team => <Paragraph className={styles.homeName}>{team.name}</Paragraph>
    },
    {
      title: 'Home',
      dataIndex: 'home',
      key: 'home',
      render: team => <Image preview={false} src={team.logo} width={50} alt="home team logo" />
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: date => new Date(date).toLocaleDateString()
    },
    {
      title: 'Away',
      dataIndex: 'away',
      key: 'away',
      render: team => <Image preview={false} src={team.logo} width={50} alt="away team logo" />
    },
    {
      title: '',
      dataIndex: 'away',
      key: 'away',
      responsive: ['md'],
      width:"200px",
      render: team => <Paragraph className={styles.awayName}>{team.name}</Paragraph>
    },
    {
      title: 'Bet',
      dataIndex: 'id',
      key: 'id',
      render: id => <Button icon={<DollarOutlined />} type="primary" ghost onClick={() => goToMatchPage(id)}>{isSwitched ? 'RESULT' : 'BET'}</Button>
    },
  ];

  const leaguesList = Leagues.list.map((league, i) => {
    return (
      <Col
        xs={{ span: 4, offset: i == 0 ? 2 : 0 }}
        md={{ span: 2, offset: i == 0 ? 7 : 0 }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Image
          preview={false}
          src={league.logo}
          width={50}
          alt={league.name}
          style={{ cursor: 'pointer' }}
          onClick={() => setLeagueSelected(league.country)} />
      </Col>
    )
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>BethClic</title>
        <meta name="description" content="A bet training app working on Ethereum Ropsten network !" />
        <link rel="icon" href="/betting.png" />
      </Head>
      <TopMenu />
      <Row style={{ margin: 10, width: '100%' }}>
        {leaguesList}
        <Col
          xs={{ span: 24 }}
          md={{ span: 12, offset: 6 }}
        >
          <Divider>
            <div>
              <Avatar src={`/picto-${leagueSelected}.png`} style={{marginRight: 10}} />
              {leagueName}
            </div>
          </Divider>
        </Col>
      </Row>
      {/* <div className={styles.title}>
        <h1 className={styles.h1}>Choose your match :</h1>
        <Switch checkedChildren="Next" unCheckedChildren="Past" onChange={switchChange}/>
      </div> */}
      <Row style={{ margin: 10, width: '100%' }}>
        <Col xs={24} md={{ span: 12, offset: 6 }}>
          <Table showHeader={false} dataSource={list} columns={columns} />
        </Col>
      </Row>
    </div>
  )
};
