import { useRouter } from 'next/router';
import styles from '../../styles/Bets.module.css';
import TopMenu from '../../components/Navbar';
import AllBets from '../../components/allBets';
import Dashboard from '../../components/Dashboard';

const BetsList = () => {

    const router = useRouter();
    const { type } = router.query;

    return (
        <div className={styles.container}>
            <TopMenu />
            {
                type === 'all'
                    ? <AllBets />
                    : <Dashboard />
            }

        </div>
    )
};

export default BetsList;