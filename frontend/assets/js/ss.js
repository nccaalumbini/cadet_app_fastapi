// document.addEventListener('DOMContentLoaded', function () {
//     // DOM Elements
//     const openFormBtn = document.getElementById('openSchoolFormBtn');
//     const cancelFormBtn = document.getElementById('cancelSchoolFormBtn');
//     const schoolFormModal = document.getElementById('schoolFormModal');
//     const schoolForm = document.getElementById('schoolForm');

//     // Check if elements exist before adding event listeners
//     if (openFormBtn) {
//         openFormBtn.addEventListener('click', function () {
//             if (schoolFormModal) {
//                 schoolFormModal.classList.remove('hidden');
//                 document.body.style.overflow = 'hidden';
//             }
//         });
//     }

//     if (cancelFormBtn && schoolFormModal) {
//         cancelFormBtn.addEventListener('click', function () {
//             schoolFormModal.classList.add('hidden');
//             document.body.style.overflow = 'auto';
//             resetForm();
//         });
//     }

//     if (schoolFormModal) {
//         schoolFormModal.addEventListener('click', function (e) {
//             if (e.target === schoolFormModal) {
//                 schoolFormModal.classList.add('hidden');
//                 document.body.style.overflow = 'auto';
//                 resetForm();
//             }
//         });
//     }

//     if (schoolForm) {
//         schoolForm.addEventListener('submit', function (e) {
//             e.preventDefault();

//             if (validateForm()) {
//                 // Form is valid, process the data
//                 const formData = new FormData(schoolForm);
//                 const formObject = Object.fromEntries(formData.entries());

//                 // Here you would typically send the data to your backend
//                 console.log('Form data:', formObject);

//                 // Show success message (in a real application)
//                 alert('School added successfully!');

//                 // Reset form and close modal
//                 resetForm();
//                 if (schoolFormModal) {
//                     schoolFormModal.classList.add('hidden');
//                     document.body.style.overflow = 'auto';
//                 }
//             }
//         });
//     }

//     // Form validation function
//     function validateForm() {
//         let isValid = true;

//         // Required fields validation
//         const requiredFields = [
//             'schoolName', 'district', 'municipality', 'wardNumber',
//             'phoneNumber', 'principalName', 'principalContact'
//         ];

//         requiredFields.forEach(field => {
//             const element = document.getElementById(field);
//             const errorElement = document.getElementById(field + 'Error');

//             if (element && errorElement) {
//                 if (!element.value.trim()) {
//                     errorElement.style.display = 'block';
//                     element.classList.add('border-red-500');
//                     isValid = false;
//                 } else {
//                     errorElement.style.display = 'none';
//                     element.classList.remove('border-red-500');
//                 }
//             }
//         });

//         // Validate training sessions
//         const nccBatchInputs = document.querySelectorAll('input[name="nccBatch[]"]');
//         const startDateInputs = document.querySelectorAll('input[name="startDate[]"]');

//         if (nccBatchInputs.length > 0) {
//             nccBatchInputs.forEach((input, index) => {
//                 if (input && !input.value.trim()) {
//                     isValid = false;
//                     input.classList.add('border-red-500');
//                 }
//             });

//             startDateInputs.forEach(input => {
//                 if (input && !input.value) {
//                     isValid = false;
//                     input.classList.add('border-red-500');
//                 }
//             });
//         }

//         // Division radio buttons validation
//         const divisionRadios = document.querySelectorAll('input[type="radio"][name^="division-"]');
//         const divisionError = document.getElementById('divisionError');
//         let divisionSelected = false;

//         if (divisionRadios.length > 0 && divisionError) {
//             divisionRadios.forEach(radio => {
//                 if (radio.checked) {
//                     divisionSelected = true;
//                 }
//             });

//             if (!divisionSelected) {
//                 divisionError.style.display = 'block';
//                 isValid = false;
//             } else {
//                 divisionError.style.display = 'none';
//             }
//         }

