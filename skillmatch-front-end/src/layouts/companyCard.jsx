export default function CompanyCard({ id, name, logo, profile, sector, skills }) {
  return (
    <div className="flex justify-center p-2">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg w-[250px] min-h-[320px] flex flex-col p-4 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="flex items-center">
          <img src={logo} alt={name} className="w-8 h-8 object-contain bg-gray-200 rounded" />
        </div>
        <div className="mt-2">
          <p className="text-base font-bold text-gray-800 tracking-tight">{name}</p>
        </div>
        <div className="mt-1">
          {profile ? (
            <a href={profile.email} className="text-blue-700 hover:text-blue-900 text-xs font-medium transition-colors underline underline-offset-2">
              {profile.email}
            </a>
          ) : (
            <a href={sector} className="text-blue-700 hover:text-blue-900 text-xs font-medium transition-colors underline underline-offset-2">
              {sector}
            </a>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {skills && skills.length > 0 ? (
            skills.map((skill, i) => (
              <div key={i} className="bg-gray-100 rounded-full px-2 py-0.5 border border-gray-200">
                <p className="text-xs text-gray-700 font-medium">{skill.name}</p>
              </div>
            ))
          ) : (
            <div className="bg-gray-100 rounded-full px-2 py-0.5 border border-gray-200">
              <p className="text-xs text-gray-700 font-medium">Has no skills for now</p>
            </div>
          )}
        </div>
        <div className="mt-3 flex-1">
          <div className="space-y-1 text-gray-600 text-xs leading-tight">
            {profile ? (
              <p>
                SerieNumber: {profile.serieNumber}
                <br />
                Address: {profile.address}
              </p>
            ) : (
              <p>We didn't create our profile yet</p>
            )}
            <p className="font-medium text-gray-800">Sector: {sector}</p>
          </div>
          <div className="mt-1">
            <div className="text-xs text-gray-600 font-medium">
              {profile ? <p>+{profile.nbEmployers} Employees</p> : <p>0 Employees</p>}
            </div>
          </div>
        </div>
        <a
          href={`/candidate/company/${id}/profile`}
          className="mt-2 block bg-indigo-600 hover:bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-300 text-center h-8"
        >
          View Profile
        </a>
      </div>
    </div>
  );
}