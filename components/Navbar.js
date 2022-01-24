import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import getWeb3 from '../utils/web3-config';
import { CalendarOutlined, DollarOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import { useIsomorphicEffect } from '../utils/IsomorphicEffect';

const TopMenu = () => {

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const web3 = useSelector(state => state.web3);
    const isomorphicEffect = useIsomorphicEffect();

    isomorphicEffect(() => {
        if (window.ethereum) {
            if (web3 != null) {
                setDisabled(true);
                window.ethereum.on("accountsChanged", (accounts) => {
                    if (accounts.length > 0) {
                        dispatch({ type: "accountChanged", address: accounts[0] });
                        getPlayerInfos(accounts[0])
                    } else {
                        message.error("🦊 Connect to Metamask using the top right button.");
                    }
                });
                window.ethereum.on("chainChanged", (chainId) => {
                    dispatch({ type: "chainChanged", chainId });
                })
            }
        }
    }, [web3])

    const connectWallet = async () => {
        setLoading(true);
        const web3 = await getWeb3();
        if (web3.connected) {
            dispatch({ type: 'web3Infos', provider: web3.provider, address: web3.accounts[0] });
            getPlayerInfos(web3.accounts[0])
        } else {
            message.error("Please install Metamask extension to access to your wallet !")
        }
        if (web3.provider.chainId !== '0x3') message.error("Please switch to Ropsten network on MetaMask")
        setLoading(false)
    };

    const getPlayerInfos = async address => {
        const request = await fetch('/api/player/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `address=${address}`
        });
        const response = await request.json();
        if (response.success) {
            dispatch({ type: 'playerInfos', player: response.player })
        } else {
            message.error(response.error);
        }
    };

    return (
        <Menu selectable={false} mode="horizontal" style={{ width: '100%', padding: 10, display: 'flex', justifyContent: 'center' }}>
            <Menu.Item icon={<CalendarOutlined />}>
                <Link href="/">Matchs</Link>
            </Menu.Item>
            <Menu.Item icon={<DollarOutlined />}>
                <Link href="/bets/all">Bets</Link>
            </Menu.Item>
            <Menu.Item icon={<UserOutlined />}>
                <Link href="/bets/user">Dashboard</Link>
            </Menu.Item>
            <Menu.Item>
                <Button
                    // shape="round"
                    // size="large"
                    danger
                    icon={<WalletOutlined />}
                    disabled={disabled}
                    loading={loading}
                    onClick={connectWallet}
                >
                    {loading ? "Connecting..." : "MetaMask"}
                </Button>
            </Menu.Item>
        </Menu>
    )
};

export default TopMenu;