//         // Email validation
//         const email = document.getElementById('officialEmail');
//         const emailError = document.getElementById('officialEmailError');

//         if (email && emailError) {
//             if (email.value && !isValidEmail(email.value)) {
//                 emailError.style.display = 'block';
//                 email.classList.add('border-red-500');
//                 isValid = false;
//             } else {
//                 emailError.style.display = 'none';
//                 email.classList.remove('border-red-500');
//             }
//         }

//         // Website validation
//         const website = document.getElementById('website');
//         const websiteError = document.getElementById('websiteError');

//         if (website && websiteError) {
//             if (website.value && !isValidUrl(website.value)) {
//                 websiteError.style.display = 'block';
//                 website.classList.add('border-red-500');
//                 isValid = false;
//             } else {
//                 websiteError.style.display = 'none';
//                 website.classList.remove('border-red-500');
//             }
//         }

//         return isValid;
//     }

//     // Email validation helper
//     function isValidEmail(email) {
//         const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return re.test(email);
//     }

//     // URL validation helper
//     function isValidUrl(url) {
//         try {
//             new URL(url);
//             return true;
//         } catch (_) {
//             return false;
//         }
//     }

//     // Reset form function
//     function resetForm() {
//         if (schoolForm) {
//             schoolForm.reset();
//         }

//         // Clear error messages and styles
//         const errorMessages = document.querySelectorAll('.error-message');
//         errorMessages.forEach(error => {
//             error.style.display = 'none';
//         });

//         const formInputs = document.querySelectorAll('.form-input');
//         formInputs.forEach(input => {
//             input.classList.remove('border-red-500');
//         });
//     }

//     // Real-time validation for specific fields
//     const emailField = document.getElementById('officialEmail');
//     if (emailField) {
//         emailField.addEventListener('blur', function () {
//             const emailError = document.getElementById('officialEmailError');
//             if (emailError) {
//                 if (this.value && !isValidEmail(this.value)) {
//                     emailError.style.display = 'block';
//                     this.classList.add('border-red-500');
//                 } else {
//                     emailError.style.display = 'none';
//                     this.classList.remove('border-red-500');
//                 }
//             }
//         });
//     }

//     const websiteField = document.getElementById('website');
//     if (websiteField) {
//         websiteField.addEventListener('blur', function () {
//             const websiteError = document.getElementById('websiteError');
//             if (websiteError) {
//                 if (this.value && !isValidUrl(this.value)) {
//                     websiteError.style.display = 'block';
//                     this.classList.add('border-red-500');
//                 } else {
//                     websiteError.style.display = 'none';
//                     this.classList.remove('border-red-500');
//                 }
//             }
//         });
//     }

//     // Multiple training sessions functionality
//     const container = document.getElementById("trainingSessionsContainer");
//     const addBtn = document.getElementById("addSessionBtn");

//     if (addBtn && container) {
//         // Add new session
//         addBtn.addEventListener("click", () => {
//             const sessionCount = container.querySelectorAll('.session-row').length;
//             const newRow = document.createElement("div");
//             newRow.className = "session-row grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg";

//             newRow.innerHTML = `
//                         <div>
//                             <label class="form-label block text-sm font-medium text-gray-700 mb-1 required">NCC Batch</label>
//                             <input type="text" name="nccBatch[]" class="form-input w-full" placeholder="Enter NCC batch" required>
//                         </div>
//                         <div>
//                             <label class="form-label block text-sm font-medium text-gray-700 mb-1 required">Start Date</label>
//                             <input type="date" name="startDate[]" class="form-input w-full" required>
//                         </div>
//                         <div>
//                             <label class="form-label block text-sm font-medium text-gray-700 mb-1">Passout Date</label>
//                             <input type="date" name="passoutDate[]" class="form-input w-full">
//                         </div>
//                         <div>
//                             <label class="form-label block text-sm font-medium text-gray-700 mb-1 required">Division</label>
//                             <div class="flex space-x-4">
//                                 <label class="flex items-center">
//                                     <input type="radio" name="division-${sessionCount}" value="junior" class="mr-2" required>
//                                     <span>Junior</span>
//                                 </label>
//                                 <label class="flex items-center">
//                                     <input type="radio" name="division-${sessionCount}" value="senior" class="mr-2">
//                                     <span>Senior</span>
//                                 </label>
//                             </div>
//                         </div>
//                         <div class="flex items-end">
//                             <button type="button" class="removeSessionBtn bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
//                                 Remove
//                             </button>
//                         </div>
//                     `;

