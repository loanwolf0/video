"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CustomPasswordField from '../../common/custom-form-fields/CustomPasswordField';
import { emailPattern, onlySpaceOrSpecialCharNotAllowed, } from '../../constants/validation.constant';
import { api } from '../../config';
import toasty from '../../utils/toasty.util';

const Login = ({ source }) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({ mode: 'onBlur' });

    const [isRegister, setIsRegister] = useState(false)
    const [isForgetPass, setIsForgetPass] = useState(false)
    const [isLogin, setIsLogin] = useState(true)

    const router = useRouter();



    const switchTab = (target) => {

        if (target === 'register') {
            setIsLogin(false);
            setIsForgetPass(false);
            setIsRegister(true);
        } else if (target === 'login') {
            setIsRegister(false);
            setIsForgetPass(false);
            setIsLogin(true);
        } else if (target === 'forget-pass') {
            setIsLogin(false);
            setIsRegister(false);
            setIsForgetPass(true);
        }
    };



    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('email')) setValue('email', params.get('email'));
    }, []);

    const handleLogin = async (formData) => {
        console.log(isLogin, "isLogin");

        if (isLogin) {
            await logInUser(formData)
        } else if (isRegister) {
            await registerUser(formData)
        } else {
            await resetPassword(formData)
        }
    };



    const logInUser = async (formData) => {
        try {
            console.log(formData, "login");
            const { data } = await api.post('/auth/login', formData)
            if (data.status) {
                setUserData(data.userObj)
            }
            console.log(data, "data log in data");

        } catch (error) {
            console.log(error, "logIn");

        }
    }

    const setUserData = (userDetails) => {
        localStorage.setItem("fullName", userDetails.fullName);
        localStorage.setItem("userId", userDetails.userId)
        localStorage.setItem("email", userDetails.email)
        localStorage.setItem("jwtToken", userDetails.jwtToken)
        localStorage.setItem("planName", userDetails.planName)
        localStorage.setItem("planId", userDetails.planId ?? null)
        localStorage.setItem("subscriptionId", userDetails.subscriptionId ?? null)

        localStorage.setItem("userType", userDetails.userType)


        if (userDetails.isFreeTrial) {
            localStorage.setItem("isFreeTrial", userDetails.isFreeTrial);
            localStorage.setItem("remainingTrialDays", userDetails.remainingTrialDays);
        }
        sendToTheirFirstPage(userDetails.userType)
    }
    const registerUser = async (formData) => {
        try {
            console.log(formData, "registerUser");
            const { data } = await api.post('/auth/register', formData)
            console.log(data, "res");

            if (!data.status) {
                toasty.info(data.message)
                return
            }
            console.log("srfwer");
            
            router.push('/')
            toasty.success(data.message)

        } catch (error) {
            console.log(error, "registerUser");

        }
    }

    const resetPassword = async (formData) => {
        try {
            console.log(formData, "currently not available, soon implemented ");

        } catch (error) {
            console.log(error, "resetPassword");

        }
    }

    const sendToTheirFirstPage = (userType) => {
        if (userType == 'endUser') {
            console.log("User");
            router.push("/home")
        } else {
            console.log("Admin");
            router.push("/admin-dashboard")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
            <div className="bg-gray-500 shadow-lg rounded-lg p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="mb-4">LOGO</div>
                    <h2 className="text-xl font-semibold">Welcome!</h2>
                    <p className="text-gray-600">Login and make your Ai Video Free </p>
                </div>

                <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">

                    {isRegister && (
                        <div>
                            <div>
                                <label className="block text-gray-700">
                                    First Name <span className="text-red-900">*</span>
                                </label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    {...register('firstName', { required: 'First Name is required', pattern: onlySpaceOrSpecialCharNotAllowed })}
                                    placeholder="Enter First Name"
                                />
                                {errors.firstName && <small className="text-red-500">{errors.firstName.message}</small>}
                            </div>

                            <div>
                                <label className="block text-gray-700">
                                    Last Name <span className="text-red-900">*</span>
                                </label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    {...register('lastName', { required: 'Last Name is required', pattern: onlySpaceOrSpecialCharNotAllowed })}
                                    placeholder="Enter Last Name"
                                />
                                {errors.lastName && <small className="text-red-500">{errors.lastName.message}</small>}
                            </div>
                        </div>
                    )}


                    <div>
                        <label className="block text-gray-700">Email <span className="text-red-900">*</span></label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            {...register('email', { required: 'Email is required', pattern: emailPattern })}
                            placeholder="Enter Email"
                        />
                        {errors.email && <small className="text-red-500">{errors.email.message}</small>}
                    </div>

                    {!isForgetPass &&
                        <div>
                            <label className="block text-gray-700">Password <span className="text-red-500">*</span></label>
                            <CustomPasswordField
                                className="w-full px-4 py-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                name={'password'}
                                rules={{ required: 'Password is required' }}
                                control={control}
                                placeholder='Enter Password'
                            />
                            {errors.password && <small className="text-red-500">{errors.password.message}</small>}
                        </div>
                    }

                    <div>
                        <button
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            {isForgetPass ? 'Reset Password' :
                                isRegister ? 'Register' : 'Log In'}
                        </button>

                        <div className="text-center mt-4">
                            <p> {isRegister ? 'Already A User ?' : 'New User ?'}</p>
                            <span className="text-blue-900 cursor-pointer" onClick={() => switchTab(isRegister ? 'login' : 'register')}>
                                {isRegister ? "Login" : "Register"}
                            </span>

                        </div>
                    </div>

                </form>

                {/* <div className="text-center mt-4">
                    <p>Don't remember the password?</p>
                    <span className="text-blue-900 cursor-pointer" onClick={() => switchTab('forget-pass')}>
                        Forget Password
                    </span>
                </div> */}
            </div>
        </div>
    );
};

export default Login;
