import { useRouter } from 'next/router';
import styles from '../../styles/Bets.module.css';
import TopMenu from '../../components/Navbar';
import AllBets from '../../components/allBets';
import PlayerBets from '../../components/playerBets';

const BetsList = () => {

    const router = useRouter();
    const { type } = router.query;

    return (
        <div className={styles.container}>
            <TopMenu />
            {
                type === 'all'
                    ? <AllBets />
                    : <PlayerBets />
            }

        </div>
    )
};

export default BetsList;