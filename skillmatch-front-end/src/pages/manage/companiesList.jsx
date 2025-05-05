import React, { useEffect, useState } from "react";
// import { api } from "../api/api";
// import NavbarCandidate from '../components/common/navbarCandidate';
import Sidebar from "../../components/common/sideBars/sidebarPlatforme";

export default function CompaniesList(){
    return (
        <>
            {/* <NavbarCandidate /> */}
            <div className='flex' >
                <Sidebar className='inline' />
                <h1>helooooooo</h1>
            </div>
        </>
    )
}