import { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../actions/action";
import HeaderComponent from '../users/HeaderComponent';
import Cookies from "js-cookie";
import ClientsList from "./ClientsList";
import BuildsListSmall from './BuildsListSmall';
import styles from '../../styles/PartnerPageComponent.module.css';


const PartnerPage = () => {
    const location = useLocation();
    const userDataLocation = location.state || {};
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userData);
    const API_URL = "http://localhost:8090/private";
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [builds, setBuilds] = useState([]);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUserData = localStorage.getItem('userData');
                if (storedUserData) {
                    dispatch(setUserData(JSON.parse(storedUserData)));
                }

                if (!storedUserData || userDataLocation.username) {
                    const token = Cookies.get('token');
                    const res = await axios.get(`${API_URL}/get_user/${userDataLocation.username}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    dispatch(setUserData(res.data));
                    localStorage.setItem('userData', JSON.stringify(res.data));
                }
            } catch (error) {
                setError(error.message || 'Что-то пошло не так');
            } finally {
                setLoading(false);
            }
        };

        const fetchBuildsByManager = async () => {
            try {
                const token = Cookies.get('token');
                const res = await axios.get(`${API_URL}/get_builds_by_manager`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBuilds(res.data);
            } catch (error) {
                setError(error.message || 'Что-то пошло не так');
            }
        };

        const fetchClientsByManager = async () => {
            try {
                const token = Cookies.get('token');
                const res = await axios.get(`${API_URL}/get_clients_by_manager`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setClients(res.data);
            } catch (error) {
                setError(error.message || 'Что-то пошло не так');
            }
        };

        fetchBuildsByManager();
        fetchClientsByManager();
        fetchData();
    }, [dispatch, userDataLocation.username]);
    

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if(true) {
        console.log("clients ", clients);
        console.log("builds ", builds);
    }

    return(
        <div>
            <HeaderComponent/>
            <div className={styles.partner}>
                <p className={styles.hello_partner}>{userData.name}, добро пожаловать!</p>
                <div className={styles.link_container}>
                    <Link to="/create_build" className={styles.partner_link}>Добавить новый объект</Link>
                    <Link to = "/create_user" className={styles.partner_link}>Добавить сотрудника</Link>
                    <Link to = "/create_client" className={styles.partner_link}>Добавить клиента</Link>
                    <Link to = "/all_builds" className={styles.partner_link}>Просмотреть все объекты</Link>
                    <Link to = "/all_clients" className={styles.partner_link}>Наши клиенты</Link>
                </div>
                <div className={styles.left_block}>
                    <p className={styles.hello_partner}>{userData.name}, Ваши клиенты RealtyHub.ME :</p>
                    <ClientsList clientList={clients}/>
                </div>
                <div className={styles.right_block}>
                    <p className={styles.hello_partner}>{userData.name}, Ваши объекты RealtyHub.ME :</p>
                    <BuildsListSmall buildsList={builds}/>
                </div>
            </div>
        </div>
    )
}

export default PartnerPage;