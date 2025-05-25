import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import Sidebar from "../components/common/sideBars/sidebarPlatforme";
import UsersList from "./manage/usersList";
import NavbarAdmin from "../components/common/navbarAdmin";

export default function AdminHome(){
    return (
        <>
            <NavbarAdmin />
            <div className='flex' >
                <Sidebar className='inline' />
                <UsersList />
            </div>
        </>
    )
}