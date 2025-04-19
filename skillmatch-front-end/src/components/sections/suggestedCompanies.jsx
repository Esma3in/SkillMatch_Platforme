import '../../styles/pages/SugggestedCompanies/suggestedcompanies.css';
import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import CompnayCard from '../../layouts/companyCard';

export default function SuggestedCompanies({id}) {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/candidate/suggestedcompanies/${id}`);
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
    }, []); // empty dependency array: run once on mount

    return (
        <div className="CompanyMatchedContainer">
            <div className="head">
                <div className="The-suggested-companies">
                    The suggested companies
                </div>
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
