import NavbarCandidate from "../components/common/navbarCandidate";
import SuggestedCompanies from "../components/sections/suggestedCompanies";

export default function CompaniesMatching({id}){
    return(
<>
        <NavbarCandidate/>
        <SuggestedCompanies id={id}/>
</>
        
    )
}