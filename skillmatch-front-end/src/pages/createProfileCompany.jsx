import { useState, useRef, useEffect } from "react";
import { HelpCircle, Clock, Check, ChevronDown, Camera, User, AlertCircle } from "lucide-react";
import '../styles/pages/CreateProfileCompany.css'
// Utility function for className merging
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export default function ValidatedCompanyProfile() {
  // File input reference
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    // Basic info
    name: "",
    address: "",
    avatar: null,
    businessSector: "",
    businessSectorLabel: "Select sector",

    // Contact information
    phoneCountry: "MA",
    phoneCountryLabel: "MA",
    phoneNumber: "",
    websiteUrl: "",
    dateOfCreation: "",
    turnover: "",

    // Company details
    description: "",
    employees: "",
    companyStatus: "",
    sector: "",
    capital: "",

    // Company vision
    fieldOfActivity: "web-development",
    fieldOfActivityLabel: "Web development",
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) return "Company name is required";
    if (value.length < 2) return "Company name must be at least 2 characters";
    return "";
  };

  const validateAddress = (value) => {
    if (!value.trim()) return "Address is required";
    return "";
  };

  const validateBusinessSector = (value) => {
    if (!value) return "Please select a business sector";
    return "";
  };

  const validatePhoneNumber = (value) => {
    if (!value.trim()) return "Phone number is required";
    // Basic phone number validation - can be enhanced for specific formats
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(value)) return "Please enter a valid phone number";
    return "";
  };

  const validateWebsiteUrl = (value) => {
    if (!value.trim()) return "Website URL is required";
    // Simple URL validation
    const urlRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!urlRegex.test(value)) return "Please enter a valid website URL";
    return "";
  };

  const validateDateOfCreation = (value) => {
    if (!value) return "Date of creation is required";
    const selectedDate = new Date(value);
    const currentDate = new Date();
    if (selectedDate > currentDate) return "Date cannot be in the future";
    return "";
  };

  const validateTurnover = (value) => {
    if (!value.trim()) return "Turnover is required";
    // Must be a valid number
    if (isNaN(value) || parseFloat(value) < 0) return "Please enter a valid turnover amount";
    return "";
  };

  const validateDescription = (value) => {
    if (!value.trim()) return "Description is required";
    if (value.length < 10) return "Description should be at least 10 characters";
    return "";
  };

  const validateEmployees = (value) => {
    if (!value.trim()) return "Number of employees is required";
    if (!/^[0-9]+$/.test(value)) return "Must be a number";
    if (parseInt(value) <= 0) return "Must be greater than 0";
    return "";
  };

  const validateCompanyStatus = (value) => {
    if (!value.trim()) return "Company status is required";
    return "";
  };

  const validateSector = (value) => {
    if (!value.trim()) return "Sector is required";
    return "";
  };

  const validateCapital = (value) => {
    if (!value.trim()) return "Capital is required";
    if (!/^[0-9]+$/.test(value)) return "Capital must be a number";
    if (parseInt(value) <= 0) return "Capital must be greater than 0";
    return "";
  };

  const validateFieldOfActivity = (value) => {
    if (!value) return "Field of activity is required";
    return "";
  };

  // Update validation on input change
  useEffect(() => {
    const newErrors = {};
    
    // Only validate fields that have been touched
    if (touched.name) newErrors.name = validateName(formData.name);
    if (touched.address) newErrors.address = validateAddress(formData.address);
    if (touched.businessSector) newErrors.businessSector = validateBusinessSector(formData.businessSector);
    if (touched.phoneNumber) newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);
    if (touched.websiteUrl) newErrors.websiteUrl = validateWebsiteUrl(formData.websiteUrl);
    if (touched.dateOfCreation) newErrors.dateOfCreation = validateDateOfCreation(formData.dateOfCreation);
    if (touched.turnover) newErrors.turnover = validateTurnover(formData.turnover);
    if (touched.description) newErrors.description = validateDescription(formData.description);
    if (touched.employees) newErrors.employees = validateEmployees(formData.employees);
    if (touched.companyStatus) newErrors.companyStatus = validateCompanyStatus(formData.companyStatus);
    if (touched.sector) newErrors.sector = validateSector(formData.sector);
    if (touched.capital) newErrors.capital = validateCapital(formData.capital);
    if (touched.fieldOfActivity) newErrors.fieldOfActivity = validateFieldOfActivity(formData.fieldOfActivity);
    
    setErrors(newErrors);
  }, [formData, touched]);

  // Generic handler for all input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Handle select changes
  const handleSelectChange = (field, value, label = value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
      [`${field}Label`]: label
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Toggle dropdown state
  const [dropdowns, setDropdowns] = useState({
    businessSector: false,
    phoneCountry: false,
    fieldOfActivity: false
  });

  const toggleDropdown = (dropdown) => {
    setDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  // Handle avatar upload
  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prevState => ({
          ...prevState,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  // Validate all fields on form submission
  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      address: validateAddress(formData.address),
      businessSector: validateBusinessSector(formData.businessSector),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      websiteUrl: validateWebsiteUrl(formData.websiteUrl),
      dateOfCreation: validateDateOfCreation(formData.dateOfCreation),
      turnover: validateTurnover(formData.turnover),
      description: validateDescription(formData.description),
      employees: validateEmployees(formData.employees),
      companyStatus: validateCompanyStatus(formData.companyStatus),
      sector: validateSector(formData.sector),
      capital: validateCapital(formData.capital),
      fieldOfActivity: validateFieldOfActivity(formData.fieldOfActivity),
    };
    
    // Mark all fields as touched
    const newTouched = {};
    Object.keys(newErrors).forEach(key => {
      newTouched[key] = true;
    });
    
    setErrors(newErrors);
    setTouched(newTouched);
    
    // Check if there are any errors
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    
    if (isValid) {
      console.log("Submitting form data:", formData);
      alert("Form data successfully submitted!");
    } else {
      console.log("Form has errors:", errors);
      alert("Please correct the errors before submitting.");
    }
  };

  // Pre-defined options for dropdowns
  const countryOptions = [
    { value: "MA", label: "MA" },
    { value: "US", label: "US" },
    { value: "UK", label: "UK" },
    { value: "FR", label: "FR" },
  ];

  const businessSectorOptions = [
    { value: "tech", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
  ];

  const fieldOptions = [
    { value: "web-development", label: "Web development" },
    { value: "mobile-development", label: "Mobile development" },
    { value: "ui-ux-design", label: "UI/UX Design" },
    { value: "data-science", label: "Data Science" },
    { value: "devops", label: "DevOps" },
  ];

  // Display error for a specific field
  const ErrorMessage = ({ field }) => {
    if (!errors[field] || !touched[field]) return null;
    
    return (
      <div className="flex items-center mt-1 text-red-500 text-sm">
        <AlertCircle className="w-3 h-3 mr-1" />
        <span>{errors[field]}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="rounded-3xl border-white bg-white shadow-lg">
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-4xl font-semibold tracking-tight mb-2">&gt; Create profile</h1>
          </div>

          {/* Profile Section */}
          <div className="flex justify-between items-start mb-10">
            <div className="w-2/3">
              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label htmlFor="name" className="text-sm font-medium leading-none mb-2 block">Name</label>
                  <input
                    id="name"
                    type="text"
                    className={cn(
                      "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm",
                      errors.name && touched.name ? "border-red-500" : "border-input"
                    )}
                    value={formData.name || ""}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage field="name" />
                </div>
                <div>
                  <label htmlFor="address" className="text-sm font-medium leading-none mb-2 block">Address</label>
                  <input
                    id="address"
                    type="text"
                    className={cn(
                      "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm",
                      errors.address && touched.address ? "border-red-500" : "border-input"
                    )}
                    value={formData.address || ""}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage field="address" />
                </div>
              </div>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 bg-gray-200 rounded-full flex items-center justify-center mb-2 relative">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="User avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-20 h-20 text-gray-500" />
                )}
                <div
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Camera className="w-6 h-6 text-gray-700" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <label className="text-sm font-medium leading-none mb-2 block">Files</label>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-white shadow-sm hover:bg-accent mt-2 h-12 px-4 py-2 border-blue-500 text-blue-500"
              >
                + Add File
              </button>
            </div>
            <div>
              <label className="text-sm font-medium leading-none mb-2 block">Business sector</label>
              <div className="relative">
                <div
                  onClick={() => toggleDropdown('businessSector')}
                  className={cn(
                    "flex h-12 w-full items-center justify-between whitespace-nowrap rounded-xl border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer",
                    errors.businessSector && touched.businessSector ? "border-red-500" : "border-input"
                  )}
                >
                  {formData.businessSectorLabel}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
                <ErrorMessage field="businessSector" />

                {dropdowns.businessSector && (
                  <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-white shadow-md">
                    <div className="p-1">
                      {businessSectorOptions.map((option) => (
                        <div
                          key={option.value}
                          className={cn(
                            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                            formData.businessSector === option.value ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
                          )}
                          onClick={() => {
                            handleSelectChange("businessSector", option.value, option.label);
                            toggleDropdown('businessSector');
                          }}
                        >
                          {option.label}
                          {formData.businessSector === option.value && (
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

          {/* Contact Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Phone Number */}
            <div className="w-full mb-6">
              <label htmlFor="phoneNumber" className="text-sm font-medium leading-none mb-2 block">
                Phone number
              </label>
              <div className={cn(
                "flex h-12 w-full bg-white rounded-xl overflow-hidden border",
                errors.phoneNumber && touched.phoneNumber ? "border-red-500" : "border-gray-300"
              )}>
                <div className="relative w-20">
                  <div
                    onClick={() => toggleDropdown('phoneCountry')}
                    className="flex h-12 w-full items-center justify-between whitespace-nowrap border-r border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer"
                  >
                    {formData.phoneCountryLabel}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </div>

                  {dropdowns.phoneCountry && (
                    <div className="absolute z-50 mt-1 w-24 overflow-hidden rounded-md border bg-white shadow-md">
                      <div className="p-1">
                        {countryOptions.map((option) => (
                          <div
                            key={option.value}
                            className={cn(
                              "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                              formData.phoneCountry === option.value ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
                            )}
                            onClick={() => {
                              handleSelectChange("phoneCountry", option.value, option.label);
                              toggleDropdown('phoneCountry');
                            }}
                          >
                            {option.label}
                            {formData.phoneCountry === option.value && (
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
                <input
                  id="phoneNumber"
                  placeholder="+212 (654) 000-00"
                  className="flex-1 h-full border-0 px-3 outline-none"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                />
              </div>
              <ErrorMessage field="phoneNumber" />
            </div>

            {/* Website URL */}
            <div className="w-full mb-6">
              <label htmlFor="websiteUrl" className="text-sm font-medium leading-none mb-2 block">
                Url Website
              </label>
              <div className={cn(
                "flex w-full rounded-xl border overflow-hidden",
                errors.websiteUrl && touched.websiteUrl ? "border-red-500" : "border-gray-300"
              )}>
                {/* Prefix section */}
                <div className="flex items-center px-3 py-2 bg-white rounded-l-xl border-r border-gray-300">
                  <span className="text-gray-500">http://</span>
                </div>

                {/* Main input with help icon */}
                <div className="flex flex-1 items-center bg-white rounded-r-xl">
                  <input
                    id="websiteUrl"
                    className="flex-1 h-12 border-none outline-none px-3"
                    placeholder="www.example.ma"
                    value={formData.websiteUrl || ""}
                    onChange={handleInputChange}
                  />
                  <div className="pr-3">
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
              <ErrorMessage field="websiteUrl" />
            </div>

            {/* Date of Creation */}
            <div className="w-full mb-6">
              <label htmlFor="dateOfCreation" className="text-sm font-medium leading-none mb-2 block">
                Date of creation
              </label>
              <div className="relative w-full">
                <input
                  type="date"
                  id="dateOfCreation"
                  className={cn(
                    "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm pr-10 custom-date",
                    errors.dateOfCreation && touched.dateOfCreation ? "border-red-500" : "border-input"
                  )}
                  value={formData.dateOfCreation}
                  onChange={handleInputChange}
                  ref={dateInputRef}
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => dateInputRef.current.showPicker()}
                >
                  <Clock className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              <ErrorMessage field="dateOfCreation" />
            </div>

            {/* Turnover */}
            <div className="mb-6">
              <label htmlFor="turnover" className="text-sm font-medium leading-none mb-2 block">Turnover</label>
              <input
                id="turnover"
                type="text"
                className={cn(
                  "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm",
                  errors.turnover && touched.turnover ? "border-red-500" : "border-input"
                )}
                value={formData.turnover || ""}
                onChange={handleInputChange}
              />
              <ErrorMessage field="turnover" />
            </div>
          </div>

          {/* Company Details Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">Company Details</h2>

            <div className="w-full mb-6">
              <div className="flex flex-col gap-6">
                {/* Description field */}
                <div className="w-full">
                  <label htmlFor="description" className="text-sm font-medium leading-none mb-2 block">
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Write your description here..."
                    className={cn(
                      "flex min-h-[100px] w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm",
                      errors.description && touched.description ? "border-red-500" : "border-input"
                    )}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage field="description" />
                </div>

                {/* Two column layout for employees and company status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="employees" className="text-sm font-medium leading-none mb-2 block">
                      Number of employees
                    </label>
                    <input
                      id="employees"
                      type="text"
                      className={cn(
                        "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm",
                        errors.employees && touched.employees ? "border-red-500" : "border-input"
                      )}
                      value={formData.employees}
                      onChange={handleInputChange}
                    />
                    <ErrorMessage field="employees" />
                  </div>

                  <div>
                    <label htmlFor="companyStatus" className="text-sm font-medium leading-none mb-2 block">
                      Company status
                    </label>
                    <input
                      id="companyStatus"
                      type="text"
                      className={cn(
                        "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm",
                        errors.companyStatus && touched.companyStatus ? "border-red-500" : "border-input"
                      )}
                      value={formData.companyStatus}
                      onChange={handleInputChange}
                    />
                    <ErrorMessage field="companyStatus" />
                  </div>
                </div>

                {/* Sector field */}
                <div className="w-full">
                  <label htmlFor="sector" className="text-sm font-medium leading-none mb-2 block">
                    Sector
                  </label>
                  <input
                    id="sector"
                    type="text"
                    className={cn(
                      "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm",
                      errors.sector && touched.sector ? "border-red-500" : "border-input"
                    )}
                    value={formData.sector}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage field="sector" />
                </div>

                {/* Capital field with icon */}
                <div className="w-full">
                  <label htmlFor="capital" className="text-sm font-medium leading-none mb-2 block">
                    Capital
                  </label>
                  <div className="relative">
                    <input
                      id="capital"
                      type="text"
                      placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      className={cn(
                        "flex h-12 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-sm pr-10",
                        errors.capital && touched.capital ? "border-red-500" : "border-input"
                      )}
                      value={formData.capital}
                      onChange={handleInputChange}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <img
                        className="w-5 h-5 object-cover"
                        alt="Pieces de monnaie"
                        src="/api/placeholder/100/100"
                      />
                    </div>
                  </div>
                  <ErrorMessage field="capital" />
                </div>
              </div>
            </div>
          </div>

          {/* Company Vision Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">Company Vision</h2>

            <div className="w-full mb-6">
              <label htmlFor="field-of-activity" className="text-sm font-medium leading-none mb-2 block font-semibold">
                Field of activity
              </label>
              <div className="relative w-full">
                <div
                  onClick={() => toggleDropdown('fieldOfActivity')}
                  className={cn(
                    "flex h-12 w-full items-center justify-between whitespace-nowrap rounded-xl border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer",
                    errors.fieldOfActivity && touched.fieldOfActivity ? "border-red-500" : "border-input"
                  )}
                >
                  {formData.fieldOfActivityLabel}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
                <ErrorMessage field="fieldOfActivity" />

                {dropdowns.fieldOfActivity && (
                  <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-white shadow-md">
                    <div className="p-1">
                      {fieldOptions.map((option) => (
                        <div
                          key={option.value}
                          className={cn(
                            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
                            formData.fieldOfActivity === option.value ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
                          )}
                          onClick={() => {
                            handleSelectChange("fieldOfActivity", option.value, option.label);
                            toggleDropdown('fieldOfActivity');
                          }}
                        >
                          {option.label}
                          {formData.fieldOfActivity === option.value && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="font-normal text-neutral-500 text-sm">XXXXXXXXXXX</div>
              <div className="font-normal text-neutral-500 text-sm">PLC | LTD</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-10">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-white shadow-sm hover:bg-accent w-40 h-12 px-4 py-2 border-blue-500 text-blue-500 font-semibold text-lg"
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-white shadow hover:bg-primary/90 w-40 h-12 px-4 py-2 bg-blue-600 rounded-xl font-semibold text-lg"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}