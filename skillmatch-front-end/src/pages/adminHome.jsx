import React, { useEffect, useState } from "react";
import { api } from "../api/api";
// import NavbarCandidate from '../components/common/navbarCandidate';
import Sidebar from "../components/common/sideBars/sidebarPlatforme";
import UsersList from "./manage/usersList";

export default function AdminHome(){
    return (
        <>
            {/* <NavbarCandidate /> */}
            <div className='flex' >
                <Sidebar className='inline' />
                <UsersList />
            </div>
        </>
    )
}