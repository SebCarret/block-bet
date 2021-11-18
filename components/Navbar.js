import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import getWeb3 from '../utils/web3-config';
import { CalendarOutlined, DollarOutlined, UnorderedListOutlined, WalletOutlined } from '@ant-design/icons';

const TopMenu = () => {

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const web3 = useSelector(state => state.web3);

    useEffect(() => {
        if (web3 != null) setDisabled(true)
    }, [web3])

    const connectWallet = async () => {
        setLoading(true);
        const Web3 = await getWeb3();
        let provider = Web3.currentProvider;
        setTimeout(() => {
            Web3.eth.getAccounts(async (error, accounts) => {
                const request = await fetch('/api/player/connect', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `address=${accounts[0]}`
                });
                const response = await request.json();
                console.log(response);
                if (response.success) {
                    dispatch({ type: 'web3Infos', provider, address: accounts[0] });
                    dispatch({ type: 'playerInfos', player: response.player })
                } else {
                    message.error(response.error);
                };
                setLoading(false)
            })
        }, 8000)
    };

    return (
        <Menu selectable={false} mode="horizontal" style={{ width: '50%', padding: 10, display: 'flex', justifyContent: 'space-between' }}>
            <Menu.Item icon={<CalendarOutlined />}>
                <Link href="/">Matchs</Link>
            </Menu.Item>
            <Menu.Item icon={<DollarOutlined />}>
                <Link href="/bets/all">Bets</Link>
            </Menu.Item>
            <Menu.Item icon={<UnorderedListOutlined />}>
                <Link href="/bets/user">My bets</Link>
            </Menu.Item>
            <Menu.Item>
                <Button
                    type="primary"
                    size="large"
                    danger
                    icon={<WalletOutlined />}
                    disabled={disabled}
                    loading={loading}
                    onClick={connectWallet}
                >
                    Connect MetaMask
                </Button>
            </Menu.Item>
        </Menu>
    )
};

export default TopMenu;