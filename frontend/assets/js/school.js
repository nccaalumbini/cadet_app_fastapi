const API_BASE_URL = 'http://localhost:8080';

// Global variables
let currentPage = 1;
let schoolsPerPage = 10;
let totalSchools = 0;
let currentSchoolId = null;
let isEditMode = false;
let sessionCount = 0;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    addTrainingSession();
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

    // Close school form
    const closeFormBtn = document.getElementById('closeSchoolFormBtn');
    if (closeFormBtn) {
        closeFormBtn.addEventListener('click', () => closeSchoolForm());
    }

    // Cancel school form
    const cancelFormBtn = document.getElementById('cancelSchoolFormBtn');
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', () => closeSchoolForm());
    }

    // Form submit handler
    const schoolForm = document.getElementById('schoolForm');
    if (schoolForm) {
        console.log("Attaching form submit handler 🚀");
        schoolForm.addEventListener('submit', handleFormSubmit);
    } else {
        console.error("School form not found in the DOM");
    }

    // Add training session
    const addSessionBtn = document.getElementById('addSessionBtn');
    if (addSessionBtn) {
        addSessionBtn.addEventListener('click', () => addTrainingSession());
    }
    // Close view modal
    const closeViewModalBtn = document.getElementById('closeViewModalBtn');
    if (closeViewModalBtn) {
        closeViewModalBtn.addEventListener('click', () => closeViewSchoolModal());
    }

    // Close view modal with X button
    const closeViewSchoolModalBtn = document.getElementById('closeViewSchoolModal');
    if (closeViewSchoolModalBtn) {
        closeViewSchoolModalBtn.addEventListener('click', () => closeViewSchoolModal());
    }

    // Tab switching in view modal
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            switchTab(tab);
        });
    });



}

// Event delegation for dynamically created elements
document.addEventListener('click', function (e) {
    // Edit school buttons
    if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
        const btn = e.target.classList.contains('edit-btn') ? e.target : e.target.closest('.edit-btn');
        const schoolId = btn.dataset.id;
        openSchoolForm(true, schoolId);
    }
    // View school buttons
    if (e.target.classList.contains('view-btn') || e.target.closest('.view-btn')) {
        const btn = e.target.classList.contains('view-btn') ? e.target : e.target.closest('.view-btn');
        const schoolId = btn.dataset.id;
        viewSchool(schoolId);
    }

    // Delete school buttons
    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
        const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
        const schoolId = btn.dataset.id;
        confirmDeleteSchool(schoolId);
    }

    // Remove session buttons
    if (e.target.classList.contains('removeSessionBtn') || e.target.closest('.removeSessionBtn')) {
        const btn = e.target.classList.contains('removeSessionBtn') ? e.target : e.target.closest('.removeSessionBtn');
        const sessionRow = btn.closest('.session-row');
        if (sessionRow) {
            sessionRow.remove();
        }
    }
});
// API request helper
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}
// School API functions
//  async function getSchools(page = 1, limit = 10) {
//             try {
//                 const response = await apiRequest(`/api/schools?page=${page - 1}&size=${limit}&sortBy=name&direction=asc`);
//                 totalSchools = response.totalElements || response.length || 0;
//                 return response.content || response;
//             } catch (error) {
//                 console.error('Failed to fetch schools:', error);
//                 showNotification('Failed to load schools', 'error');
//                 return [];
//             }
//         }
async function getSchools(page = 1, limit = 10) {
    try {
        const response = await apiRequest(`/api/schools?page=${page - 1}&size=${limit}&sortBy=name&direction=asc`);
        totalSchools = response.totalElements || response.length || 0;
        return response.content || response;
    } catch (error) {
        console.error('Failed to fetch schools:', error);
        showNotification('Failed to load schools', 'error');
        return [];
    }
}

async function getSchoolById(id) {
    try {
        return await apiRequest(`/api/schools/${id}`);
    } catch (error) {
        console.error('Failed to fetch school:', error);
        showNotification('Failed to load school details', 'error');
        return null;
    }
}

async function createSchool(schoolData) {
    try {
        console.log("Creating school with data:", schoolData);
        return await apiRequest('/api/schools', {
            method: 'POST',
            body: schoolData
        });
    } catch (error) {
        console.error('Failed to create school:', error);
        showNotification(error.message || 'Failed to create school', 'error');
        throw error;
    }
}

