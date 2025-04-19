import '../styles/pages/SugggestedCompanies/companycard.css'


export default function CompnayCard({ props }) {

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
                    <a className='link-url' href={props.profile.email}>{props.profile.email}</a>
                </div>
                <div className="skils">
                    {props.skills.map((skill, i) => (
                        <div key={i} className="chip">
                            <p className="textname">{skill.name}</p>
                        </div>
                    ))}
                </div>
                <div className="Content">
                    <div className="content">
                        <div className="Text">
                            SerieNumber:{props.profile.serieNumber}
                            Sector :{props.sector}
                            Address :{props.profile.address}

                        </div>
                        <div className="employees">
                            {/* <div className="joind-Users">
                                {props.candidates.map((candidate, i) => (
                                    <img key={i} src={candidate.avatar} alt="profile" className="Ellipse" />
                                ))}
                            </div> */}
                            <div className="numberEmployees">
                                +{props.profile.nbEmployers} Employees
                            </div>
                        </div>
                    </div>

                    <button className="view-prfile-btn">View Profile</button>

                </div>
            </div>
        </div>
    )
}