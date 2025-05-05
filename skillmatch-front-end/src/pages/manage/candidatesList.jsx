import React, { useEffect, useState } from "react";
// import { api } from "../api/api";
// import NavbarCandidate from '../components/common/navbarCandidate';
import Sidebar from "../../components/common/sideBars/sidebarPlatforme";
import AllCandidate from "../../components/common/admin/comp/AllCandidate";

export default function CandidatesList(){
    return (
        <>
            {/* <NavbarCandidate /> */}
            <div className='flex' >
                <Sidebar className='inline' />
                <AllCandidate />
            </div>
        </>
    )
}