async function updateSchool(id, schoolData) {
    try {
        return await apiRequest(`/api/schools/${id}`, {
            method: 'PUT',
            body: schoolData
        });
    } catch (error) {
        console.error('Failed to update school:', error);
        throw error;
    }
}

async function deleteSchool(id) {
    try {
        return await apiRequest(`/api/schools/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Failed to delete school:', error);
        throw error;
    }
}

async function getStats() {
    try {
        return await apiRequest('/api/schools/stats');
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

        // Preselect the first district
        const districtSelect = document.getElementById('district');
        if (districtSelect && districtSelect.options.length > 1) {
            districtSelect.selectedIndex = 1;
        }
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
            document.getElementById('wardNumber').value = school.wardNumber || '';
            document.getElementById('areaName').value = school.areaName || '';
            document.getElementById('officialEmail').value = school.officialEmail || '';
            document.getElementById('phoneNumber').value = school.phoneNumber || '';
            document.getElementById('website').value = school.website || '';
            document.getElementById('principalName').value = school.principalName || '';
            document.getElementById('principalContact').value = school.principalContact || '';
            document.getElementById('teacherName').value = school.teacherName || '';
            document.getElementById('teacherContact').value = school.teacherContact || '';
            document.getElementById('notes').value = school.notes || '';

            // Populate training sessions
            const sessionsContainer = document.getElementById('trainingSessionsContainer');
            sessionsContainer.innerHTML = '';

            if (school.trainingSessions && school.trainingSessions.length > 0) {
                sschool.trainingSessions.forEach((session) => {
                    const sessionRow = addTrainingSession(
                        session.nccBatch,
                        session.startDate,
                        session.passoutDate,
                        session.division
                    );
                    // Optionally, store the original session ID in the DOM
                    // sessionRow.dataset.sessionId = session.id; // if your backend provides session IDs
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
// async function handleFormSubmit(e) {
//     e.preventDefault();
//     console.log("Form submit triggered 🚀");

//     // Log all required field values for debugging
//     const requiredFields = [
//         'schoolName', 'district', 'municipality', 'wardNumber',
//         'phoneNumber', 'principalName', 'principalContact'
//     ];
//     requiredFields.forEach(field => {
//         const el = document.getElementById(field);
//         if (el) {
//             console.log(`Field ${field}:`, el.value);
//         } else {
//             console.warn(`Field ${field} not found in DOM`);
//         }
//     });

//     if (validateForm()) {
//         const formData = gatherFormData();
//         console.log("Submitting school data:", formData);
//         console.log("About to call createSchool API...");

//         try {
//             if (isEditMode && currentSchoolId) {
//                 await updateSchool(currentSchoolId, formData);
//                 showNotification('School updated successfully!', 'success');
//             } else {
//                 await createSchool(formData);
//                 showNotification('School added successfully!', 'success');
//             }

//             closeSchoolForm();
//             loadSchools();
//             loadStats();
//         } catch (error) {
//             console.error('Failed to save school:', error);
//             showNotification('Failed to save school. Please try again.', 'error');
//         }
//     } else {
//         console.log("Form validation failed. Not submitting.");
//     }
// }
async function handleFormSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
        const formData = gatherFormData();

        try {
            if (isEditMode && currentSchoolId) {
                await updateSchool(currentSchoolId, formData);
                showNotification('School updated successfully!', 'success');
            } else {
                await createSchool(formData);
                showNotification('School added successfully!', 'success');
            }

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
        wardNumber: parseInt(document.getElementById('wardNumber').value) || 0,
        areaName: document.getElementById('areaName').value || null,
        officialEmail: document.getElementById('officialEmail').value || null,
        phoneNumber: document.getElementById('phoneNumber').value,
        website: document.getElementById('website').value || null,
        principalName: document.getElementById('principalName').value,
        principalContact: document.getElementById('principalContact').value,
        teacherName: document.getElementById('teacherName').value || null,
        teacherContact: document.getElementById('teacherContact').value || null,
        notes: document.getElementById('notes').value || null,
        isActive: true,
        trainingSessions: []
    };

    // Select all session rows from the DOM
    const sessionRows = document.querySelectorAll('.session-row');
    // Gather training sessions
    sessionRows.forEach((row) => {
        const sessionId = row.dataset.sessionId; // use the correct sessionId
        const nccBatch = row.querySelector('input[name="nccBatch[]"]').value;
        const startDate = row.querySelector('input[name="startDate[]"]').value;
        const passoutDate = row.querySelector('input[name="passoutDate[]"]').value;
        const divisionRadio = row.querySelector(`input[name="division-${sessionId}"]:checked`);

        if (nccBatch && startDate && divisionRadio) {
            formData.trainingSessions.push({
                nccBatch: nccBatch,
                startDate: startDate,
                passoutDate: passoutDate || null,
                division: divisionRadio.value
            });
        }
    });

    return formData;
}

function validateForm() {
    let isValid = true;
    let failedFields = [];

    // Required fields validation
    const requiredFields = [
        'schoolName', 'district', 'municipality', 'wardNumber',
        'phoneNumber', 'principalName', 'principalContact'
    ];

    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        const errorElement = document.getElementById(`${field}Error`);
        let invalid = false;

        if (!element) {
            console.warn(`⚠️ Element with id="${field}" not found`);
            return;
        }

        if (field === "district") {
            console.log("District raw value:", element.value);
            invalid = element.value === "";
            if (invalid && errorElement) {
                errorElement.textContent = "Please select a district.";
            }
        } else {
            invalid = !element.value || element.value.trim() === "";
        }

        if (invalid) {
            if (errorElement) errorElement.classList.remove("hidden");
            element.classList.add("border-red-500");
            isValid = false;
            failedFields.push(field);
        } else {
            if (errorElement) errorElement.classList.add("hidden");
            element.classList.remove("border-red-500");
        }
    });
    // Validate training sessions
    const sessionRows = document.querySelectorAll('.session-row');
    sessionRows.forEach((row, index) => {
        const nccBatch = row.querySelector('input[name="nccBatch[]"]');
        const startDate = row.querySelector('input[name="startDate[]"]');
        const sessionId = row.dataset.sessionId; // get the actual sessionId
        const divisionRadios = row.querySelectorAll(`input[name="division-${sessionId}"]`);
        let divisionSelected = [...divisionRadios].some(radio => radio.checked);



        divisionRadios.forEach(radio => {
            if (radio.checked) divisionSelected = true;
        });

        if (!nccBatch.value.trim()) {
            nccBatch.classList.add('border-red-500');
            isValid = false;
            failedFields.push(`Training session ${index + 1} NCC Batch`);
        }

        if (!startDate.value) {
            startDate.classList.add('border-red-500');
            isValid = false;
            failedFields.push(`Training session ${index + 1} Start Date`);
        }

        if (!divisionSelected) {
            // Show error visually for division
            divisionRadios.forEach(radio => {
                radio.classList.add('border-red-500');
            });
            // Optionally, show a message near the division radios
            const divisionErrorId = `divisionError${sessionId}`;
            let divisionError = row.querySelector(`#${divisionErrorId}`);
            if (!divisionError) {
                divisionError = document.createElement('div');
                divisionError.id = divisionErrorId;
                divisionError.className = 'text-red-500 text-xs mt-1';
                divisionError.textContent = 'Please select a division.';
                row.appendChild(divisionError);
            } else {
                divisionError.classList.remove('hidden');
            }
            isValid = false;
            failedFields.push(`Training session ${index + 1} Division`);
        } else {
            // Remove error if division is selected
            const divisionErrorId = `divisionError${index}`;
            let divisionError = row.querySelector(`#${divisionErrorId}`);
            if (divisionError) {
                divisionError.classList.add('hidden');
            }
            divisionRadios.forEach(radio => {
                radio.classList.remove('border-red-500');
            });
        }
    });

    // Email validation
    const email = document.getElementById('officialEmail');
    const emailError = document.getElementById('officialEmailError');
    if (email && email.value && !isValidEmail(email.value)) {
        if (emailError) emailError.classList.remove('hidden');
        email.classList.add('border-red-500');
        isValid = false;
        failedFields.push('Invalid email address');
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
        failedFields.push('Invalid website URL');
    } else if (website && websiteError) {
        websiteError.classList.add('hidden');
        website.classList.remove('border-red-500');
    }

    if (!isValid) {
        console.log('Form validation failed for fields:', failedFields);
    }
    console.log("❌ Failed fields:", failedFields);
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

