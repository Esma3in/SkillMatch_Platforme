import { useState, useEffect } from "react";
import { api } from "../api/api";
import { PlusCircle, Trash2, Save, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

export default function TestCreationForm() {
  // États pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    objective: "",
    prerequisites: "",
    tools_Required: "",
    before_answer: "",
    qcm_id: "",
    company_id: "",
    skill_id: "",
    skill_ids: [],
    steps: [
      {
        title: "",
        description: "",
        order: 1,
      },
    ],
  });

  // États pour les données externes
  const [qcms, setQcms] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isStepsOpen, setIsStepsOpen] = useState(true);
  const [isSkillsOpen, setIsSkillsOpen] = useState(true);

  // Chargement des données externes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qcmsRes, companiesRes, skillsRes] = await Promise.all([
          api.get("/api/qcms"),
          api.get("/api/companies"),
          api.get("/api/skills"),
        ]);
        setQcms(qcmsRes.data);
        setCompanies(companiesRes.data);
        setSkills(skillsRes.data);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données nécessaires au formulaire.");
      }
    };

    fetchData();
  }, []);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion des changements pour les compétences multiples
  const handleSkillCheckbox = (skillId) => {
    const updatedSkillIds = formData.skill_ids.includes(skillId)
      ? formData.skill_ids.filter((id) => id !== skillId)
      : [...formData.skill_ids, skillId];

    setFormData({ ...formData, skill_ids: updatedSkillIds });
  };

  // Gestion des étapes
  const addStep = () => {
    const newStep = {
      title: "",
      description: "",
      order: formData.steps.length + 1,
    };
    setFormData({ ...formData, steps: [...formData.steps, newStep] });
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index][field] = value;
    setFormData({ ...formData, steps: updatedSteps });
  };

  const removeStep = (index) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    // Réorganiser les ordres après suppression
    const reorderedSteps = updatedSteps.map((step, i) => ({
      ...step,
      order: i + 1,
    }));
    setFormData({ ...formData, steps: reorderedSteps });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/create/tests/company", formData);
      console.log("Test créé:", response.data);
      setSuccess(true);
      // Réinitialiser le formulaire ou rediriger
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de la création du test:", err);
      setError(
        err.response?.data?.message ||
          "Une erreur s'est produite lors de la création du test."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <a href="#" className="text-blue-600 hover:underline text-sm">
            Retour à la liste
          </a>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Créer un nouveau test</h1>
        <p className="text-gray-600 mt-1">
          Configurez les détails du test et ajoutez des étapes pour les candidats.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
          Test créé avec succès !
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations principales */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Informations principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Objectif <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Objectif du test"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Prérequis
                </label>
                <input
                  type="text"
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Prérequis pour le test"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Outils requis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tools_Required"
                  value={formData.tools_Required}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Outils nécessaires"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Instructions préalables <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="before_answer"
                  value={formData.before_answer}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instructions avant de commencer"
                />
              </div>
            </div>
          </div>

          {/* Sélections */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Entreprise <span className="text-red-500">*</span>
              </label>
              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une entreprise</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                QCM associé <span className="text-red-500">*</span>
              </label>
              <select
                name="qcm_id"
                value={formData.qcm_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un QCM</option>
                {qcms.map((qcm) => (
                  <option key={qcm.id} value={qcm.id}>
                    {qcm.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Compétence principale <span className="text-red-500">*</span>
              </label>
              <select
                name="skill_id"
                value={formData.skill_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une compétence principale</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Compétences additionnelles */}
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsSkillsOpen(!isSkillsOpen)}
              >
                <h2 className="text-lg font-medium text-gray-700">
                  Compétences additionnelles
                </h2>
                {isSkillsOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {isSkillsOpen && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`skill-${skill.id}`}
                        checked={formData.skill_ids.includes(skill.id)}
                        onChange={() => handleSkillCheckbox(skill.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`skill-${skill.id}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {skill.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Étapes du test */}
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsStepsOpen(!isStepsOpen)}
              >
                <h2 className="text-lg font-medium text-gray-700">
                  Étapes du test
                </h2>
                {isStepsOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {isStepsOpen && (
                <div className="mt-4 space-y-6">
                  {formData.steps.map((step, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-md p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-medium text-gray-700">{`Étape ${step.order}`}</h3>
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="text-red-500 hover:text-red-700 flex items-center text-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titre <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) =>
                              handleStepChange(index, "title", e.target.value)
                            }
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Titre de l'étape"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={step.description || ""}
                            onChange={(e) =>
                              handleStepChange(index, "description", e.target.value)
                            }
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Description détaillée de l'étape"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addStep}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm mt-2"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Ajouter une étape
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Enregistrer le test
          </button>
        </div>
      </form>
    </div>
  );
}