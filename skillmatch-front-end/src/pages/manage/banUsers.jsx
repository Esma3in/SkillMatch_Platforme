import React, { useEffect, useState } from "react";
// import { api } from "../api/api";
// import NavbarCandidate from '../components/common/navbarCandidate';
import Sidebar from "../../components/common/sideBars/sidebarPlatforme";
import UsersBanned from "../../components/common/admin/users/UsersBanned";


export default function BanUsers(){
    return (
        <>
            {/* <NavbarCandidate /> */}
            <div className='flex' >
                <Sidebar className='inline' />
                <UsersBanned />
            </div>
        </>
    )
}