// function addTrainingSession(nccBatch = '', startDate = '', passoutDate = '', division = '', index = 0) {
//     const sessionsContainer = document.getElementById('trainingSessionsContainer');
//     const sessionId = sessionCount++;
//     const sessionRow = document.createElement('div');
//     sessionRow.className = 'session-row bg-white p-4 rounded border';
//     sessionRow.dataset.sessionId = sessionId; //  here
//     sessionRow.innerHTML = `
//                 <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
//                     <div>
//                         <label class="block text-sm font-medium text-gray-700 mb-1 required">NCC Batch</label>
//                         <input type="text" name="nccBatch[]" class="w-full px-3 py-2 border rounded-md" placeholder="Enter NCC batch" value="${nccBatch}" required>
//                     </div>
//                     <div>
//                         <label class="block text-sm font-medium text-gray-700 mb-1 required">Start Date</label>
//                         <input type="date" name="startDate[]" class="w-full px-3 py-2 border rounded-md" value="${startDate}" required>
//                     </div>
//                     <div>
//                         <label class="block text-sm font-medium text-gray-700 mb-1">Passout Date</label>
//                         <input type="date" name="passoutDate[]" class="w-full px-3 py-2 border rounded-md" value="${passoutDate}">
//                     </div>
//                     <div class="flex items-center space-x-4">
//                         <div>
//                             <label class="block text-sm font-medium text-gray-700 mb-1 required">Division</label>
//                             <div class="flex space-x-4 mt-1">
//                                 <label class="flex items-center">
//                                     <input type="radio" name="division-${sessionId}" value="junior" class="mr-2" ${division === 'junior' ? 'checked' : ''}>
//                                     <span>Junior</span>
//                                 </label>
//                                 <label class="flex items-center">
//                                     <input type="radio" name="division-${sessionId}" value="senior" class="mr-2" ${division === 'senior' ? 'checked' : ''}>
//                                     <span>Senior</span>
//                                 </label>
//                             </div>
//                         </div>
//                         <button type="button" class="removeSessionBtn text-red-600 hover:text-red-800">
//                             <i class="fas fa-trash"></i>
//                         </button>
//                     </div>
//                 </div>
//             `;
//     sessionsContainer.appendChild(sessionRow);
// }