//             // Clear values in cloned row
//             newRow.querySelectorAll("input").forEach(input => {
//                 input.value = "";
//                 if (input.type === "radio") input.checked = false;
//             });

//             // Attach remove handler
//             const removeBtn = newRow.querySelector(".removeSessionBtn");
//             if (removeBtn) {
//                 removeBtn.addEventListener("click", () => newRow.remove());
//             }

//             container.appendChild(newRow);
//         });

//         // Remove initial row if clicked
//         container.querySelectorAll(".removeSessionBtn").forEach(btn => {
//             btn.addEventListener("click", function () {
//                 const row = this.closest(".session-row");
//                 if (row) {
//                     row.remove();
//                 }
//             });
//         });
//     }
// });


// API Base URL - Update this to match your backend URL
const API_BASE_URL = 'http://localhost:8000'; // <- NO trailing slash

function buildUrl(endpoint) {
    // Ensure exactly one slash between base and endpoint
    if (!endpoint) return API_BASE_URL;
    return `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
}

async function apiRequest(endpoint, options = {}) {
    const url = buildUrl(endpoint);
    const token = localStorage.getItem('access_token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        }
    };

    try {
        // debug
        console.log('API request:', url, config);
        const response = await fetch(url, config);

        if (!response.ok) {
            let errMsg = `HTTP error! status: ${response.status}`;
            try {
                const errData = await response.json();
                if (errData.detail) errMsg = errData.detail;
            } catch (e) { }
            throw new Error(errMsg);
        }
        // if 204 No Content
        if (response.status === 204) return null;
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showNotification(error.message || 'Error connecting to server. Please try again.', 'error');
        throw error;
    }
}
// Global variables
let currentPage = 1;
let schoolsPerPage = 10;
let totalSchools = 0;
let currentSchoolId = null;
let isEditMode = false;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();

    // Attach form submit handler here to ensure it is always set
    const schoolForm = document.getElementById('schoolForm');
    if (schoolForm) {
        schoolForm.addEventListener('submit', handleFormSubmit);
    }
});

// Initialize the application
function initializeApp() {
    loadSchools();
    loadStats();
}

// Set up all event listeners
function setupEventListeners() {
    // Open school form
    const openFormBtn = document.getElementById('openSchoolFormBtn');
    if (openFormBtn) {
        openFormBtn.addEventListener('click', () => openSchoolForm());
    }

    // Cancel school form
    const cancelFormBtn = document.getElementById('cancelSchoolFormBtn');
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', () => closeSchoolForm());
    }

    // Close view modal
    const closeViewModalBtn = document.getElementById('closeViewModalBtn');
    if (closeViewModalBtn) {
        closeViewModalBtn.addEventListener('click', () => closeViewModal());
    }

    // Cancel confirmation
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    if (cancelConfirmBtn) {
        cancelConfirmBtn.addEventListener('click', () => closeConfirmationModal());
    }

    // Confirm action
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    if (confirmActionBtn) {
        confirmActionBtn.addEventListener('click', () => executeConfirmedAction());
    }

    // Export schools
    const exportSchoolsBtn = document.getElementById('exportSchoolsBtn');
    if (exportSchoolsBtn) {
        exportSchoolsBtn.addEventListener('click', () => exportSchools());
    }

    // Add training session
    const addSessionBtn = document.getElementById('addSessionBtn');
    if (addSessionBtn) {
        addSessionBtn.addEventListener('click', () => addTrainingSession());
    }

    // Event delegation for dynamically created elements
    document.addEventListener('click', function (e) {
        // Edit school buttons
        if (e.target.classList.contains('edit-btn')) {
            const schoolId = e.target.closest('button').dataset.id;
            openSchoolForm(true, schoolId);
        }

        // View school buttons
        if (e.target.classList.contains('view-btn')) {
            const schoolId = e.target.closest('button').dataset.id;
            viewSchool(schoolId);
        }

        // Delete school buttons
        if (e.target.classList.contains('delete-btn')) {
            const schoolId = e.target.closest('button').dataset.id;
            confirmDelete(schoolId);
        }

        // Remove session buttons
        if (e.target.classList.contains('removeSessionBtn')) {
            const row = e.target.closest('.session-row');
            if (document.querySelectorAll('.session-row').length > 1) {
                row.remove();
            } else {
                showNotification('At least one training session is required', 'error');
            }
        }
    });

    // Close modals when clicking outside
    const modals = document.querySelectorAll('.form-container');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal.id === 'schoolFormModal') {
                    closeSchoolForm();
                } else if (modal.id === 'viewSchoolModal') {
                    closeViewModal();
                } else if (modal.id === 'confirmationModal') {
                    closeConfirmationModal();
                }
            }
        });
    });
}



// API Service Functions
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('access_token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        }
    };

    try {
        const response = await fetch(url, config);
        // Debug log
        // console.log('API request:', url, config, response.status);
        if (!response.ok) {
            // Try to parse error message
            let errMsg = `HTTP error! status: ${response.status}`;
            try {
                const errData = await response.json();
                if (errData.detail) errMsg = errData.detail;
            } catch { }
            throw new Error(errMsg);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showNotification(error.message || 'Error connecting to server. Please try again.', 'error');
        throw error;
    }
}

// School API functions
async function getSchools(page = 1, limit = 10) {
    try {
        const endpoint = `/schools/?skip=${(page - 1) * limit}&limit=${limit}`;
        const response = await apiRequest(endpoint);

        // Support two response shapes:
        // - array (old): [...schools]
        // - object (recommended): { items: [...], total: 123 }
        let items = [];
        if (Array.isArray(response)) {
            items = response;
            // If backend only gives array, set totalSchools to array length for now
            totalSchools = response.length;
        } else if (response && response.items) {
            items = response.items;
            totalSchools = response.total || items.length;
        } else {
            // unexpected shape
            items = [];
            totalSchools = 0;
        }
        return items;
    } catch (error) {
        console.error('Failed to fetch schools:', error);
        showNotification('Failed to load schools', 'error');
        return [];
    }
}

async function getSchoolById(id) {
    try {
        const response = await apiRequest(`/schools/${id}`);
        return response;
    } catch (error) {
        console.error('Failed to fetch school:', error);
        showNotification('Failed to load school details', 'error');
        return null;
    }
}

async function createSchool(schoolData) {
    try {
        const response = await apiRequest('/schools/', {
            method: 'POST',
            body: JSON.stringify(schoolData)
        });
        return response;
    } catch (error) {
        console.error('Failed to create school:', error);
        throw error;
    }
}

async function updateSchool(id, schoolData) {
    try {
        const response = await apiRequest(`/schools/${id}`, {
            method: 'PUT',
            body: JSON.stringify(schoolData)
        });
        return response;
    } catch (error) {
        console.error('Failed to update school:', error);
        throw error;
    }
}

async function deleteSchool(id) {
    try {
        const response = await apiRequest(`/schools/${id}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error('Failed to delete school:', error);
        throw error;
    }
}

