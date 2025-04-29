import '../../styles/pages/SugggestedCompanies/suggestedcompanies.css';
import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import CompnayCard from '../../layouts/companyCard';
import { BsStars } from "react-icons/bs";
export default function SuggestedCompanies() {
    const candidate_id = JSON.parse(localStorage.getItem('candidate_id'))
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/candidate/suggestedcompanies/${candidate_id}`);
                setLoading(false);
                if (response.data && response.data.length > 0) {
                    setCompanies(response.data);
                } else {
                    setMessage('This candidate has no companies matched.');
                }
            } catch (err) {
                setLoading(false);
                setMessage(err.message);
            }
        };

        fetchData();
    }, [candidate_id]); // empty dependency array: run once on mount
console.log(companies)
    return (
        <div className="CompanyMatchedContainer" >
            <div className="head">
                <div className='title'> 
                    <div className="The-suggested-companies">
                  Our Recommdation
                </div><div className='icon-container'><BsStars /></div></div>
               
                <div className="view-all-companies-btn">
                    <button className="btn">View All</button>
                </div>
            </div>

            <div className="companiescards">
                {loading && <p>Loading...</p>}
                {message && <p>{message}</p>}
                {!loading && companies.map((company,i) => (
                    <CompnayCard key={i} props={company}/>
                ))}
            </div>
        </div>
    );
}