function addTrainingSession(nccBatch = '', startDate = '', passoutDate = '', division = '') {
    const sessionsContainer = document.getElementById('trainingSessionsContainer');
    const sessionId = sessionCount++;
    const sessionRow = document.createElement('div');
    sessionRow.className = 'session-row bg-white p-4 rounded border';
    sessionRow.dataset.sessionId = sessionId;
    sessionRow.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 required">NCC Batch</label>
                        <input type="text" name="nccBatch[]" class="w-full px-3 py-2 border rounded-md" placeholder="Enter NCC batch" value="${nccBatch}" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 required">Start Date</label>
                        <input type="date" name="startDate[]" class="w-full px-3 py-2 border rounded-md" value="${startDate}" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Passout Date</label>
                        <input type="date" name="passoutDate[]" class="w-full px-3 py-2 border rounded-md" value="${passoutDate}">
                    </div>
                    <div class="flex items-center space-x-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1 required">Division</label>
                            <div class="flex space-x-4 mt-1">
                                <label class="flex items-center">
                                    <input type="radio" name="division-${sessionId}" value="junior" class="mr-2" ${division === 'junior' ? 'checked' : ''}>
                                    <span>Junior</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="division-${sessionId}" value="senior" class="mr-2" ${division === 'senior' ? 'checked' : ''}>
                                    <span>Senior</span>
                                </label>
                            </div>
                        </div>
                        <button type="button" class="removeSessionBtn text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
    sessionsContainer.appendChild(sessionRow);
}



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
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-gray-900">${school.name}</div>
                        <div class="text-sm text-gray-500">${school.website || 'N/A'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${school.district}</div>
                        <div class="text-sm text-gray-500">Ward ${school.wardNumber}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${school.principalName}</div>
                        <div class="text-sm text-gray-500">${school.principalContact}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${calculateTotalCadets(school.trainingSessions)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${school.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${school.isActive ? 'Active' : 'Inactive'}
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
    return trainingSessions.length * 36; // 36 cadets per session as per backend
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
            paginationHTML += `<button class="px-3 py-1 rounded border text-sm bg-indigo-600 text-white">${i}</button>`;
        } else {
            paginationHTML += `<button class="px-3 py-1 rounded border text-sm text-gray-700 hover:bg-gray-50" onclick="changePage(${i})">${i}</button>`;
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
                <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
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

                <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
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

                <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-amber-500">
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

                <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
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

// View School functionality
async function viewSchool(schoolId) {
    try {
        const school = await getSchoolById(schoolId);
        if (school) {
            populateViewModal(school);
            openViewSchoolModal();
        }
    } catch (error) {
        console.error('Failed to load school for viewing:', error);
        showNotification('Failed to load school details', 'error');
    }
}

function populateViewModal(school) {
    // Basic Information
    document.getElementById('view-schoolName').textContent = school.name || '-';
    document.getElementById('view-district').textContent = school.district || '-';
    document.getElementById('view-municipality').textContent = school.municipality || '-';
    document.getElementById('view-wardNumber').textContent = school.wardNumber || '-';
    document.getElementById('view-areaName').textContent = school.areaName || '-';

    const statusElement = document.getElementById('view-status');
    if (school.isActive) {
        statusElement.className = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
        statusElement.textContent = 'Active';
    } else {
        statusElement.className = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
        statusElement.textContent = 'Inactive';
    }

    // Contact Information
    document.getElementById('view-officialEmail').textContent = school.officialEmail || '-';
    document.getElementById('view-phoneNumber').textContent = school.phoneNumber || '-';
    document.getElementById('view-website').textContent = school.website || '-';
    document.getElementById('view-principalName').textContent = school.principalName || '-';
    document.getElementById('view-principalContact').textContent = school.principalContact || '-';
    document.getElementById('view-teacherName').textContent = school.teacherName || '-';
    document.getElementById('view-teacherContact').textContent = school.teacherContact || '-';

    // NCC Information
    const trainingSessionsContainer = document.getElementById('view-trainingSessions');
    trainingSessionsContainer.innerHTML = '';

    if (school.trainingSessions && school.trainingSessions.length > 0) {
        school.trainingSessions.forEach(session => {
            const sessionElement = document.createElement('div');
            sessionElement.className = 'bg-white p-4 rounded border mb-2';
            sessionElement.innerHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">NCC Batch</label>
                                <p class="text-gray-900">${session.nccBatch || '-'}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <p class="text-gray-900">${session.startDate || '-'}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Passout Date</label>
                                <p class="text-gray-900">${session.passoutDate || '-'}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Division</label>
                                <p class="text-gray-900">${session.division ? session.division.charAt(0).toUpperCase() + session.division.slice(1) : '-'}</p>
                            </div>
                        </div>
                    `;
            trainingSessionsContainer.appendChild(sessionElement);
        });
    } else {
        trainingSessionsContainer.innerHTML = '<p class="text-gray-500">No training sessions found</p>';
    }

    // Notes
    document.getElementById('view-notes').textContent = school.notes || '-';
}

function openViewSchoolModal() {
    const viewModal = document.getElementById('viewSchoolModal');
    if (viewModal) {
        viewModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Activate the first tab
        switchTab('basic');
    }
}

function closeViewSchoolModal() {
    const viewModal = document.getElementById('viewSchoolModal');
    if (viewModal) {
        viewModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function switchTab(tabName) {
    // Deactivate all tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });

    // Activate selected tab
    const activeTabButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    if (activeTabButton) {
        activeTabButton.classList.add('active');
    }

    // Show selected tab content
    const activeTabContent = document.getElementById(`${tabName}InfoTab`);
    if (activeTabContent) {
        activeTabContent.classList.remove('hidden');
    }
}

// Delete School functionality
function confirmDeleteSchool(schoolId) {
    schoolToDelete = schoolId;
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) {
        confirmationModal.classList.remove('hidden');
    }
}

function closeConfirmationModal() {
    schoolToDelete = null;
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) {
        confirmationModal.classList.add('hidden');
    }
}

async function executeDeleteSchool() {
    if (schoolToDelete) {
        try {
            await deleteSchool(schoolToDelete);
            showNotification('School deleted successfully!', 'success');
            closeConfirmationModal();
            loadSchools();
            loadStats();
        } catch (error) {
            console.error('Failed to delete school:', error);
            showNotification('Failed to delete school. Please try again.', 'error');
        }
    }
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
window.closeConfirmationModal = function () {
    document.getElementById('confirmationModal').classList.add('hidden');
};

window.executeConfirmedAction = async function () {
    if (window.confirmedDeleteId) {
        await deleteSchool(window.confirmedDeleteId);
        window.confirmedDeleteId = null;
    }
    closeConfirmationModal();
};

// Make functions available globally for onclick attributes
window.changePage = changePage;
window.closeConfirmationModal = closeConfirmationModal;
window.executeConfirmedAction = executeConfirmedAction;