import { useState, useRef, useEffect } from "react";
import {
  HelpCircle,
  Clock,
  Check,
  ChevronDown,
  Camera,
  User,
  AlertCircle,
  FileText,
  X,
  Plus,
  Trash2
} from "lucide-react";
import '../styles/pages/CreateProfileCompany.css';
import { api } from "../api/api";

// Utility function for className merging
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

// Simple unique ID generator
const generateUniqueId = () => Date.now() + Math.random();


export default function ValidatedCompanyProfile() {
  // File input references
  const logoInputRef = useRef(null);
  const ceoAvatarInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const CompanyId = localStorage.getItem("company_id"); // Assuming CompanyId is stored here

  // Pre-defined options for dropdowns (only sector remains)
  const sectorOptions = [
    { value: "tech", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "construction", label: "Construction" },
    { value: "hospitality", label: "Hospitality" },
  ];

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    // Company table
    logoFile: null, // Store actual File object for submission
    logoPreview: null, // Store Data URL for image preview
    sector: "",
    sectorLabel: "Select sector",
    file: null, // Store actual File object for submission
    fileName: "", // Added to display file name

    // Company Profile table
    address: "",
    phone: "", // Simple phone number field
    Bio: "",
    Datecreation: "",

    // CEO table
    ceoName: "",
    ceoAvatarFile: null, // Store actual File object for submission
    ceoAvatarPreview: null, // Store Data URL for image preview
    ceoDescription: "",

    // Additional UI fields (not in DB but needed for UI)
    websiteUrl: "",

    // --- New Sections ---
    // Service section state: Array of { id, name, descriptions: [{ id, text }] }
    services: [],

    // Legal Documents section state: Array of { id, documentName, descriptions: [{ id, text }] }
    legalDocuments: [],
  });

// Toggle dropdown state (only sector remains)
const [dropdowns, setDropdowns] = useState({
  sector: false,
});

// Create refs for the dropdown containers to detect clicks outside
const sectorDropdownRef = useRef(null);

// Corrected toggleDropdown function
const toggleDropdown = (dropdown) => {
  setDropdowns(prev => {
    const newState = {};
    Object.keys(prev).forEach(key => {
      if (key === dropdown) {
        newState[key] = !prev[key];
      } else {
        newState[key] = false;
      }
    });
    return newState;
  });
};

