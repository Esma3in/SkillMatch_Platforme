import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

const CreateSkill = () => {
  const { companyId } = useParams(); // Get company ID from URL params
  const navigate = useNavigate();
  
  // État initial du formulaire
  const [formData, setFormData] = useState({
    name: '',
    type: 'Programming Skills',
    level: 'Junior',
    usageFrequency: 'Daily',
    classement: 'Important',
    company_id: '' // Added company_id field
  });

  // État pour gérer le menu déroulant des compétences
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Retrieve company ID from URL or localStorage
  useEffect(() => {
    // Try to get company ID from URL params first
    let id = companyId;
    
    // If not available in URL, try localStorage
    if (!id) {
      id = localStorage.getItem('idCompany') || localStorage.getItem('company_id');
    }
    
    if (id) {
      setFormData(prev => ({ ...prev, company_id: id }));
    } else {
      toast.error('Company ID not found');
      // Redirect to company listing or dashboard if no company ID
      navigate('/company/dashboard');
    }
  }, [companyId, navigate]);

  // Liste des compétences programmation disponibles
  const programmingSkills = [
            "HTML",
            "CSS",
            "JavaScript",
            "PHP",
            "Laravel",
            "React",
            "Vue.js",
            "MySQL",
            "Git",
            "REST APIs",
            "Node.js",
            "Python",
            "Docker",
            "AWS",
            "TypeScript"
  ];

  // Liste des types de compétences
  const skillTypes = [
    'Web Development',
    'Mobile Development',
    'AI & Machine Learning',
    'Data & Database',
    'Cloud Computing',
    'DevOps',
  ];

  // Gestion du changement des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Sélection d'une compétence prédéfinie
  const selectSkill = (skill) => {
    setFormData({
      ...formData,
      name: skill,
    });
    setDropdownOpen(false);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make sure we have a company ID
      if (!formData.company_id) {
        toast.error('Company ID is required');
        setLoading(false);
        return;
      }

      const response = await api.post('/api/skills/create/company', formData);
      
      if (response.data.status === 'success') {
        toast.success('Compétence créée avec succès');
        // Réinitialiser le formulaire après succès
        setFormData({
          ...formData,
          name: '',
          type: 'Programming Skills',
          level: 'Junior',
          usageFrequency: 'Daily',
          classement: 'Important',
          // Keep the company_id
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création de la compétence:', error);
      
      if (error.response && error.response.data.errors) {
        // Afficher les erreurs de validation
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach(message => toast.error(message));
      } else {
        toast.error('Une erreur est survenue lors de la création de la compétence');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create new skill</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Type de compétence */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center bg-blue-100 rounded-md p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {skillTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nom de la compétence */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Enter skill name"
              value={formData.name}
              onChange={handleChange}
              onClick={() => formData.type === 'Programming Skills' && setDropdownOpen(true)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {formData.type === 'Programming Skills' && dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {programmingSkills
                  .filter(skill => skill.toLowerCase().includes(formData.name.toLowerCase()))
                  .map((skill) => (
                    <div
                      key={skill}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                      onClick={() => selectSkill(skill)}
                    >
                      <span className="ml-2">{skill}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Importance Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Importance Level
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="important"
                  name="classement"
                  value="Important"
                  checked={formData.classement === 'Important'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="important" className="ml-2 block text-sm text-gray-700">
                  Important
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="optional"
                  name="classement"
                  value="Optional"
                  checked={formData.classement === 'Optional'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="optional" className="ml-2 block text-sm text-gray-700">
                  Optional
                </label>
              </div>
            </div>
          </div>

          {/* Usage Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Frequency
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="daily"
                  name="usageFrequency"
                  value="Daily"
                  checked={formData.usageFrequency === 'Daily'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="daily" className="ml-2 block text-sm text-gray-700">
                  Daily
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="weekly"
                  name="usageFrequency"
                  value="Weekly"
                  checked={formData.usageFrequency === 'Weekly'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="weekly" className="ml-2 block text-sm text-gray-700">
                  Weekly
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="rarely"
                  name="usageFrequency"
                  value="Rarely"
                  checked={formData.usageFrequency === 'Rarely'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="rarely" className="ml-2 block text-sm text-gray-700">
                  Rarely
                </label>
              </div>
            </div>
          </div>

          {/* Required Proficiency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Proficiency
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="junior"
                  name="level"
                  value="Junior"
                  checked={formData.level === 'Junior'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="junior" className="ml-2 block text-sm text-gray-700">
                  Junior
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="intermediate"
                  name="level"
                  value="Intermediate"
                  checked={formData.level === 'Intermediate'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="intermediate" className="ml-2 block text-sm text-gray-700">
                  Intermediate
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="advanced"
                  name="level"
                  value="Advanced"
                  checked={formData.level === 'Advanced'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="advanced" className="ml-2 block text-sm text-gray-700">
                  Advanced
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Company ID (Hidden) */}
        <input 
          type="hidden" 
          name="company_id" 
          value={formData.company_id} 
        />

        {/* Boutons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.company_id}
            className={`px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center ${(loading || !formData.company_id) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSkill; 