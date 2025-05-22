import { useEffect, useState } from "react";
import { Footer } from "../components/common/footer";
import NavbarCandidate from "../components/common/navbarCandidate";
import Companies from "../components/sections/companies";
import SuggestedCompanies from "../components/sections/suggestedCompanies";
import {
  Briefcase,
  UserCircle,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";
import { api } from "../api/api";

export default function CompaniesMatching({ id }){ 
  const [companies ,setcompanies] = useState([])
  useEffect(()=>{
    
    const getCompanies= async ()=>{
      try{
        const response  = await api.get("/api/all")
        setcompanies(response.data);
      }catch(err){
        console.log("erreur de fetching all companies" , err.message)
      }
    }
    getCompanies()
  },[])
  return (
    <>

      <NavbarCandidate searchedItems={companies}/>
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* Welcome Banner */}
        <section className="bg-blue-50 p-6 rounded-xl shadow flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">
              👋 Welcome back!
            </h1>
            <p className="text-gray-700 max-w-xl">
              We’ve found company matches based on your profile. The more you
              refine it, the better the results.
            </p>
          </div>
          <a
            href="/profile-settings"
            className="inline-flex items-center gap-1 bg-white px-4 py-2 text-blue-600 font-medium rounded-lg border border-blue-300 hover:bg-blue-100"
          >
            <UserCircle size={18} /> Update profile
          </a>
        </section>

        {/* Suggested Companies */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Sparkles size={20} className="text-yellow-500" />
              Suggested Companies
            </h2>
            <span className="text-sm text-gray-500">
              Based on your skills and preferences
            </span>
          </div>
          <SuggestedCompanies id={id} />
        </section>

        {/* No Applications Feedback */}
        <section className="bg-white border rounded-xl shadow p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                You haven’t applied to any company yet
              </h3>
              <p className="text-gray-600">
                To increase your chances, keep your profile updated and explore
                opportunities actively.
              </p>
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <a
              href="/companies"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Briefcase size={18} /> Explore Companies
            </a>
            <a
              href="/edit-profile"
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              <UserCircle size={18} /> Improve My Profile
            </a>
          </div>
        </section>

        {/* All Companies */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Briefcase size={20} /> All Hiring Companies
            </h2>
            <a
              href="/companies"
              className="text-blue-600 text-sm hover:underline inline-flex items-center"
            >
              View all <ChevronRight size={16} />
            </a>
          </div>
          <Companies />
        </section>
    
      </main>    <Footer />
    </>
  );
}