// Close dropdowns when clicking outside effect (uses dropdowns, sectorDropdownRef, setDropdowns)
useEffect(() => {
  function handleClickOutside(event) {
    // Check if click was outside sector dropdown
    if (
      dropdowns.sector &&
      sectorDropdownRef.current &&
      !sectorDropdownRef.current.contains(event.target)
    ) {
      setDropdowns(prev => ({
        ...prev,
        sector: false
      }));
      // Mark sector as touched when dropdown closes from outside click
      setTouched(prev => ({ ...prev, sector: true }));
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [dropdowns]);

  // --- VALIDATION STATE ---
  const [errors, setErrors] = useState({});
  // Using a simpler touched state for nested arrays: just mark the array key as touched on submit
  // For individual fields, rely on onBlur. For array items, rely on submit attempt.
  const [touched, setTouched] = useState({});

  // --- VALIDATION FUNCTIONS ---
  const validateSector = (value) => {
    if (!value) return "Please select a business sector";
    return "";
  };

  const validateAddress = (value) => {
    if (!value.trim()) return "Address is required";
    if (value.trim().length < 5) return "Address should be at least 5 characters";
    return "";
  };

  const validatePhone = (value) => {
    if (!value.trim()) return "Phone number is required";
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(value)) return "Please enter a valid phone number";
    if (value.trim().length < 7) return "Phone number seems too short";
    return "";
  };

  const validateWebsiteUrl = (value) => {
    if (!value.trim()) return "Website URL is required";
    const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z]{2,})(\/\S*)?$/;
    if (!urlRegex.test(value)) return "Please enter a valid website URL (e.g., example.com or https://www.example.co.uk)";
    return "";
  };

  const validateBio = (value) => {
    if (!value.trim()) return "Company bio is required";
    if (value.length < 50) return "Bio should be at least 50 characters";
    return "";
  };

  const validateDatecreation = (value) => {
    if (!value) return "Date of creation is required";
    const selectedDate = new Date(value);
    const currentDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (selectedDate > currentDate) return "Date cannot be in the future";
    return "";
  };

  const validateCeoName = (value) => {
    if (!value.trim()) return "CEO name is required";
    if (value.trim().length < 3) return "CEO name should be at least 3 characters";
    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    if (!nameRegex.test(value.trim())) return "Please enter a valid name";
    return "";
  };

  const validateCeoDescription = (value) => {
    if (!value.trim()) return "CEO description is required";
    if (value.length < 50) return "Description should be at least 50 characters";
    return "";
  };

  const validateFile = (file) => {
    if (!file) return "Company document is required";
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) return `File size should be less than ${maxSize / 1024 / 1024}MB`;
    const allowedTypes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'text/plain', // .txt
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
    ];
    if (!allowedTypes.includes(file.type)) return "Invalid file type. Allowed types: PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX";
    return "";
  };

  const validateImageFile = (file, fieldName) => {
    if (!file) return `${fieldName} is required`;
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) return `${fieldName} size should be less than ${maxSize / 1024 / 1024}MB`;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) return `Invalid file type for ${fieldName}. Allowed types: JPEG, PNG, JPG, GIF, SVG`;
    return "";
  };

  // --- New Validation Functions for Services and Legal Docs ---

  // Helper to validate a single description object
  const validateDescription = (description) => {
      const errors = {};
      if (!description.text.trim()) errors.text = "Description is required";
      return Object.keys(errors).length > 0 ? errors : null;
  }

  // Helper to validate a single service object (name and its descriptions)
  const validateService = (service) => {
    const errors = { id: service.id }; // Associate errors with the item ID

    if (!service.name.trim()) errors.name = "Service name is required";
    if (service.name.trim().length < 3) errors.name = "Service name must be at least 3 characters";

    // Validate descriptions for this service
    const descriptionErrors = service.descriptions.map(validateDescription).filter(err => err !== null);

    if (descriptionErrors.length > 0) {
        errors.descriptions = descriptionErrors;
    }

     if (service.descriptions.length === 0) {
          errors.noDescriptions = "At least one description is required per service";
     }

    return Object.keys(errors).length > 1 ? errors : null;
  };

  // Helper to validate a single legal document object (name and its descriptions)
   const validateLegalDocument = (doc) => {
     const errors = { id: doc.id }; // Associate errors with the item ID

     if (!doc.documentName.trim()) errors.documentName = "Document name is required";
      if (doc.documentName.trim().length < 3) errors.documentName = "Document name must be at least 3 characters";

     // Validate descriptions for this document
     const descriptionErrors = doc.descriptions.map(validateDescription).filter(err => err !== null);

     if (descriptionErrors.length > 0) {
         errors.descriptions = descriptionErrors;
     }

      if (doc.descriptions.length === 0) {
           errors.noDescriptions = "At least one description is required per legal document";
       }

     return Object.keys(errors).length > 1 ? errors : null;
   };


  // --- EFFECT FOR REAL-TIME VALIDATION (mostly on touched fields) ---
  useEffect(() => {
    const newErrors = {};

    // Basic field validation (run only if touched)
    if (touched.sector) newErrors.sector = validateSector(formData.sector);
    if (touched.address) newErrors.address = validateAddress(formData.address);
    if (touched.phone) newErrors.phone = validatePhone(formData.phone);
    if (touched.websiteUrl) newErrors.websiteUrl = validateWebsiteUrl(formData.websiteUrl);
    if (touched.Bio) newErrors.Bio = validateBio(formData.Bio);
    if (touched.Datecreation) newErrors.Datecreation = validateDatecreation(formData.Datecreation);
    if (touched.ceoName) newErrors.ceoName = validateCeoName(formData.ceoName);
    if (touched.ceoDescription) newErrors.ceoDescription = validateCeoDescription(formData.ceoDescription);

    // File validation (run regardless of touched state for required files)
    newErrors.file = validateFile(formData.file);
    newErrors.logoFile = validateImageFile(formData.logoFile, 'Company Logo');
    newErrors.ceoAvatarFile = validateImageFile(formData.ceoAvatarFile, 'CEO Photo');

    // --- New Validation for Services and Legal Docs ---
    const serviceErrors = formData.services.map(service => {
         const isServiceTouched = touched.services?.find(s => s.id === service.id);
         if (isServiceTouched || touched.services === true) {
             return validateService(service);
         }
         return null;
    }).filter(err => err !== null);

    if (serviceErrors.length > 0) newErrors.services = serviceErrors;

     const legalDocumentErrors = formData.legalDocuments.map(doc => {
         const isDocTouched = touched.legalDocuments?.find(d => d.id === doc.id);
          if (isDocTouched || touched.legalDocuments === true) {
              return validateLegalDocument(doc);
          }
          return null;
     }).filter(err => err !== null);

     if (legalDocumentErrors.length > 0) newErrors.legalDocuments = legalDocumentErrors;

    setErrors(newErrors);

  }, [formData, touched]);


  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const handleSelectChange = (field, value, label = value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
      [`${field}Label`]: label
    }));
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Log the file object
    console.log("Field:", field); // Log the field name

    if (file) {
      if (field === 'logo' || field === 'ceoAvatar') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData(prevState => ({
            ...prevState,
            [`${field}File`]: file,
            [`${field}Preview`]: event.target.result
          }));
        };
        reader.readAsDataURL(file);
        setTouched(prev => ({ ...prev, [`${field}File`]: true })); // Correctly set touched state for 'logoFile'/'ceoAvatarFile'
      } else { // This branch is for field === 'file' (the company document)
        setFormData(prevState => ({
          ...prevState,
          [field]: file,       // This correctly sets formData.file
          fileName: file.name
        }));
        setTouched(prev => ({ ...prev, [field]: true })); // CORRECTED: Set touched.file directly
      }
    } else { // If no file is selected (e.g., user cancels file picker)
      if (field === 'logo' || field === 'ceoAvatar') {
        setFormData(prevState => ({
          ...prevState,
          [`${field}File`]: null,
          [`${field}Preview`]: null
        }));
        setTouched(prev => ({ ...prev, [`${field}File`]: true }));
      } else { // This branch is for field === 'file'
        setFormData(prevState => ({
          ...prevState,
          [field]: null,
          fileName: ""
        }));
        setTouched(prev => ({ ...prev, [field]: true })); // CORRECTED: Set touched.file directly
      }
    }
    e.target.value = null; // Clear the input field for subsequent selections
  };

  const handleRemoveFile = () => {
    setFormData(prevState => ({
      ...prevState,
      file: null,
      fileName: ""
    }));
    setTouched(prev => ({ ...prev, file: true }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: generateUniqueId(),
          name: "",
          descriptions: []
        }
      ]
    }));
  };

  const removeService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== serviceId)
    }));
     setErrors(prevErrors => {
         if (!prevErrors.services) return prevErrors;
         return {
             ...prevErrors,
             services: prevErrors.services.filter(err => err.id !== serviceId)
         };
     });
     setTouched(prevTouched => {
         if (!prevTouched.services || !Array.isArray(prevTouched.services)) return prevTouched;
         return {
             ...prevTouched,
             services: prevTouched.services.filter(t => t.id !== serviceId)
         };
     });
  };

  const handleServiceChange = (serviceId, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId ? { ...service, name: value } : service
      )
    }));
    setTouched(prev => {
        const newTouchedServices = [...(prev.services || [])];
        const serviceIndex = newTouchedServices.findIndex(s => s.id === serviceId);
         if (serviceIndex !== -1) {
             newTouchedServices[serviceIndex] = {
                 ...(newTouchedServices[serviceIndex] || {}),
                 id: serviceId,
                 name: true
             };
         }
        return { ...prev, services: newTouchedServices };
    });
  };

  const addServiceDescription = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId
          ? {
            ...service,
            descriptions: [...service.descriptions, { id: generateUniqueId(), text: "" }]
          }
          : service
      )
    }));
  };

  const removeServiceDescription = (serviceId, descriptionId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId
          ? {
            ...service,
            descriptions: service.descriptions.filter(desc => desc.id !== descriptionId)
          }
          : service
      )
    }));
     setErrors(prevErrors => {
         if (!prevErrors.services) return prevErrors;
         return {
             ...prevErrors,
             services: prevErrors.services.map(serviceErr => {
                 if (serviceErr.id === serviceId && serviceErr.descriptions) {
                     return {
                         ...serviceErr,
                         descriptions: serviceErr.descriptions.filter(descErr => descErr.id !== descriptionId)
                     };
                 }
                 return serviceErr;
             }).filter(err => Object.keys(err).length > 1)
         };
     });
      setTouched(prevTouched => {
         if (!prevTouched.services || !Array.isArray(prevTouched.services)) return prevTouched;
         return {
             ...prevTouched,
             services: prevTouched.services.map(serviceTouched => {
                 if (serviceTouched.id === serviceId && serviceTouched.descriptions && Array.isArray(serviceTouched.descriptions)) {
                     return {
                         ...serviceTouched,
                         descriptions: serviceTouched.descriptions.filter(descTouched => descTouched.id !== descriptionId)
                     };
                 }
                 return serviceTouched;
             }).filter(t => Object.keys(t).length > 1)
         };
     });
  };

  const handleServiceDescriptionChange = (serviceId, descriptionId, text) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId
          ? {
            ...service,
            descriptions: service.descriptions.map(desc =>
              desc.id === descriptionId ? { ...desc, text: text } : desc
            )
          }
          : service
      )
    }));
      setTouched(prev => {
        const newTouchedServices = [...(prev.services || [])];
        const serviceIndex = newTouchedServices.findIndex(s => s.id === serviceId);
         if (serviceIndex !== -1) {
             const serviceTouched = newTouchedServices[serviceIndex] || { id: serviceId, descriptions: [] };
             const newTouchedDescriptions = [...(serviceTouched.descriptions || [])];
             const descIndex = newTouchedDescriptions.findIndex(d => d.id === descriptionId);
              if (descIndex !== -1) {
                  newTouchedDescriptions[descIndex] = { ...newTouchedDescriptions[descIndex], text: true, id: descriptionId };
              } else {
                   newTouchedDescriptions.push({ id: descriptionId, text: true });
               }
              newTouchedServices[serviceIndex] = { ...serviceTouched, descriptions: newTouchedDescriptions };
         }
        return { ...prev, services: newTouchedServices };
    });
  };

  const addLegalDocument = () => {
      setFormData(prev => ({
          ...prev,
          legalDocuments: [
              ...prev.legalDocuments,
              {
                  id: generateUniqueId(),
                  documentName: "",
                  descriptions: []
              }
          ]
      }));
  };

  const removeLegalDocument = (docId) => {
      setFormData(prev => ({
          ...prev,
          legalDocuments: prev.legalDocuments.filter(doc => doc.id !== docId)
      }));
       setErrors(prevErrors => {
          if (!prevErrors.legalDocuments) return prevErrors;
          return {
              ...prevErrors,
              legalDocuments: prevErrors.legalDocuments.filter(err => err.id !== docId)
          };
       });
        setTouched(prevTouched => {
             if (!prevTouched.legalDocuments || !Array.isArray(prevTouched.legalDocuments)) return prevTouched;
             return {
                 ...prevTouched,
                 legalDocuments: prevTouched.legalDocuments.filter(t => t.id !== docId)
             };
         });
  };

  const handleLegalDocumentChange = (docId, value) => {
      setFormData(prev => ({
          ...prev,
          legalDocuments: prev.legalDocuments.map(doc =>
              doc.id === docId ? { ...doc, documentName: value } : doc
          )
      }));
       setTouched(prev => {
            const newTouchedDocs = [...(prev.legalDocuments || [])];
            const docIndex = newTouchedDocs.findIndex(d => d.id === docId);
             if (docIndex !== -1) {
                 newTouchedDocs[docIndex] = {
                     ...(newTouchedDocs[docIndex] || {}),
                      id: docId,
                     documentName: true
                 };
             }
            return { ...prev, legalDocuments: newTouchedDocs };
        });
  };

  const addLegalDocumentDescription = (docId) => {
      setFormData(prev => ({
          ...prev,
          legalDocuments: prev.legalDocuments.map(doc =>
              doc.id === docId
                  ? {
                      ...doc,
                      descriptions: [...doc.descriptions, { id: generateUniqueId(), text: "" }]
                  }
                  : doc
          )
      }));
  };

  const removeLegalDocumentDescription = (docId, descriptionId) => {
      setFormData(prev => ({
          ...prev,
          legalDocuments: prev.legalDocuments.map(doc =>
              doc.id === docId
                  ? {
                      ...doc,
                      descriptions: doc.descriptions.filter(desc => desc.id !== descriptionId)
                  }
                  : doc
          )
      }));
        setErrors(prevErrors => {
            if (!prevErrors.legalDocuments) return prevErrors;
            return {
                ...prevErrors,
                legalDocuments: prevErrors.legalDocuments.map(docErr => {
                    if (docErr.id === docId && docErr.descriptions) {
                        return {
                            ...docErr,
                            descriptions: docErr.descriptions.filter(descErr => descErr.id !== descriptionId)
                        };
                    }
                    return docErr;
                }).filter(err => Object.keys(err).length > 1)
            };
        });
         setTouched(prevTouched => {
             if (!prevTouched.legalDocuments || !Array.isArray(prevTouched.legalDocuments)) return prevTouched;
             return {
                 ...prevTouched,
                 legalDocuments: prevTouched.legalDocuments.map(docTouched => {
                     if (docTouched.id === docId && docTouched.descriptions && Array.isArray(docTouched.descriptions)) {
                         return {
                             ...docTouched,
                             descriptions: docTouched.descriptions.filter(descTouched => descTouched.id !== descriptionId)
                         };
                     }
                     return docTouched;
                 }).filter(t => Object.keys(t).length > 1)
             };
         });
  };

  const handleLegalDocumentDescriptionChange = (docId, descriptionId, text) => {
      setFormData(prev => ({
          ...prev,
          legalDocuments: prev.legalDocuments.map(doc =>
              doc.id === docId
                  ? {
                      ...doc,
                      descriptions: doc.descriptions.map(desc =>
                          desc.id === descriptionId ? { ...desc, text: text } : desc
                      )
                  }
                  : doc
          )
      }));
        setTouched(prev => {
             const newTouchedDocs = [...(prev.legalDocuments || [])];
            const docIndex = newTouchedDocs.findIndex(d => d.id === docId);
             if (docIndex !== -1) {
                 const docTouched = newTouchedDocs[docIndex] || { id: docId, descriptions: [] };
                 const newTouchedDescriptions = [...(docTouched.descriptions || [])];
                 const descIndex = newTouchedDescriptions.findIndex(d => d.id === descriptionId);
                 if (descIndex !== -1) {
                     newTouchedDescriptions[descIndex] = { ...newTouchedDescriptions[descIndex], text: true, id: descriptionId };
                 } else {
                     newTouchedDescriptions.push({ id: descriptionId, text: true });
                 }
                 newTouchedDocs[docIndex] = { ...docTouched, descriptions: newTouchedDescriptions };
             }
             return { ...prev, legalDocuments: newTouchedDocs };
         });
  };


  // --- FORM SUBMISSION ---

  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(formData).forEach(key => {
        if (['services', 'legalDocuments'].includes(key)) {
            newTouched[key] = true;
            if (Array.isArray(formData[key])) {
                 newTouched[key] = formData[key].map(item => ({
                     id: item.id,
                     ...(key === 'services' ? { name: true } : { documentName: true }),
                     descriptions: item.descriptions.map(desc => ({ id: desc.id, text: true }))
                 }));
            }
        } else if (['logoFile', 'ceoAvatarFile', 'file'].includes(key)) {
             newTouched[key] = true;
        }
         else {
            newTouched[key] = true;
        }
    });

    newErrors.sector = validateSector(formData.sector);
    newErrors.address = validateAddress(formData.address);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.websiteUrl = validateWebsiteUrl(formData.websiteUrl);
    newErrors.Bio = validateBio(formData.Bio);
    newErrors.Datecreation = validateDatecreation(formData.Datecreation);
    newErrors.ceoName = validateCeoName(formData.ceoName);
    newErrors.ceoDescription = validateCeoDescription(formData.ceoDescription);
    newErrors.file = validateFile(formData.file);
    newErrors.logoFile = validateImageFile(formData.logoFile, 'Company Logo');
    newErrors.ceoAvatarFile = validateImageFile(formData.ceoAvatarFile, 'CEO Photo');

    const serviceErrors = formData.services.map(validateService).filter(err => err !== null);
    if (serviceErrors.length > 0) newErrors.services = serviceErrors;

    const legalDocumentErrors = formData.legalDocuments.map(validateLegalDocument).filter(err => err !== null);
    if (legalDocumentErrors.length > 0) newErrors.legalDocuments = legalDocumentErrors;

    setErrors(newErrors);
    setTouched(newTouched);

    const hasBasicErrors = Object.values(newErrors).some(error => error && typeof error === 'string');
    const hasServiceErrors = newErrors.services && newErrors.services.length > 0;
    const hasLegalDocumentErrors = newErrors.legalDocuments && newErrors.legalDocuments.length > 0;

    return !hasBasicErrors && !hasServiceErrors && !hasLegalDocumentErrors;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();

    if (isValid) {
      const data = new FormData();

      data.append('company_id', CompanyId);

      // --- CRITICAL CHANGE: Append files directly to FormData ---
      if (formData.logoFile) {
        data.append('companyData[logo]', formData.logoFile);
      }
      if (formData.file) {
        data.append('companyData[file]', formData.file);
      }
      if (formData.ceoAvatarFile) {
        data.append('ceoData[avatar]', formData.ceoAvatarFile);
      }

      // --- Create jsonData WITHOUT the File objects ---
      // ... inside handleSubmit, before the final data.append('jsonData', JSON.stringify(jsonData));

      const jsonData = {
          companyData: {
              sector: formData.sector,
          },
          companyProfileData: {
              address: formData.address,
              phone: formData.phone,
              websiteUrl: formData.websiteUrl,
              Bio: formData.Bio,
              Datecreation: formData.Datecreation,
          },
          ceoData: {
              name: formData.ceoName,
              description: formData.ceoDescription,
          },
           services: formData.services.map(service => ({
               title: service.name,
               descriptions: service.descriptions.map(desc => {
                   console.log(`Service ${service.id} Description text: '${desc.text}' (type: ${typeof desc.text})`);
                   return desc.text;
               })
           })),
           legalDocuments: formData.legalDocuments.map(doc => ({
               title: doc.documentName,
               descriptions: doc.descriptions.map(desc => {
                   console.log(`Legal Doc ${doc.id} Description text: '${desc.text}' (type: ${typeof desc.text})`);
                   return desc.text;
               })
           })),
      };

      console.log("Full jsonData object being stringified:", jsonData); // <-- Add this for overall view
      data.append('jsonData', JSON.stringify(jsonData));

      // --- START DEBUGGING BLOCK FOR REACT (updated to reflect changes) ---
      console.log("--- FormData Content Before Sending ---");
      for (let pair of data.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File - ${pair[1].name} (${pair[1].type}, ${pair[1].size} bytes)`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      console.log("--- End FormData Content ---");
      // --- END DEBUGGING BLOCK FOR REACT ---


      try {
        const response = await api.post('api/company/store/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Crucial for FormData
            },
        });
        console.log("Submission successful:", response.data);
        alert("Form data successfully submitted!");
        // Optional: Redirect or show success message
      } catch (err) {
        console.error("Submission error:", err);
        if (err.response) {
          console.error("Error details:", err.response.data);
          if (err.response.data && err.response.data.errors) {
            const backendErrors = err.response.data.errors;
            const mappedErrors = {};

            // Backend validation errors for files will now be correctly mapped
            // if the backend is also updated to expect files directly.
            // Check Laravel's validation rules (`companyData.logo`, etc.)
            if (backendErrors['companyData.logo']) mappedErrors.logoFile = backendErrors['companyData.logo'][0];
            if (backendErrors['companyData.file']) mappedErrors.file = backendErrors['companyData.file'][0];
            if (backendErrors['ceoData.avatar']) mappedErrors.ceoAvatarFile = backendErrors['ceoData.avatar'][0];
            // ... (rest of your error mapping logic remains the same)

            if (backendErrors['companyData.sector']) mappedErrors.sector = backendErrors['companyData.sector'][0];
            if (backendErrors['companyProfileData.address']) mappedErrors.address = backendErrors['companyProfileData.address'][0];
            if (backendErrors['companyProfileData.phone']) mappedErrors.phone = backendErrors['companyProfileData.phone'][0];
            if (backendErrors['companyProfileData.websiteUrl']) mappedErrors.websiteUrl = backendErrors['companyProfileData.websiteUrl'][0];
            if (backendErrors['companyProfileData.Bio']) mappedErrors.Bio = backendErrors['companyProfileData.Bio'][0];
            if (backendErrors['companyProfileData.Datecreation']) mappedErrors.Datecreation = backendErrors['companyProfileData.Datecreation'][0];
            if (backendErrors['ceoData.name']) mappedErrors.ceoName = backendErrors['ceoData.name'][0];
            if (backendErrors['ceoData.description']) mappedErrors.ceoDescription = backendErrors['ceoData.description'][0];

             const serviceBackendErrors = Object.keys(backendErrors)
                .filter(key => key.startsWith('services.'))
                .reduce((acc, key) => {
                     const parts = key.split('.');
                     const index = parseInt(parts[1], 10);
                     const field = parts[2];
                     const errorMsg = backendErrors[key][0];

                     const item = formData.services[index];
                     if (!item) return acc;

                     let itemError = acc.find(e => e.id === item.id);
                     if (!itemError) {
                         itemError = { id: item.id };
                         acc.push(itemError);
                     }

                     if (field === 'name') {
                         itemError.name = errorMsg;
                     } else if (field === 'descriptions' && parts.length === 5 && parts[4] === 'text') {
                         const descIndex = parseInt(parts[3], 10);
                         const description = item.descriptions[descIndex];
                         if (description) {
                             let descError = itemError.descriptions?.find(e => e.id === description.id);
                             if (!descError) {
                                 if (!itemError.descriptions) itemError.descriptions = [];
                                 descError = { id: description.id };
                                 itemError.descriptions.push(descError);
                             }
                             descError.text = errorMsg;
                         }
                     }
                     return acc;
                }, []);
             if (serviceBackendErrors.length > 0) mappedErrors.services = serviceBackendErrors;

             const legalDocumentBackendErrors = Object.keys(backendErrors)
                .filter(key => key.startsWith('legalDocuments.'))
                .reduce((acc, key) => {
                     const parts = key.split('.');
                     const index = parseInt(parts[1], 10);
                     const field = parts[2];
                     const errorMsg = backendErrors[key][0];

                     const item = formData.legalDocuments[index];
                      if (!item) return acc;

                     let itemError = acc.find(e => e.id === item.id);
                     if (!itemError) {
                         itemError = { id: item.id };
                         acc.push(itemError);
                     }

                      if (field === 'documentName') {
                         itemError.documentName = errorMsg;
                     } else if (field === 'descriptions' && parts.length === 5 && parts[4] === 'text') {
                         const descIndex = parseInt(parts[3], 10);
                         const description = item.descriptions[descIndex];
                          if (description) {
                              let descError = itemError.descriptions?.find(e => e.id === description.id);
                              if (!descError) {
                                  if (!itemError.descriptions) itemError.descriptions = [];
                                  descError = { id: description.id };
                                  itemError.descriptions.push(descError);
                              }
                              descError.text = errorMsg;
                          }
                     }
                      return acc;
                }, []);
             if (legalDocumentBackendErrors.length > 0) mappedErrors.legalDocuments = legalDocumentBackendErrors;


            setErrors(prevErrors => ({ ...prevErrors, ...mappedErrors }));

            const backendTouched = {};
            Object.keys(mappedErrors).forEach(field => {
                if (['logoFile', 'file', 'ceoAvatarFile', 'sector', 'address', 'phone', 'websiteUrl', 'Bio', 'Datecreation', 'ceoName', 'ceoDescription'].includes(field)) {
                     backendTouched[field] = true;
                } else if (field === 'services' && Array.isArray(mappedErrors.services)) {
                    backendTouched.services = mappedErrors.services.map(itemErr => ({
                        id: itemErr.id,
                        name: !!itemErr.name,
                        descriptions: itemErr.descriptions?.map(descErr => ({ id: descErr.id, text: !!descErr.text })) || []
                    }));
                } else if (field === 'legalDocuments' && Array.isArray(mappedErrors.legalDocuments)) {
                     backendTouched.legalDocuments = mappedErrors.legalDocuments.map(itemErr => ({
                        id: itemErr.id,
                        documentName: !!itemErr.documentName,
                        descriptions: itemErr.descriptions?.map(descErr => ({ id: descErr.id, text: !!descErr.text })) || []
                    }));
                }
            });
             setTouched(prevTouched => ({ ...prevTouched, ...backendTouched }));

            alert("Please correct the errors indicated on the form.");
          } else {
            alert("An error occurred during submission.");
          }
        } else {
          alert("Network error or server is unreachable.");
        }
      }

    } else {
      console.log("Form has errors:", errors);
       const errorFieldsOrder = [
           'logoFile', 'sector', 'address', 'file',
           'phone', 'websiteUrl', 'Datecreation', 'Bio',
           'ceoAvatarFile', 'ceoName', 'ceoDescription',
           'services',
           'legalDocuments'
       ];

        const firstErrorField = errorFieldsOrder.find(field => {
            return (errors[field] && (touched[field] || ['logoFile', 'ceoAvatarFile', 'file'].includes(field))) ||
                   ((field === 'services' || field === 'legalDocuments') && errors[field]?.length > 0);
       });


      if (firstErrorField) {
        let element;
        if (firstErrorField === 'logoFile') element = logoInputRef.current?.closest('.rounded-full.flex.items-center.justify-center');
        else if (firstErrorField === 'ceoAvatarFile') element = ceoAvatarInputRef.current?.closest('.rounded-full.flex.items-center.justify-center');
        else if (firstErrorField === 'file') element = fileInputRef.current?.closest('.border.rounded-xl.p-4');
        else if (firstErrorField === 'sector') element = sectorDropdownRef.current;
        else if (firstErrorField === 'services') element = document.getElementById('services-section');
        else if (firstErrorField === 'legalDocuments') element = document.getElementById('legal-documents-section');
        else element = document.getElementById(firstErrorField);

        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      alert("Please correct the errors before submitting.");
    }
  };

  // --- ERROR MESSAGE COMPONENT ---
  const findNestedError = (errors, section, itemId = null, descriptionId = null, field) => {
    if (!errors || !errors[section] || !Array.isArray(errors[section])) return null;
    const itemError = errors[section].find(err => err.id === itemId);
    if (!itemError) return null;

    if (descriptionId === null) {
        return itemError[field];
    } else {
         if (!itemError.descriptions || !Array.isArray(itemError.descriptions)) return null;
         const descriptionError = itemError.descriptions.find(err => err.id === descriptionId);
         return descriptionError ? descriptionError[field] : null;
    }
  };

  const isNestedTouched = (touched, section, itemId = null, descriptionId = null, field) => {
      if (!touched || !touched[section] || !Array.isArray(touched[section])) return false;
      const itemTouched = touched[section].find(t => t.id === itemId);
      if (!itemTouched) return false;

       if (descriptionId === null) {
          return !!itemTouched[field];
       } else {
           if (!itemTouched.descriptions || !Array.isArray(itemTouched.descriptions)) return false;
           const descriptionTouched = itemTouched.descriptions.find(t => t.id === descriptionId);
           return !!descriptionTouched?.[field];
       }
  };


  const ErrorMessage = ({ field, itemId = null, descriptionId = null, section = null }) => {
    let errorMessage = null;
    let isTouched = false;

    if (itemId === null && section === null) { // For top-level fields like logoFile, file, ceoAvatarFile, address, sector etc.
        errorMessage = errors[field];
        isTouched = touched[field] || ['logoFile', 'ceoAvatarFile', 'file'].includes(field);
    } else { // For nested fields (services, legalDocuments)
        errorMessage = findNestedError(errors, section, itemId, descriptionId, field);
         isTouched = isNestedTouched(touched, section, itemId, descriptionId, field);
         // Additional check for array items if the whole array was touched on submit
         if (!isTouched && (touched[section] === true || (touched[section] && Array.isArray(touched[section]) && touched[section].some(t => t.id === itemId)))) {
              errorMessage = findNestedError(errors, section, itemId, descriptionId, field);
              isTouched = !!errorMessage; // If there's an error, it's effectively touched
         }
    }

    if (!errorMessage || !isTouched) return null;

    return (
      <div className="flex items-center mt-1 text-red-500 text-sm">
        <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
        <span className="break-words">{errorMessage}</span>
      </div>
    );
  };


  // --- RENDER METHOD ---

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-gray-200 bg-white shadow-lg p-6 sm:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2"> Create Company Profile</h1>
        </div>

        {/* Company Info Section */}
        <div className="flex flex-wrap items-center md:items-start mb-8 gap-8">

          {/* Basic Info Section */}
          <div className="flex-1 min-w-[300px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-6">
              <div>
                <label htmlFor="address" className="text-sm font-medium leading-none mb-2 block">Address <span className="text-red-500">*</span></label>
                <input
                  id="address"
                  type="text"
                  className={cn(
                    "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-gray-400",
                    errors.address && touched.address ? "border-red-500" : "border-gray-300"
                  )}
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
                />
                <ErrorMessage field="address" />
              </div>
              <div>
                <label className="text-sm font-medium leading-none mb-2 block">Business sector <span className="text-red-500">*</span></label>
                {/* Sector Dropdown */}
                <div className="relative" ref={sectorDropdownRef}>
                  <div
                    onClick={() => toggleDropdown('sector')}
                    className={cn(
                      "flex h-12 w-full items-center justify-between whitespace-nowrap rounded-xl border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer placeholder:text-gray-400",
                      errors.sector && touched.sector ? "border-red-500" : "border-gray-300"
                    )}
                    onBlur={() => {
                      setTimeout(() => {
                        if (dropdowns.sector && !sectorDropdownRef.current?.contains(document.activeElement)) {
                          setTouched(prev => ({ ...prev, sector: true }));
                          setDropdowns(prev => ({ ...prev, sector: false }));
                        }
                      }, 10);
                    }}
                  >
                    {formData.sectorLabel}
                    <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", dropdowns.sector && "rotate-180")} />
                  </div>
                  <ErrorMessage field="sector" />

                  {dropdowns.sector && (
                    <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-white shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-1">
                        {sectorOptions.map((option) => (
                          <div
                            key={option.value}
                            role="option"
                            aria-selected={formData.sector === option.value}
                            className={cn(
                              "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                              formData.sector === option.value ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100",
                            )}
                            onClick={() => {
                              handleSelectChange("sector", option.value, option.label);
                              toggleDropdown('sector');
                            }}
                          >
                            {option.label}
                            {formData.sector === option.value && (
                              <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Logo */}
          <div className="flex flex-col items-center justify-center w-full md:w-auto order-first md:order-none">
            <div className="w-32 h-32 md:w-36 md:h-36 bg-gray-200 rounded-full flex items-center justify-center mb-2 relative shadow-inner">
              {formData.logoPreview ? (
                <img
                  src={formData.logoPreview} // Use preview URL for display
                  alt="Company logo preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-16 h-16 md:w-20 md:h-20 text-gray-500" />
              )}
              <div
                className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 md:p-2 shadow cursor-pointer border border-gray-200 hover:bg-gray-50 transition"
                onClick={() => logoInputRef.current.click()}
              >
                <Camera className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                <input
                  type="file"
                  ref={logoInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'logo')}
                />
              </div>
            </div>
            <label className="text-sm font-medium text-center">Company Logo <span className="text-red-500">*</span></label>
            <ErrorMessage field="logoFile" />
          </div>
        </div>

        {/* Company Document Upload Section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Company Document</h2>
          <div className="w-full">
            <label htmlFor="file" className="text-sm font-medium leading-none mb-2 block">
              Upload Company Document <span className="text-red-500">*</span>
            </label>
            <div
              className={cn(
                "border rounded-xl p-4 bg-gray-50 shadow-sm",
                errors.file && touched.file ? "border-red-500" : "border-gray-300"
              )}
            >
              {formData.file ? (
                <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 text-blue-500 mr-3" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-md">{formData.fileName}</span>
                      <span className="text-xs text-gray-500">
                        {(formData.file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="ml-2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="cursor-pointer flex flex-col items-center justify-center py-6 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FileText className="w-10 h-10 text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload company document
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                id="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                onChange={(e) => handleFileChange(e, 'file')}
              />
              <ErrorMessage field="file" />
            </div>
          </div>
        </div>

        {/* Separator */}
        <hr className="my-8 border-gray-200" />

        {/* Contact Section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

            {/* Simple Phone Number Input */}
            <div className="w-full">
              <label htmlFor="phone" className="text-sm font-medium leading-none mb-2 block">
                Phone number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="text"
                placeholder="e.g., +1 555 123 4567"
                className={cn(
                  "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-gray-400",
                  errors.phone && touched.phone ? "border-red-500" : "border-gray-300"
                )}
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
              />
              <ErrorMessage field="phone" />
            </div>

            {/* Website URL */}
            <div className="w-full">
              <label htmlFor="websiteUrl" className="text-sm font-medium leading-none mb-2 block">
                Website URL <span className="text-red-500">*</span>
              </label>
              <div className={cn(
                "flex w-full rounded-xl border overflow-hidden shadow-sm",
                errors.websiteUrl && touched.websiteUrl ? "border-red-500" : "border-gray-300"
              )}>
                <div className="flex items-center px-3 py-2 bg-gray-50 border-r border-gray-300 text-gray-500 rounded-l-xl text-sm">
                  <span>http://</span>
                </div>
                <div className="flex flex-1 items-center bg-white rounded-r-xl">
                  <input
                    id="websiteUrl"
                    type="text"
                    className="flex-1 h-12 border-none outline-none px-3 py-2 text-base placeholder:text-gray-400"
                    placeholder="www.example.ma"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    onBlur={() => setTouched(prev => ({ ...prev, websiteUrl: true }))}
                  />
                  <div className="pr-3 flex items-center">
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
              <ErrorMessage field="websiteUrl" />
            </div>

            {/* Date of Creation */}
            <div className="w-full">
              <label htmlFor="Datecreation" className="text-sm font-medium leading-none mb-2 block">
                Date of creation <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full shadow-sm rounded-xl overflow-hidden">
                <input
                  type="date"
                  id="Datecreation"
                  className={cn(
                    "flex h-12 w-full bg-transparent px-3 py-2 text-base pr-10 appearance-none border rounded-xl custom-date",
                    errors.Datecreation && touched.Datecreation ? "border-red-500" : "border-gray-300"
                  )}
                  value={formData.Datecreation}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, Datecreation: true }))}
                  ref={dateInputRef}
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer pointer-events-auto"
                  onClick={() => dateInputRef.current?.showPicker()}
                >
                  <Clock className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              <ErrorMessage field="Datecreation" />
            </div>
          </div>
        </div>

        {/* Separator */}
        <hr className="my-8 border-gray-200" />

        {/* Company Bio Section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Company Bio</h2>
          <div className="w-full">
            <label htmlFor="Bio" className="text-sm font-medium leading-none mb-2 block">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              id="Bio"
              placeholder="Write your company's bio here..."
              className={cn(
                "flex min-h-[100px] w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-gray-400",
                errors.Bio && touched.Bio ? "border-red-500" : "border-gray-300"
              )}
              value={formData.Bio}
              onChange={handleInputChange}
              onBlur={() => setTouched(prev => ({ ...prev, Bio: true }))}
            />
            <ErrorMessage field="Bio" />
          </div>
        </div>

        {/* Separator */}
        <hr className="my-8 border-gray-200" />

        {/* CEO Section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">CEO Information</h2>
          <div className="flex flex-col md:flex-row gap-8 mb-6 items-center md:items-start">
            <div className="flex flex-col items-center justify-center w-32 h-32 md:w-36 md:h-36 flex-shrink-0">
              <div className="w-32 h-32 md:w-36 md:h-36 bg-gray-200 rounded-full flex items-center justify-center mb-2 relative shadow-inner">
                {formData.ceoAvatarPreview ? (
                  <img
                    src={formData.ceoAvatarPreview}
                    alt="CEO avatar preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-16 h-16 md:w-20 md:h-20 text-gray-500" />
                )}
                <div
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 md:p-2 shadow cursor-pointer border border-gray-200 hover:bg-gray-50 transition"
                  onClick={() => ceoAvatarInputRef.current.click()}
                >
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  <input
                    type="file"
                    ref={ceoAvatarInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'ceoAvatar')}
                  />
                </div>
              </div>
              <label className="text-sm font-medium text-center">CEO Photo <span className="text-red-500">*</span></label>
              <ErrorMessage field="ceoAvatarFile" />
            </div>
            <div className="flex-1 w-full">
              <div className="mb-6">
                <label htmlFor="ceoName" className="text-sm font-medium leading-none mb-2 block">
                  CEO Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="ceoName"
                  type="text"
                  className={cn(
                    "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-gray-400",
                    errors.ceoName && touched.ceoName ? "border-red-500" : "border-gray-300"
                  )}
                  value={formData.ceoName}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, ceoName: true }))}
                />
                <ErrorMessage field="ceoName" />
              </div>
              <div className="mb-0">
                <label htmlFor="ceoDescription" className="text-sm font-medium leading-none mb-2 block">
                  CEO Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="ceoDescription"
                  placeholder="Write about the CEO..."
                  className={cn(
                    "flex min-h-[100px] w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-gray-400",
                    errors.ceoDescription && touched.ceoDescription ? "border-red-500" : "border-gray-300"
                  )}
                  value={formData.ceoDescription}
                  onChange={handleInputChange}
                  onBlur={() => setTouched(prev => ({ ...prev, ceoDescription: true }))}
                />
                <ErrorMessage field="ceoDescription" />
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <hr className="my-8 border-gray-200" />


        {/* --- SERVICES SECTION --- */}
        <div className="mb-8" id="services-section"> {/* Added ID for scrolling */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Our Services</h2>

            {/* List of Services */}
            {formData.services.map((service, index) => (
                <div key={service.id} className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
                    {/* Service Name Input */}
                    <div className="flex items-start justify-between mb-4">
                         <div className="flex-1 mr-4">
                            <label htmlFor={`service-name-${service.id}`} className="text-sm font-medium leading-none mb-2 block">
                                Service Name {index + 1} <span className="text-red-500">*</span>
                            </label>
                            <input
                                id={`service-name-${service.id}`}
                                type="text"
                                className={cn(
                                    "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400",
                                     findNestedError(errors, 'services', service.id, null, 'name') && isNestedTouched(touched, 'services', service.id, null, 'name') ? "border-red-500" : "border-gray-300"
                                )}
                                value={service.name}
                                onChange={(e) => handleServiceChange(service.id, e.target.value)}
                                onBlur={() => setTouched(prev => {
                                     const newTouchedServices = [...(prev.services || [])];
                                     const serviceTouched = newTouchedServices.find(s => s.id === service.id) || { id: service.id };
                                     serviceTouched.name = true;
                                     if (!newTouchedServices.find(s => s.id === service.id)) newTouchedServices.push(serviceTouched);
                                     return { ...prev, services: newTouchedServices };
                                })}
                            />
                             <ErrorMessage section="services" itemId={service.id} field="name" />
                         </div>
                         {/* Remove Service Button */}
                         {formData.services.length > 0 && ( // Only show remove if there's at least one service
                              <button
                                  type="button"
                                  onClick={() => removeService(service.id)}
                                  className="mt-8 p-2 text-gray-500 hover:text-red-600 transition self-center"
                              >
                                  <Trash2 className="w-5 h-5" />
                                  <span className="sr-only">Remove Service</span>
                              </button>
                         )}
                    </div>

                    {/* Service Descriptions List */}
                    <div className="mb-4 pl-4 border-l border-gray-300"> {/* Indent descriptions */}
                         <h4 className="text-md font-medium mb-3">Descriptions <span className="text-red-500">*</span></h4> {/* Label for descriptions */}
                         {findNestedError(errors, 'services', service.id, null, 'noDescriptions') && (touched.services === true || (touched.services && touched.services.find(t => t.id === service.id))) && (
                             <div className="flex items-center mt-1 text-red-500 text-sm mb-3">
                                 <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                                 <span>{findNestedError(errors, 'services', service.id, null, 'noDescriptions')}</span>
                             </div>
                         )}

                        {service.descriptions.map((description, descIndex) => (
                            <div key={description.id} className="flex items-start mb-3 gap-2">
                                 <textarea
                                    id={`service-${service.id}-desc-${description.id}`}
                                    rows="2"
                                    placeholder={`Description ${descIndex + 1}...`}
                                    className={cn(
                                      "flex-1 rounded-md border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400",
                                      findNestedError(errors, 'services', service.id, description.id, 'text') && isNestedTouched(touched, 'services', service.id, description.id, 'text') ? "border-red-500" : "border-gray-300"
                                    )}
                                    value={description.text}
                                    onChange={(e) => handleServiceDescriptionChange(service.id, description.id, e.target.value)}
                                    onBlur={() => setTouched(prev => {
                                         const newTouchedServices = [...(prev.services || [])];
                                         const serviceTouched = newTouchedServices.find(s => s.id === service.id) || { id: service.id, descriptions: [] };
                                         const descriptionTouched = serviceTouched.descriptions.find(d => d.id === description.id) || { id: description.id };
                                         descriptionTouched.text = true;
                                         if (!serviceTouched.descriptions.find(d => d.id === description.id)) serviceTouched.descriptions.push(descriptionTouched);
                                         if (!newTouchedServices.find(s => s.id === service.id)) newTouchedServices.push(serviceTouched);
                                         return { ...prev, services: newTouchedServices };
                                    })}
                                 />
                                 {/* Remove Description Button */}
                                 <button
                                      type="button"
                                      onClick={() => removeServiceDescription(service.id, description.id)}
                                      className="mt-1 p-1.5 text-gray-500 hover:text-red-600 transition flex-shrink-0"
                                  >
                                      <X className="w-4 h-4" />
                                       <span className="sr-only">Remove Description</span>
                                  </button>
                            </div>
                        ))}
                         {/* Add Description Button */}
                        <button
                            type="button"
                            onClick={() => addServiceDescription(service.id)}
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Description
                        </button>
                    </div>
                </div>
            ))}

             <button
                type="button"
                onClick={addService}
                className="inline-flex items-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-600 hover:border-blue-500 hover:text-blue-600 transition w-full justify-center"
             >
                 <Plus className="w-5 h-5 mr-2" /> Add Service
             </button>
        </div>


        {/* Separator */}
        <hr className="my-8 border-gray-200" />

        {/* --- LEGAL DOCUMENTS SECTION --- */}
         <div className="mb-8" id="legal-documents-section">
             <h2 className="text-xl sm:text-2xl font-semibold mb-6">Legal Documents</h2>

             {formData.legalDocuments.map((doc, index) => (
                 <div key={doc.id} className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
                     {/* Document Name Input */}
                     <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 mr-4">
                             <label htmlFor={`doc-name-${doc.id}`} className="text-sm font-medium leading-none mb-2 block">
                                 Document Name {index + 1} <span className="text-red-500">*</span>
                             </label>
                             <input
                                 id={`doc-name-${doc.id}`}
                                 type="text"
                                 className={cn(
                                     "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400",
                                      findNestedError(errors, 'legalDocuments', doc.id, null, 'documentName') && isNestedTouched(touched, 'legalDocuments', doc.id, null, 'documentName') ? "border-red-500" : "border-gray-300"
                                 )}
                                 value={doc.documentName}
                                 onChange={(e) => handleLegalDocumentChange(doc.id, e.target.value)}
                                 onBlur={() => setTouched(prev => {
                                     const newTouchedDocs = [...(prev.legalDocuments || [])];
                                     const docTouched = newTouchedDocs.find(d => d.id === doc.id) || { id: doc.id };
                                     docTouched.documentName = true;
                                     if (!newTouchedDocs.find(d => d.id === doc.id)) newTouchedDocs.push(docTouched);
                                     return { ...prev, legalDocuments: newTouchedDocs };
                                 })}
                             />
                             <ErrorMessage section="legalDocuments" itemId={doc.id} field="documentName" />
                          </div>
                          {/* Remove Document Button */}
                          {formData.legalDocuments.length > 0 && (
                               <button
                                   type="button"
                                   onClick={() => removeLegalDocument(doc.id)}
                                   className="mt-8 p-2 text-gray-500 hover:text-red-600 transition self-center"
                               >
                                   <Trash2 className="w-5 h-5" />
                                   <span className="sr-only">Remove Legal Document</span>
                               </button>
                          )}
                     </div>

                     {/* Legal Document Descriptions List */}
                     <div className="mb-4 pl-4 border-l border-gray-300">
                          <h4 className="text-md font-medium mb-3">Descriptions <span className="text-red-500">*</span></h4>
                           {findNestedError(errors, 'legalDocuments', doc.id, null, 'noDescriptions') && (touched.legalDocuments === true || (touched.legalDocuments && touched.legalDocuments.find(t => t.id === doc.id))) && (
                              <div className="flex items-center mt-1 text-red-500 text-sm mb-3">
                                  <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span>{findNestedError(errors, 'legalDocuments', doc.id, null, 'noDescriptions')}</span>
                              </div>
                          )}

                         {doc.descriptions.map((description, descIndex) => (
                             <div key={description.id} className="flex items-start mb-3 gap-2">
                                  <textarea
                                     id={`doc-${doc.id}-desc-${description.id}`}
                                     rows="2"
                                     placeholder={`Description ${descIndex + 1}...`}
                                     className={cn(
                                       "flex-1 rounded-md border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400",
                                        findNestedError(errors, 'legalDocuments', doc.id, description.id, 'text') && isNestedTouched(touched, 'legalDocuments', doc.id, description.id, 'text') ? "border-red-500" : "border-gray-300"
                                     )}
                                     value={description.text}
                                     onChange={(e) => handleLegalDocumentDescriptionChange(doc.id, description.id, e.target.value)}
                                      onBlur={() => setTouched(prev => {
                                         const newTouchedDocs = [...(prev.legalDocuments || [])];
                                         const docTouched = newTouchedDocs.find(d => d.id === doc.id) || { id: doc.id, descriptions: [] };
                                         const descriptionTouched = docTouched.descriptions.find(d => d.id === description.id) || { id: description.id };
                                         descriptionTouched.text = true;
                                         if (!docTouched.descriptions.find(d => d.id === description.id)) docTouched.descriptions.push(descriptionTouched);
                                         if (!newTouchedDocs.find(d => d.id === doc.id)) newTouchedDocs.push(docTouched);
                                         return { ...prev, legalDocuments: newTouchedDocs };
                                    })}
                                  />
                                  <button
                                       type="button"
                                       onClick={() => removeLegalDocumentDescription(doc.id, description.id)}
                                       className="mt-1 p-1.5 text-gray-500 hover:text-red-600 transition flex-shrink-0"
                                   >
                                       <X className="w-4 h-4" />
                                        <span className="sr-only">Remove Description</span>
                                   </button>
                             </div>
                         ))}
                         <button
                             type="button"
                             onClick={() => addLegalDocumentDescription(doc.id)}
                             className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                         >
                             <Plus className="w-4 h-4 mr-1" /> Add Description
                         </button>
                     </div>
                 </div>
             ))}

              <button
                 type="button"
                 onClick={addLegalDocument}
                 className="inline-flex items-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-600 hover:border-blue-500 hover:text-blue-600 transition w-full justify-center"
              >
                  <Plus className="w-5 h-5 mr-2" /> Add Legal Document
              </button>
         </div>

        <hr className="my-8 border-gray-200" />


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); window.history.back() }}
            className="inline-flex items-center justify-center rounded-xl border border-blue-500 bg-white shadow-sm hover:bg-gray-50 text-blue-500 font-semibold text-lg w-full sm:w-40 h-12 px-4 py-2 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 font-semibold text-lg w-full sm:w-40 h-12 px-4 py-2 transition"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}