async function getStats() {
    try {
        const response = await apiRequest('/schools/stats/');
        return response;
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return {
            total_schools: 0,
            active_schools: 0,
            total_cadets: 0,
            districts_covered: 0
        };
    }
}

// UI Functions
function openSchoolForm(editMode = false, schoolId = null) {
    isEditMode = editMode;
    currentSchoolId = schoolId;
    const formTitle = document.getElementById('formTitle');

    if (formTitle) {
        formTitle.textContent = editMode ? 'Edit School' : 'Add New School';
    }

    if (editMode && schoolId) {
        loadSchoolData(schoolId);
    } else {
        resetForm();
    }

    const schoolFormModal = document.getElementById('schoolFormModal');
    if (schoolFormModal) {
        schoolFormModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeSchoolForm() {
    const schoolFormModal = document.getElementById('schoolFormModal');
    if (schoolFormModal) {
        schoolFormModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    resetForm();
}

function resetForm() {
    const schoolForm = document.getElementById('schoolForm');
    if (schoolForm) {
        schoolForm.reset();
    }

    // Clear training sessions except the first one
    const sessionsContainer = document.getElementById('trainingSessionsContainer');
    if (sessionsContainer) {
        sessionsContainer.innerHTML = '';
        addTrainingSession();
    }

    // Clear error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.classList.add('hidden');
    });

    // Remove error styles from inputs
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.classList.remove('border-red-500');
    });
}

