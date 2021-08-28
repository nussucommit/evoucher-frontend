import React from "react";
import { Nav, NavLink, Heading, Button } from "@commitUI/index";

import { logout } from "api/auth";
import { getToken } from "utils/auth";
import useAuth from "hooks/useAuth";

import styles from "./Navbar.module.css";

const Navbar = () => {
    const { logout: localLogout } = useAuth()
    return (
        <>
            <Nav backgroundColor="#002A56" color="#fff">
                <NavLink to="/" noActive>
                    <Heading level={1}>NUSSU eVouchers</Heading>
                </NavLink>
                <div className={styles.align}></div>
                {useAuth().isAuth && <Button
                onClick={() => {
                    const token = getToken()
                    logout({ refresh_token: token!.refresh })
                    localLogout()
                }}
                type="outlined"
                className={styles.button}
                >
                Log out
                </Button>
                }  
            </Nav>
        </>
    );
};

export default Navbar;
