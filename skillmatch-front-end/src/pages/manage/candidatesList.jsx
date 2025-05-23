import React, { useEffect, useState } from "react";
// import { api } from "../api/api";
import Sidebar from "../../components/common/sideBars/sidebarPlatforme";
import AllCandidate from "../../components/common/admin/users/AllCandidate";


export default function CandidatesList(){
    return (
        <>
            <div className='flex' >
                <Sidebar className='inline' />
                <AllCandidate />
            </div>
        </>
    )
}