async function loadSchoolData(schoolId) {
    try {
        const school = await getSchoolById(schoolId);
        if (school) {
            // Populate form fields
            document.getElementById('schoolName').value = school.name || '';
            document.getElementById('district').value = school.district || '';
            document.getElementById('municipality').value = school.municipality || '';
            document.getElementById('wardNumber').value = school.ward_number || '';
            document.getElementById('areaName').value = school.area_name || '';
            document.getElementById('officialEmail').value = school.official_email || '';
            document.getElementById('phoneNumber').value = school.phone_number || '';
            document.getElementById('website').value = school.website || '';
            document.getElementById('principalName').value = school.principal_name || '';
            document.getElementById('principalContact').value = school.principal_contact || '';
            document.getElementById('teacherName').value = school.teacher_name || '';
            document.getElementById('teacherContact').value = school.teacher_contact || '';
            document.getElementById('notes').value = school.notes || '';

            // Populate training sessions
            const sessionsContainer = document.getElementById('trainingSessionsContainer');
            sessionsContainer.innerHTML = '';

            if (school.training_sessions && school.training_sessions.length > 0) {
                school.training_sessions.forEach((session, index) => {
                    addTrainingSession(
                        session.ncc_batch,
                        session.start_date,
                        session.passout_date,
                        session.division,
                        index
                    );
                });
            } else {
                addTrainingSession();
            }
        }
    } catch (error) {
        console.error('Failed to load school data:', error);
        showNotification('Failed to load school data', 'error');
    }
}
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('handleFormSubmit called'); // Debug log

    if (validateForm()) {
        const formData = gatherFormData();
        console.log('Form data:', formData); // Debug log

        try {
            let response;
            if (isEditMode && currentSchoolId) {
                console.log('Updating school:', currentSchoolId); // Debug log
                response = await updateSchool(currentSchoolId, formData);
                showNotification('School updated successfully!', 'success');
            } else {
                console.log('Creating new school'); // Debug log
                response = await createSchool(formData);
                showNotification('School added successfully!', 'success');
            }
            console.log('API response:', response); // Debug log

            closeSchoolForm();
            loadSchools();
            loadStats();
        } catch (error) {
            console.error('Failed to save school:', error);
            showNotification('Failed to save school. Please try again.', 'error');
        }
    }
}
function gatherFormData() {
    const formData = {
        name: document.getElementById('schoolName').value,
        district: document.getElementById('district').value,
        municipality: document.getElementById('municipality').value,
        ward_number: parseInt(document.getElementById('wardNumber').value),
        area_name: document.getElementById('areaName').value || null,
        official_email: document.getElementById('officialEmail').value || null,
        phone_number: document.getElementById('phoneNumber').value,
        website: document.getElementById('website').value || null,
        principal_name: document.getElementById('principalName').value,
        principal_contact: document.getElementById('principalContact').value,
        teacher_name: document.getElementById('teacherName').value || null,
        teacher_contact: document.getElementById('teacherContact').value || null,
        notes: document.getElementById('notes').value || null,
        training_sessions: []
    };


    // Gather training sessions
    const sessionRows = document.querySelectorAll('.session-row');
    sessionRows.forEach((row, index) => {
        const nccBatch = row.querySelector('input[name="nccBatch[]"]').value;
        const startDate = row.querySelector('input[name="startDate[]"]').value;
        const passoutDate = row.querySelector('input[name="passoutDate[]"]').value;
        const divisionRadio = row.querySelector(`input[name="division-${index}"]:checked`);

        if (nccBatch && startDate && divisionRadio) {
            formData.training_sessions.push({
                ncc_batch: nccBatch,
                start_date: startDate,
                passout_date: passoutDate || null,
                division: divisionRadio.value
            });
        }
    });
    console.log('Gathered form data:', formData); // Debug log
    return formData;
}

