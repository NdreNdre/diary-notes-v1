import { Outlet } from 'react-router-dom'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Layout = () => {
    return(
        <div className="flex lg:flex-row flex-col min-w-full max-w-screen min-h-screen bg-dark-dp1">
            <Navbar></Navbar>
            <div className={`main-content w-full flex flex-col`}>
                <div className="main w-full min-h-screen">
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    )
}

export default Layout;