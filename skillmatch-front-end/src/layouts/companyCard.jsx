
import '../styles/pages/SugggestedCompanies/companycard.css'


export default function CompanyCard({ id,name,logo, profile, sector, skills }) {
  
    return (
      <div className="container-companycard">
        <div className="card">
          <div className="logo">
            <img src={logo} alt={name} width='40px' height='40px' />
          </div>
          <div className="title">
            <p>{name}</p>
          </div>
          <div className="link">
            {profile ? (
              <a className="link-url" href={profile.email}>{profile.email}</a>
            ) : (
              <a className="link-url" href={sector}>{sector}</a>
            )}
          </div>
          <div className="skils">
            {skills && skills.length > 0 ? (
              skills.map((skill, i) => (
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
                {profile ? 
                  <p>
                    SerieNumber: {profile.serieNumber}<br />
                    Address: {profile.address}
                  </p> : <p>We didnt create our porfile yet</p>
                }
                Sector: {sector}
              </div>
              <div className="employees">
                <div className="numberEmployees">
                  {profile ? <p>+{profile.nbEmployers} Employees</p> : 0}
                </div>
              </div>
            </div>
            <a href={`/candidate/company/${id}/profile`} className="view-prfile-btn">View Profile</a>
          </div>
        </div>
      </div>

    );
  }
  