function validateForm() {
    let isValid = true;

    // Required fields validation
    const requiredFields = [
        'schoolName', 'district', 'municipality', 'wardNumber',
        'phoneNumber', 'principalName', 'principalContact'
    ];

    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        const errorElement = document.getElementById(`${field}Error`);

        if (element && !element.value.trim()) {
            if (errorElement) errorElement.classList.remove('hidden');
            element.classList.add('border-red-500');
            isValid = false;
        } else if (element && errorElement) {
            errorElement.classList.add('hidden');
            element.classList.remove('border-red-500');
        }
    });

    // Validate training sessions
    const sessionRows = document.querySelectorAll('.session-row');
    sessionRows.forEach((row, index) => {
        const nccBatch = row.querySelector('input[name="nccBatch[]"]');
        const startDate = row.querySelector('input[name="startDate[]"]');
        const divisionRadios = row.querySelectorAll(`input[name="division-${index}"]`);
        let divisionSelected = false;

        divisionRadios.forEach(radio => {
            if (radio.checked) divisionSelected = true;
        });

        if (!nccBatch.value.trim()) {
            nccBatch.classList.add('border-red-500');
            isValid = false;
        }

        if (!startDate.value) {
            startDate.classList.add('border-red-500');
            isValid = false;
        }

        if (!divisionSelected) {
            isValid = false;
        }
    });

    // Email validation
    const email = document.getElementById('officialEmail');
    const emailError = document.getElementById('officialEmailError');

    if (email && email.value && !isValidEmail(email.value)) {
        if (emailError) emailError.classList.remove('hidden');
        email.classList.add('border-red-500');
        isValid = false;
    } else if (email && emailError) {
        emailError.classList.add('hidden');
        email.classList.remove('border-red-500');
    }

    // Website validation
    const website = document.getElementById('website');
    const websiteError = document.getElementById('websiteError');

    if (website && website.value && !isValidUrl(website.value)) {
        if (websiteError) websiteError.classList.remove('hidden');
        website.classList.add('border-red-500');
        isValid = false;
    } else if (website && websiteError) {
        websiteError.classList.add('hidden');
        website.classList.remove('border-red-500');
    }

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

