import React, { useEffect, useState } from 'react'
import { Link, useLocation, useMatches, useNavigate } from 'react-router-dom';
import { MODULES_TITLE } from '../constants/module.constant';
import axios from 'axios';
import Cookie from '../../utils/cookies.util';
import { useStore } from '../providers/StoreContext'
import { getSubdomain, removeAuthenticationToken } from '../../utils/authentication.util';
import Dropdown from './Dropdown';
import Notifications from './Notifications';

const Header = ({ setIsSideNavShow, isSideNavShow, isResponsive }) => {

    const matches = useMatches()
    const location = useLocation()
    const navigate = useNavigate();
    const { store } = useStore()
    const [logo, setLogo] = useState(getSubdomain()
        ? `${import.meta.env.APP_S3_PUBLIC_URL}${import.meta.env.APP_ENV}/assets/${getSubdomain()}/logo/large`
        : `${import.meta.env.APP_S3_PUBLIC_URL}assets/images/logo/large`);

    useEffect(() => {
        const match = matches[1]
        const module = MODULES_TITLE[match.id];

        if (module) {
            let dynamicTitle;
            if (module?.children?.[match.params.tab]) {
                dynamicTitle = module.children[match.params.tab];
            } else if (module?.hashChildren?.[location?.hash]) {
                dynamicTitle = module?.hashChildren?.[location?.hash];
            } else {
                dynamicTitle = module.title;
            }
            document.title = `${dynamicTitle} | ${store.user.companyName || "Fusion 24x7"}`;
        }

    }, [matches])

    useEffect(() => {
        function changeLogo(){
            setLogo(getSubdomain()
            ? `${import.meta.env.APP_S3_PUBLIC_URL}${import.meta.env.APP_ENV}/assets/${getSubdomain()}/logo/large?t=${Date.now()}`
            : `${import.meta.env.APP_S3_PUBLIC_URL}assets/images/logo/large?t=${Date.now()}`)
        }

        window.addEventListener('header-communication', changeLogo);

        return () => {
            window.removeEventListener('header-communication', changeLogo, false);
        }
    }, []);

    const toggleSideNav = () => {
        setIsSideNavShow(old => {
            Cookie.save('sidenav', !old);
            return !old
        })
    }

    const handleLogout = async (event) => {
        try {
            event.preventDefault();
            event.stopPropagation();

            await axios({
                url: '/api/authentication/logout',
                method: 'POST'
            })
        } catch (error) {
            console.error(error)
        } finally {
            removeAuthenticationToken()
            window.location.href = '/'
        }
    }

    return (
        <div className={`fu-header header-shadow ${isResponsive ? 'mobile-header' : ''} ${isSideNavShow ? "sidebar-show-header" : ""}`}>

            {isResponsive ?
                <div className="d-flex align-items-center">
                    <div className='ham-contain'>
                        <button className={`toggle-icon hamburger  `} onClick={() => { setIsSideNavShow(old => !old) }}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                    <Link to={'/'} className="header-logo d-flex gap-8 position-relative"  >
                        <img src={logo} height={'44px'} width={'50px'} alt='LOGO'/>
                    </Link>
                    {store.user.companyName && <span className='company-name'>{store.user.companyName}</span>}
                </div>
                :
                <div className="d-flex align-items-center">
                    <Link to={'/'} className="header-logo d-flex gap-8 position-relative" >
                        <img src={logo} height={'44px'} width={'50px'} alt='LOGO'/>
                    </Link>
                    <div className='ham-contain'>
                        <div className={`hamburger ${isSideNavShow ? 'is-active' : ''}`} onClick={toggleSideNav} >
                            <span ></span>
                            <span ></span>
                            <span ></span>
                        </div>
                    </div>
                    {store.user.companyName && <span className='company-name'>{store.user.companyName}</span>}
                </div>}
            <div className='d-flex gap-16 notification-pf-box'>
            <Notifications />
                <Dropdown.Container
                    closeOnClick
                    toggle={<div className="profile header-profile">
                        {store.user.logo
                            ? <img className="" src={store.user.logo} alt="" />
                            : <span>{store.user.firstName[0]} {store.user.lastName[0]}</span>
                        }</div>}
                >
                    <Dropdown.Item onClick={() => navigate('/profile')}>
                        My Profile
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => handleLogout()}>
                        Log Out
                    </Dropdown.Item>
                </Dropdown.Container>
            </div>
        </div>
    )
}

export default Header
