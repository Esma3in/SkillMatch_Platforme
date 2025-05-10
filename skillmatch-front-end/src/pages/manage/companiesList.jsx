import React, { useEffect, useState } from "react";
// import { api } from "../api/api";
import Sidebar from "../../components/common/sideBars/sidebarPlatforme";
import AllCompanies from "../../components/common/admin/users/AllCompanies";


export default function CompaniesList(){
    return (
        <>
            <div className='flex' >
                <Sidebar className='inline' />
                <AllCompanies />
            </div>
        </>
    )
}