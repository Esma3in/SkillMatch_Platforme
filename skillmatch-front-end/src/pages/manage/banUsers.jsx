import React, { useEffect, useState } from "react";
// import { api } from "../api/api";
import Sidebar from "../../components/common/sideBars/sidebarPlatforme";
import UsersBanned from "../../components/common/admin/users/UsersBanned";
import NavbarAdmin from "../../components/common/navbarAdmin";

export default function BanUsers(){
    return (
        <>
            <NavbarAdmin />
            <div className='flex' >
                <Sidebar className='inline' />
                <UsersBanned />
            </div>
        </>
    )
}