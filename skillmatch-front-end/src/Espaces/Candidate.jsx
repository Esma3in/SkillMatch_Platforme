import CompaniesMatching from "../pages/CompaniesMatching"
import { useParams } from "react-router"
function Candidate(){
    const {id} = useParams('id')
    return(
        <>
            <CompaniesMatching id={id}/>
        </>
    )
}

export default Candidate