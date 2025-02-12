import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./UserSettings.module.scss";
import { clearToken } from "../../../redux/tokenSlice";
import apiClient from "../../../redux/apiClient";
import React, { useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import Header from "../../../components/Header/Header";
import CopyRight from "../../../components/CopyRight/CopyRight";
import BottomNavigation from '../../../components/BottomNavigation/BottomNavigation';

export default function UserSettings() {
    const globalUsername = useSelector((state) => state.auth.username);
    const token = useSelector((state) => state.token.token);
    const [fullName, setFullName] = useState(globalUsername);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(clearToken());
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/", { replace: true });
    };
    const fetchFullName = async () => {
        if (!token) {
            console.warn('No token available. Using global username.');
            setFullName(globalUsername);
            return;
        }

        try {
            const response = await apiClient.post('/user/username', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setFullName(response.data.istifadeci_adi);
            } else {
                console.warn('Failed to fetch full name. Using global username.');
                setFullName(globalUsername);
            }
        } catch (error) {
            console.error('Error fetching full name:', error);
            setFullName(globalUsername);
        }
    };
    useEffect(() => {
        const checkTokenExpiration = () => {
            if (!token) {
                navigate("/", { replace: true });
                return;
            }
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = decodedToken.exp * 1000;
            const currentTime = Date.now();
            if (currentTime >= expirationTime) {
                localStorage.removeItem("authToken");
                navigate("/", { replace: true });
            }
        };
        checkTokenExpiration();
        fetchFullName();
    }, [globalUsername, token]);
    const name = fullName.split(' ')[0];
    console.log(name);

    const surname = fullName.split(' ')[1];

    return (
        <>
            <Header />
            <motion.main
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3 }}
                className={styles['user-settings-main']}>
                <motion.section
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.3 }}
                    className={styles['user-settings-info']}>
                    <p>Ad: <span>{name}</span></p>
                    <p>Soyad: <span>{surname}</span></p>
                    <p>Status: <span>Telebe</span></p>
                    <p>Fakulte: <span>ITT</span></p>
                </motion.section>
                <section className={styles['user-settings-log-out']}>
                    <LogoutIcon className={styles['user-settings-log-out-icon']} onClick={handleLogout} />
                    <p>Log Out</p>
                </section>
            </motion.main>
            {window.innerWidth < 600 ? <BottomNavigation isButtonDisabled={true} /> : null}
        </>
    )
}