function addTrainingSession(nccBatch = '', startDate = '', passoutDate = '', division = '', index = 0) {
    const container = document.getElementById('trainingSessionsContainer');
    const sessionCount = container.querySelectorAll('.session-row').length;

    const newRow = document.createElement('div');
    newRow.className = 'session-row grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg';
    newRow.innerHTML = `
        <div>
            <label class="form-label block text-sm font-medium text-gray-700 mb-1 required">NCC Batch</label>
            <input type="text" name="nccBatch[]" class="form-input w-full" value="${nccBatch}" placeholder="Enter NCC batch" required>
        </div>
        <div>
            <label class="form-label block text-sm font-medium text-gray-700 mb-1 required">Start Date</label>
            <input type="date" name="startDate[]" class="form-input w-full" value="${startDate}" required>
        </div>
        <div>
            <label class="form-label block text-sm font-medium text-gray-700 mb-1">Passout Date</label>
            <input type="date" name="passoutDate[]" class="form-input w-full" value="${passoutDate}">
        </div>
        <div>
            <label class="form-label block text-sm font-medium text-gray-700 mb-1 required">Division</label>
            <div class="flex space-x-4">
                <label class="flex items-center">
                    <input type="radio" name="division-${sessionCount}" value="junior" class="mr-2" ${division === 'junior' ? 'checked' : ''} required>
                    <span>Junior</span>
                </label>
                <label class="flex items-center">
                    <input type="radio" name="division-${sessionCount}" value="senior" class="mr-2" ${division === 'senior' ? 'checked' : ''}>
                    <span>Senior</span>
                </label>
            </div>
        </div>
        <div class="flex items-end">
            <button type="button" class="removeSessionBtn bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Remove
            </button>
        </div>
    `;

    container.appendChild(newRow);
}

// --- DEBUGGING HELP ---
// Add this at the top of your file or before the API call to see if fetch is being called:
window.fetch = (function (fetch) {
    return function () {
        console.log('fetch called:', arguments[0], arguments[1]);
        return fetch.apply(this, arguments);
    };
})(window.fetch);

async function loadSchools() {
    try {
        const schools = await getSchools(currentPage, schoolsPerPage);
        renderSchools(schools);
    } catch (error) {
        console.error('Failed to load schools:', error);
    }
}

