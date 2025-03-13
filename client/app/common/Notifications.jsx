import React, { useEffect, useState } from 'react'
import Popover from './Popover'
import Loader from './Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import toasty from '../../utils/toasty.util';
import NAVIGATION_ROUTE_VALUE from '../constants/notification.constant';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Notifications() {
    const navigate = useNavigate();

    const [hasMore, setHasMore] = useState(false);
    const [isScrollLoading, setIsScrollLoading] = useState(false);
    const [skip, setSkip] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [notificationsCount, setNotificationsCount] = useState(0);

    const limit = 10

    useEffect(() => {
        getNotificationsCount();
    }, []);

    /***************************************Functions*************************************** */
    const getNotificationsCount = async () => {
        try {
            const { data } = await axios({
                url: '/api/common/notifications/count',
                method: 'GET'
            });

            setNotificationsCount(data?.count);
        } catch (error) {
            console.error(error);
            toasty.error(error?.response?.data?.message || 'Something went wrong.');
        }
    }

    function formatDate(date) {
        const _date = new Date(date);
        const now = new Date();

        // Helper functions
        const isToday = (d) => d.toDateString() === now.toDateString();
        const isYesterday = (d) => d.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();
        const isBeforeYesterday = (d) => d.getFullYear() === now.getFullYear() && d < new Date(now.setDate(now.getDate() - 1));

        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
        const optionsDateLong = { day: '2-digit', month: '2-digit', year: '2-digit' }; // DD/MM/YY

        if (isToday(_date)) {
            return `${_date.toLocaleTimeString(undefined, optionsTime)}`;
        } else if (isYesterday(_date)) {
            return 'Yesterday';
        } else if (isBeforeYesterday(_date)) {
            const day = _date.toLocaleDateString(undefined, { day: 'numeric' });
            const month = _date.toLocaleDateString(undefined, { month: 'short' });
            return `${day} ${month}`; //DD/MM
        } else {
            return _date.toLocaleDateString(undefined, optionsDateLong); // DD/MM/YY
        }
    }

    const changeDateAndTimeFormat = (data) => {
        let dateFormatedNotifications = data.map((notification) => {
            return {
                ...notification,
                createdOn: formatDate(notification.createdOn)
            }
        });

        return dateFormatedNotifications;
    }

    const fetchNotificationsList = async (isScroll) => {
        try {
            setIsLoading(false);

            if (isScroll) {
                setIsScrollLoading(true)
            } else {
                setSkip(0)
            }

            const { data } = await axios({
                url: '/api/common/notifications',
                method: 'GET',
                params: {
                    skip: isScroll ? skip : 0,
                    limit
                },
            });

            if (isScroll) {
                let upcomingData = changeDateAndTimeFormat(data.notifications)
                setNotifications(old => old.concat(upcomingData));
            }
            else {
                let dateFormatedDate = changeDateAndTimeFormat(data.notifications)
                setNotifications(dateFormatedDate);
            }

            setHasMore(data.notifications.length === limit);
            setSkip(old => old + limit);
            setIsScrollLoading(false);
        } catch (error) {
            toasty.error(error?.response?.data?.message || 'Something went wrong.');
        }
    }

    const handleMarkAsReadAndNavigate = async (e, data, method) => {
        try {
            e.stopPropagation();

            if (method === 'single' && data.type !== 'NOTICE_BOARD' && data.type !== 'ADD_TEAM') {
                if (data.type === 'CRM_TASK') {
                    navigate(NAVIGATION_ROUTE_VALUE[data.type] + `/${data.crmTaskId}`);
                } else {
                    navigate(NAVIGATION_ROUTE_VALUE[data.type]);
                }
            }

            axios({
                url: `/api/common/notifications`,
                method: 'POST',
                params: {
                    id: data._id,
                    method
                }
            });
            setNotificationsCount(0)
        } catch (error) {
            toasty.error(error?.response?.data?.message || 'Something went wrong.');
        }
    }

    const handleDeleteNotification = async (e, notificationId) => {
        try {
            e.stopPropagation();

            const { data } = await axios({
                url: `/api/common/notifications/${notificationId}`,
                method: 'DELETE',
            });

            setNotifications(prev => prev.filter((notification) => notification._id !== notificationId));
            toasty.success(data.message);
        } catch (error) {
            toasty.error(error?.response?.data?.message || 'Something went wrong.');
        }
    }
    return (
        <div className='notifications-card'>
            <Popover
                toggle={<span className='notification-counter-box' onClick={() => fetchNotificationsList(false)}><i className="fu ph-fill ph-bell font-size-24  primary-link "></i>{notificationsCount > 0 && <span className='notification-counter'>{notificationsCount}</span>}</span>}
                closeOnClick
                closeOnOutsideClick
                position='notification'
            >
                <div>
                    <Loader isLoading={isLoading}>
                        <div id='scrollableNotificationsLis' className='notification-card'>
                            <div className='d-flex justify-content-between   px-3 p-3 align-items-center msg-header'>
                                <h4>Notifications</h4>
                                {notifications.length > 0 && <button className=' mark-all-read' onClick={(e) => handleMarkAsReadAndNavigate(e, notifications, 'all')}><i className="ph ph-checks"></i> Mark all as read</button>}
                            </div>
                            <InfiniteScroll
                                className='h-100'
                                dataLength={notifications.length}
                                hasMore={hasMore}
                                next={() => { fetchNotificationsList(true) }}
                                scrollableTarget="scrollableNotificationsList"
                                loader={<Loader isLoading={isScrollLoading} />}
                            >
                                <ul>
                                    {notifications.length > 0 ?
                                        notifications.map((notification) => (
                                            <li key={notification._id} onClick={(e) => handleMarkAsReadAndNavigate(e, notification, 'single')}>
                                                <div className="notification notification-msg-time">
                                                    <div className="notification-message">
                                                        <div className='msg-avtar-img'>
                                                            {notification.type === "LOGIN"
                                                                ? <i className='ph ph-shield icon-size-20' />
                                                                : <>
                                                                    {notification?.sender?.logo
                                                                        ? <img src={notification?.sender?.logo} alt='sender' style={{ borderRadius: '50%', height: '25px', width: '25px' }} />
                                                                        : notification?.sender?.senderName
                                                                    }
                                                                </>
                                                            }
                                                        </div>
                                                        {notification.message}
                                                    </div>
                                                </div>
                                                <div className='msg-rgt'>
                                                    <div className="notification-time">
                                                        {notification.createdOn}
                                                    </div>
                                                    {notification.type !== "LOGIN" &&
                                                        <button className=' msg-remove-btn btn-danger ' onClick={(e) => handleDeleteNotification(e, notification._id)}><i className='ph ph-trash'></i></button>
                                                    }
                                                </div>
                                            </li>
                                        ))
                                        : <div className='no-msg-box'>
                                            <div className='bell-image'>
                                                <svg width="80" height="80" viewBox="0 0 512 512" fill="none" >
                                                    <g>
                                                        <path d="M256.001 98.244C266.955 98.244 277.584 99.632 287.722 102.24V69.405C287.722 51.886 273.52 37.684 256.001 37.684C238.482 37.684 224.28 51.886 224.28 69.405V102.24C234.418 99.632 245.047 98.244 256.001 98.244Z" fill="#CEE8FA" />
                                                        <path d="M417.207 405.793H94.793L129.088 315.654H382.914L417.207 405.793Z" fill="#CEE8FA" />
                                                        <path d="M255.997 474.324C274.913 474.324 290.248 458.989 290.248 440.073C290.248 421.157 274.913 405.822 255.997 405.822C237.081 405.822 221.746 421.157 221.746 440.073C221.746 458.989 237.081 474.324 255.997 474.324Z" fill="#CEE8FA" />
                                                        <path d="M429.577 400.155L395.593 310.83C393.589 305.567 388.546 302.089 382.914 302.089H142.629V225.179C142.629 170.542 181.48 124.812 233.006 114.157C233.117 114.134 233.227 114.111 233.338 114.089C235.053 113.739 236.782 113.431 238.525 113.16C238.821 113.115 239.116 113.079 239.412 113.035C240.72 112.842 242.037 112.68 243.358 112.532C243.913 112.471 244.466 112.403 245.021 112.35C246.42 112.216 247.826 112.111 249.24 112.029C249.99 111.986 250.742 111.953 251.493 111.925C252.445 111.887 253.402 111.867 254.361 111.852C255.453 111.837 256.544 111.837 257.636 111.852C258.595 111.866 259.551 111.887 260.504 111.925C261.255 111.955 262.007 111.986 262.757 112.029C264.17 112.113 265.577 112.216 266.976 112.35C267.531 112.403 268.084 112.471 268.639 112.532C269.96 112.68 271.277 112.843 272.585 113.035C272.881 113.078 273.176 113.115 273.472 113.16C275.214 113.431 276.943 113.739 278.659 114.089C278.77 114.111 278.88 114.135 278.991 114.157C330.517 124.814 369.368 170.542 369.368 225.179V262.345C369.368 269.837 375.442 275.91 382.933 275.91C390.424 275.91 396.498 269.837 396.498 262.345V225.179C396.498 163.546 356.605 111.056 301.285 92.17V69.405C301.285 44.435 280.969 24.119 255.999 24.119C231.029 24.119 210.713 44.435 210.713 69.405V92.17C155.393 111.056 115.5 163.546 115.5 225.179V313.215L82.114 400.969C80.528 405.137 81.093 409.82 83.625 413.492C86.156 417.164 90.331 419.357 94.792 419.357H212.908C209.883 425.627 208.186 432.653 208.186 440.068C208.186 466.433 229.636 487.882 256 487.882C282.364 487.882 303.814 466.433 303.814 440.069C303.814 432.654 302.117 425.628 299.092 419.358H417.208C417.219 419.358 417.23 419.358 417.235 419.358C424.727 419.358 430.8 413.285 430.8 405.793C430.799 403.781 430.362 401.873 429.577 400.155ZM237.844 85.846V69.405C237.844 59.394 245.988 51.248 256.001 51.248C266.013 51.248 274.158 59.392 274.158 69.405V85.846C274.093 85.838 274.029 85.832 273.964 85.824C272.64 85.654 271.309 85.507 269.975 85.374C269.565 85.333 269.153 85.301 268.743 85.264C267.761 85.176 266.775 85.094 265.787 85.027C265.318 84.994 264.848 84.965 264.379 84.937C263.398 84.879 262.415 84.833 261.429 84.795C261.01 84.779 260.591 84.76 260.17 84.748C258.785 84.707 257.396 84.682 256.002 84.682C254.608 84.682 253.218 84.708 251.834 84.748C251.413 84.76 250.994 84.781 250.575 84.795C249.589 84.833 248.605 84.879 247.625 84.937C247.156 84.964 246.686 84.994 246.217 85.027C245.228 85.095 244.243 85.176 243.261 85.264C242.85 85.301 242.439 85.333 242.029 85.374C240.694 85.507 239.364 85.655 238.04 85.824C237.973 85.832 237.908 85.838 237.844 85.846ZM256.001 460.753C244.596 460.753 235.317 451.475 235.317 440.069C235.317 428.664 244.595 419.385 256.001 419.385C267.407 419.385 276.685 428.663 276.685 440.069C276.684 451.474 267.406 460.753 256.001 460.753ZM114.467 392.228L138.439 329.218H373.562L397.534 392.228H114.467Z" fill="#20DF9F" />
                                                        <path className='small-vibrate' d="M429.565 307.849C425.429 307.849 421.346 305.965 418.683 302.396C414.203 296.391 415.437 287.892 421.442 283.412C430.189 276.885 435.205 266.894 435.205 256.001C435.205 245.108 430.189 235.116 421.442 228.59C415.437 224.11 414.202 215.611 418.683 209.606C423.163 203.602 431.663 202.365 437.667 206.847C453.113 218.373 462.336 236.748 462.336 256.001C462.336 275.254 453.113 293.63 437.667 305.155C435.232 306.971 432.386 307.849 429.565 307.849Z" fill="#2D527C" />
                                                        <path className='big-vibrate' d="M466.412 339.362C462.598 339.362 458.809 337.764 456.126 334.647C451.237 328.969 451.877 320.404 457.556 315.516C474.915 300.572 484.872 278.879 484.872 256C484.872 233.121 474.915 211.43 457.556 196.484C451.878 191.595 451.239 183.032 456.126 177.353C461.015 171.676 469.577 171.036 475.257 175.923C498.609 196.028 512.002 225.214 512.002 255.999C512.002 286.784 498.609 315.971 475.257 336.075C472.696 338.282 469.545 339.362 466.412 339.362Z" fill="#2D527C" />
                                                        <path className='small-vibrate' d="M82.435 307.849C79.614 307.849 76.768 306.973 74.333 305.155C58.887 293.629 49.664 275.254 49.664 256.001C49.664 236.748 58.887 218.372 74.333 206.847C80.337 202.367 88.835 203.602 93.317 209.606C97.797 215.611 96.563 224.11 90.558 228.59C81.811 235.117 76.795 245.108 76.795 256.001C76.795 266.894 81.811 276.886 90.558 283.412C96.563 287.892 97.798 296.391 93.317 302.396C90.656 305.965 86.571 307.849 82.435 307.849Z" fill="#2D527C" />
                                                        <path className='big-vibrate' d="M45.588 339.362C42.453 339.362 39.306 338.282 36.744 336.078C13.393 315.973 0 286.785 0 256.001C0 225.217 13.393 196.029 36.745 175.925C42.423 171.036 50.989 171.679 55.876 177.355C60.765 183.033 60.125 191.598 54.446 196.486C37.086 211.43 27.13 233.123 27.13 256.001C27.13 278.88 37.087 300.571 54.446 315.517C60.124 320.406 60.763 328.969 55.876 334.648C53.192 337.762 49.401 339.362 45.588 339.362Z" fill="#2D527C" />
                                                    </g>
                                                </svg>
                                            </div>
                                            <h4>Hey! You have no any notifications</h4>
                                        </div>
                                    }
                                </ul>
                            </InfiniteScroll>
                        </div>
                    </Loader>
                </div>
            </Popover>
        </div>
    )
}

export default Notifications
