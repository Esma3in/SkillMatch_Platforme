
import '../styles/pages/SugggestedCompanies/companycard.css'


export default function CompanyCard({ props }) {

    return (
        <div className="container-companycard ">
            <div className="card">
                <div className="logo">
                    <img src={props.name} alt={props.name} />
                </div>
                <div className="title">
                    <p>{props.name}</p>
                </div>
                <div className="link">
                    {
                        props.profile ? <a className='link-url' href={props.profile.email}>{props.profile.email}</a> : <a className='link-url' href={props.sector}>{props.sector}</a>
                    }

                </div>
                <div className="skils">
                    {props.skills && props.skills.length > 0 ? (
                        props.skills.map((skill, i) => (
                            <div key={i} className="chip">
                                <p className="textname">{skill.name}</p>
                            </div>
                        ))
                    ) : (
                        <div className="chip">
                            <p className="textname">Has no skills for now</p>
                        </div>
                    )}
                </div>

                <div className="Content">
                    <div className="content">
                        <div className="Text">
                            {
                                props.profile ? <p>SerieNumber:{props.profile.serieNumber}

                                    Address :{props.profile.address}</p>
                                    : ''}
                            Sector :{props.sector}
                        </div>
                        <div className="employees">
                            {/* <div className="joind-Users">
                                {props.candidates.map((candidate, i) => (
                                    <img key={i} src={candidate.avatar} alt="profile" className="Ellipse" />
                                ))}
                            </div> */}
                            <div className="numberEmployees">
                                {
                                    props.profile ? <p>  +{props.profile.nbEmployers} Employees</p> : 0
                                }
                            </div>
                        </div>
                    </div>

                    <button className="view-prfile-btn">View Profile</button>

                </div>
            </div>
        </div>
    )
}