function renderSchools(schools) {
    const tableBody = document.getElementById('schoolsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (schools.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No schools found. Click "Add School" to create one.
                </td>
            </tr>
        `;
        return;
    }

    schools.forEach(school => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${school.name}</div>
                <div class="text-sm text-gray-500">${school.website || 'N/A'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${school.district}</div>
                <div class="text-sm text-gray-500">Ward ${school.ward_number}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${school.principal_name}</div>
                <div class="text-sm text-gray-500">${school.principal_contact}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${calculateTotalCadets(school.training_sessions)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${school.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${school.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-3 edit-btn" data-id="${school.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-indigo-600 hover:text-indigo-900 mr-3 view-btn" data-id="${school.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${school.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    updatePagination();
}

function calculateTotalCadets(trainingSessions) {
    if (!trainingSessions || trainingSessions.length === 0) return 0;
    return trainingSessions.length * 30; // Assuming 30 cadets per session
}

function updatePagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalSchools / schoolsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <div class="text-sm text-gray-700 mb-4 md:mb-0">
            Showing <span class="font-medium">${((currentPage - 1) * schoolsPerPage) + 1}</span> to <span class="font-medium">${Math.min(currentPage * schoolsPerPage, totalSchools)}</span> of
            <span class="font-medium">${totalSchools}</span> schools
        </div>
        <div class="flex items-center space-x-1">
    `;

    // Previous button
    paginationHTML += `
        <button class="px-3 py-1 rounded border text-sm text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" 
            ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="px-3 py-1 rounded border text-sm bg-primary text-white">${i}</button>`;
        } else if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            paginationHTML += `<button class="px-3 py-1 rounded border text-sm text-gray-700 hover:bg-gray-50" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="px-2 py-1">...</span>`;
        }
    }

    // Next button
    paginationHTML += `
        <button class="px-3 py-1 rounded border text-sm text-gray-700 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" 
            ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginationHTML += `</div>`;
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    loadSchools();
}

async function loadStats() {
    try {
        const stats = await getStats();
        renderStats(stats);
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

function renderStats(stats) {
    const statsContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4.gap-6.mb-8');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
        <div class="stats-card bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-gray-500 text-sm font-medium">Total Schools</p>
                    <h3 class="text-2xl font-bold mt-1 text-gray-800">${stats.total_schools}</h3>
                    <p class="text-green-500 text-xs mt-2 flex items-center"><i class="fas fa-arrow-up mr-1"></i> ${Math.floor(stats.total_schools * 0.88)} licensee</p>
                </div>
                <div class="bg-indigo-100 p-3 rounded-full">
                    <i class="fas fa-school text-indigo-600 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="stats-card bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-gray-500 text-sm font-medium">Active Schools</p>
                    <h3 class="text-2xl font-bold mt-1 text-gray-800">${stats.active_schools}</h3>
                    <p class="text-green-500 text-xs mt-2 flex items-center"><i class="fas fa-check-circle mr-1"></i> ${Math.round((stats.active_schools / stats.total_schools) * 100)}% active</p>
                </div>
                <div class="bg-green-100 p-3 rounded-full">
                    <i class="fas fa-check text-green-600 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="stats-card bg-white p-6 rounded-lg shadow-sm border-l-4 border-amber-500">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-gray-500 text-sm font-medium">Total Cadets</p>
                    <h3 class="text-2xl font-bold mt-1 text-gray-800">${stats.total_cadets}</h3>
                    <p class="text-green-500 text-xs mt-2 flex items-center"><i class="fas fa-arrow-up mr-1"></i> 9% increase</p>
                </div>
                <div class="bg-amber-100 p-3 rounded-full">
                    <i class="fas fa-users text-amber-600 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="stats-card bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-gray-500 text-sm font-medium">Districts Covered</p>
                    <h3 class="text-2xl font-bold mt-1 text-gray-800">${stats.districts_covered}</h3>
                    <p class="text-blue-500 text-xs mt-2 flex items-center"><i class="fas fa-map-marker-alt mr-1"></i> 65% of legal</p>
                </div>
                <div class="bg-blue-100 p-3 rounded-full">
                    <i class="fas fa-map text-blue-600 text-xl"></i>
                </div>
            </div>
        </div>
    `;
}

function viewSchool(schoolId) {
    // Implementation for viewing school details
    showNotification('View school functionality will be implemented soon', 'info');
}

function closeViewModal() {
    const viewSchoolModal = document.getElementById('viewSchoolModal');
    if (viewSchoolModal) {
        viewSchoolModal.classList.add('hidden');
    }
}

function confirmDelete(schoolId) {
    currentSchoolId = schoolId;

    const confirmationModal = document.getElementById('confirmationModal');
    const confirmationTitle = document.getElementById('confirmationTitle');
    const confirmationMessage = document.getElementById('confirmationMessage');

    if (confirmationModal && confirmationTitle && confirmationMessage) {
        confirmationTitle.textContent = 'Delete School';
        confirmationMessage.textContent = 'Are you sure you want to delete this school? This action cannot be undone.';
        confirmationModal.classList.remove('hidden');
    }
}

function closeConfirmationModal() {
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) {
        confirmationModal.classList.add('hidden');
    }
    currentSchoolId = null;
}

async function executeConfirmedAction() {
    if (currentSchoolId) {
        try {
            await deleteSchool(currentSchoolId);
            showNotification('School deleted successfully', 'success');
            loadSchools();
            loadStats();
        } catch (error) {
            console.error('Failed to delete school:', error);
            showNotification('Failed to delete school', 'error');
        }
    }

    closeConfirmationModal();
}

function exportSchools() {
    showNotification('Export functionality will be implemented soon', 'info');
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.getElementById('customNotification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'customNotification';
    notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-md text-white ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Make functions available globally for onclick attributes
window.changePage = changePage;