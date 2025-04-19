import NavbarCandidate from "../components/common/navbarCandidate"
import SuggestedCompanies from "../components/sections/suggestedCompanies"
import { useParams } from "react-router"
function Candidate(){
    const {id} = useParams('id')
    return(
        <>
        <NavbarCandidate />
        <SuggestedCompanies id={id}/>
        </>
    )
}

export default Candidate