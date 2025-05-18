import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';

// Import icons from lucide-react
import { 
  Code, 
  Check,
  ChevronDown, 
  X, 
  Calendar, 
  Clock, 
  Star, 
  Search,
  ArrowLeft,
  Save,
  Loader2
} from 'lucide-react';

const CreateSkill = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Web Development',
    level: 'Junior',
    usageFrequency: 'Daily',
    classement: 'Important',
    company_id: ''
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve company ID
  useEffect(() => {
    let id = companyId;
    
    if (!id) {
      id = localStorage.getItem('idCompany') || localStorage.getItem('company_id');
    }
    
    if (id) {
      setFormData(prev => ({ ...prev, company_id: id }));
    } else {
      toast.error('Company ID not found');
      navigate('/company/dashboard');
    }
  }, [companyId, navigate]);

  // Programming skills with icons/colors
  const programmingSkills = [
    { name: "HTML", color: "bg-orange-100 text-orange-600" },
    { name: "CSS", color: "bg-blue-100 text-blue-600" },
    { name: "JavaScript", color: "bg-yellow-100 text-yellow-700" },
    { name: "PHP", color: "bg-purple-100 text-purple-600" },
    { name: "Laravel", color: "bg-red-100 text-red-600" },
    { name: "React", color: "bg-cyan-100 text-cyan-600" },
    { name: "Vue.js", color: "bg-green-100 text-green-600" },
    { name: "MySQL", color: "bg-blue-100 text-blue-600" },
    { name: "Git", color: "bg-orange-100 text-orange-600" },
    { name: "REST APIs", color: "bg-indigo-100 text-indigo-600" },
    { name: "Node.js", color: "bg-green-100 text-green-600" },
    { name: "Python", color: "bg-blue-100 text-blue-600" },
    { name: "Docker", color: "bg-blue-100 text-blue-600" },
    { name: "AWS", color: "bg-orange-100 text-orange-600" },
    { name: "TypeScript", color: "bg-blue-100 text-blue-600" }
  ];

  // Skill types with icons
  const skillTypes = [
    { name: 'Web Development', icon: <Code size={18} /> },
    { name: 'Mobile Development', icon: <Code size={18} /> },
    { name: 'AI & Machine Learning', icon: <Code size={18} /> },
    { name: 'Data & Database', icon: <Code size={18} /> },
    { name: 'Cloud Computing', icon: <Code size={18} /> },
    { name: 'DevOps', icon: <Code size={18} /> },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'name') {
      setSearchInput(value);
    }
  };

  const selectSkill = (skill) => {
    setFormData({
      ...formData,
      name: skill,
    });
    setSearchInput(skill);
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.company_id) {
        toast.error('Company ID is required');
        setLoading(false);
        return;
      }

      const response = await api.post('/api/skills/create/company', formData);
      
      if (response.data.status === 'success') {
        toast.success('Skill created successfully');
        setFormData({
          ...formData,
          name: '',
          type: 'Web Development',
          level: 'Junior',
          usageFrequency: 'Daily',
          classement: 'Important',
        });
        setSearchInput('');
      }
    } catch (error) {
      console.error('Error creating skill:', error);
      
      if (error.response && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else {
        toast.error('An error occurred while creating the skill');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to get badge color based on level
  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'Junior': return 'bg-emerald-100 text-emerald-600';
      case 'Intermediate': return 'bg-amber-100 text-amber-600';
      case 'Advanced': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Function to get badge color based on frequency
  const getFrequencyBadgeColor = (frequency) => {
    switch (frequency) {
      case 'Daily': return 'bg-sky-100 text-sky-600';
      case 'Weekly': return 'bg-violet-100 text-violet-600';
      case 'Rarely': return 'bg-slate-100 text-slate-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Function to get badge color based on importance
  const getClassementBadgeColor = (classement) => {
    switch (classement) {
      case 'Important': return 'bg-rose-100 text-rose-600';
      case 'Optional': return 'bg-teal-100 text-teal-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto mt-8 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="h-6 w-6" />
          Create New Skill
        </h2>
        <p className="text-blue-100 text-sm mt-1">Add technical skills to your company profile</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Skill Type Selector - Modern Tabs */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skill Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {skillTypes.map((type) => (
              <div
                key={type.name}
                onClick={() => setFormData({...formData, type: type.name})}
                className={`
                  flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${formData.type === type.name 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                <div className="flex flex-col items-center text-center">
                  {type.icon}
                  <span className="mt-1 text-xs font-medium">{type.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Name with Autocomplete */}
        <div className="mb-8 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skill Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Search or enter skill name"
              value={searchInput}
              onChange={handleChange}
              onFocus={() => setDropdownOpen(true)}
              className="w-full pl-10 pr-4 py-3 border-0 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              required
            />
            {dropdownOpen && searchInput && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-2 flex justify-between items-center border-b">
                  <span className="text-sm font-medium text-gray-700">Suggested Skills</span>
                  <button 
                    type="button" 
                    onClick={() => setDropdownOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto p-1">
                  {programmingSkills
                    .filter(skill => skill.name.toLowerCase().includes(searchInput.toLowerCase()))
                    .map((skill) => (
                      <div
                        key={skill.name}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md flex items-center gap-2 transition-colors duration-150"
                        onClick={() => selectSkill(skill.name)}
                      >
                        <div className={`w-2 h-2 rounded-full ${skill.color.split(' ')[0]}`}></div>
                        <span>{skill.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Badge for Selected Skill */}
        {formData.name && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Skill Preview
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeColor(formData.level)}`}>
                  {formData.level}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFrequencyBadgeColor(formData.usageFrequency)}`}>
                  {formData.usageFrequency}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getClassementBadgeColor(formData.classement)}`}>
                  {formData.classement}
                </span>
                <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
                  {formData.type}
                </span>
              </div>
              <div className="mt-3 bg-white shadow-sm rounded-lg p-3 border border-gray-100">
                <h3 className="font-medium">{formData.name || "Unnamed Skill"}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Skill Properties - Card Layout */}
        <div className="mb-8 grid grid-cols-1 gap-6">
          {/* Required Proficiency */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center mb-3">
              <Star className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="font-medium text-gray-800">Required Proficiency</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Junior', 'Intermediate', 'Advanced'].map((level) => (
                <label key={level} className={`
                  flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${formData.level === level 
                    ? `${getLevelBadgeColor(level)} shadow-sm` 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'}
                `}>
                  <input
                    type="radio"
                    name="level"
                    value={level}
                    checked={formData.level === level}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{level}</span>
                  {formData.level === level && (
                    <Check size={16} className="ml-1" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Usage Frequency */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-gray-800">Usage Frequency</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Daily', 'Weekly', 'Rarely'].map((freq) => (
                <label key={freq} className={`
                  flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${formData.usageFrequency === freq 
                    ? `${getFrequencyBadgeColor(freq)} shadow-sm` 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'}
                `}>
                  <input
                    type="radio"
                    name="usageFrequency"
                    value={freq}
                    checked={formData.usageFrequency === freq}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{freq}</span>
                  {formData.usageFrequency === freq && (
                    <Check size={16} className="ml-1" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Importance Level */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 text-rose-500 mr-2" />
              <h3 className="font-medium text-gray-800">Importance Level</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Important', 'Optional'].map((classement) => (
                <label key={classement} className={`
                  flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${formData.classement === classement 
                    ? `${getClassementBadgeColor(classement)} shadow-sm` 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'}
                `}>
                  <input
                    type="radio"
                    name="classement"
                    value={classement}
                    checked={formData.classement === classement}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{classement}</span>
                  {formData.classement === classement && (
                    <Check size={16} className="ml-1" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Hidden Company ID */}
        <input 
          type="hidden" 
          name="company_id" 
          value={formData.company_id} 
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 flex items-center"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="mr-1.5" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.company_id || !formData.name}
            className={`px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center
            ${(loading || !formData.company_id || !formData.name) ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-1.5" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-1.5" />
                Save Skill
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSkill;