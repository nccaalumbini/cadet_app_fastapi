// DOM Elements
const openFormBtn = document.getElementById('openSchoolFormBtn');
const cancelFormBtn = document.getElementById('cancelSchoolFormBtn');
const schoolFormModal = document.getElementById('schoolFormModal');
const schoolForm = document.getElementById('schoolForm');

// Show modal when Add School button is clicked
openFormBtn.addEventListener('click', function () {
    schoolFormModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

// Hide modal when Cancel button is clicked
cancelFormBtn.addEventListener('click', function () {
    schoolFormModal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    resetForm();
});

// Hide modal when clicking outside the form
schoolFormModal.addEventListener('click', function (e) {
    if (e.target === schoolFormModal) {
        schoolFormModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        resetForm();
    }
});

// Form validation and submission
schoolForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validateForm()) {
        // Form is valid, process the data
        const formData = new FormData(schoolForm);
        const formObject = Object.fromEntries(formData.entries());

        // Here you would typically send the data to your backend
        console.log('Form data:', formObject);

        // Show success message (in a real application)
        alert('School added successfully!');

        // Reset form and close modal
        resetForm();
        schoolFormModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
});

// Form validation function
function validateForm() {
    let isValid = true;

    // Required fields validation
    const requiredFields = [
        'schoolName', 'district', 'municipality', 'wardNumber',
        'phoneNumber', 'principalName', 'principalContact',
        'nccBatch', 'startDate'
    ];

    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        const errorElement = document.getElementById(field + 'Error');

        if (!element.value.trim()) {
            errorElement.style.display = 'block';
            element.classList.add('border-red-500');
            isValid = false;
        } else {
            errorElement.style.display = 'none';
            element.classList.remove('border-red-500');
        }
    });

    // Division radio buttons validation
    const divisionSelected = document.querySelector('input[name="division"]:checked');
    const divisionError = document.getElementById('divisionError');

    if (!divisionSelected) {
        divisionError.style.display = 'block';
        isValid = false;
    } else {
        divisionError.style.display = 'none';
    }

    // Email validation
    const email = document.getElementById('officialEmail');
    const emailError = document.getElementById('officialEmailError');

    if (email.value && !isValidEmail(email.value)) {
        emailError.style.display = 'block';
        email.classList.add('border-red-500');
        isValid = false;
    } else {
        emailError.style.display = 'none';
        email.classList.remove('border-red-500');
    }

    // Website validation
    const website = document.getElementById('website');
    const websiteError = document.getElementById('websiteError');

    if (website.value && !isValidUrl(website.value)) {
        websiteError.style.display = 'block';
        website.classList.add('border-red-500');
        isValid = false;
    } else {
        websiteError.style.display = 'none';
        website.classList.remove('border-red-500');
    }

    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// URL validation helper
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

// Reset form function
function resetForm() {
    schoolForm.reset();

    // Clear error messages and styles
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.style.display = 'none';
    });

    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.classList.remove('border-red-500');
    });
}

// Real-time validation for specific fields
document.getElementById('officialEmail').addEventListener('blur', function () {
    const emailError = document.getElementById('officialEmailError');
    if (this.value && !isValidEmail(this.value)) {
        emailError.style.display = 'block';
        this.classList.add('border-red-500');
    } else {
        emailError.style.display = 'none';
        this.classList.remove('border-red-500');
    }
});

document.getElementById('website').addEventListener('blur', function () {
    const websiteError = document.getElementById('websiteError');
    if (this.value && !isValidUrl(this.value)) {
        websiteError.style.display = 'block';
        this.classList.add('border-red-500');
    } else {
        websiteError.style.display = 'none';
        this.classList.remove('border-red-500');
    }
});




/// multiple traning session of a school 
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("trainingSessionsContainer");
    const addBtn = document.getElementById("addSessionBtn");

    // Add new session
    addBtn.addEventListener("click", () => {
        const newRow = document.createElement("div");
        newRow.className = "session-row grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg";

        newRow.innerHTML = `
            <div>
                <label class="form-label block text-sm font-medium text-gray-700 mb-1 required">NCC Batch</label>
                <input type="text" name="nccBatch[]" class="form-input w-full" placeholder="Enter NCC batch" required>
            </div>
            <div>
                <label class="form-label block text-sm font-medium text-gray-700 mb-1 required">Start Date</label>
                <input type="date" name="startDate[]" class="form-input w-full" required>
            </div>
            <div>
                <label class="form-label block text-sm font-medium text-gray-700 mb-1">Passout Date</label>
                <input type="date" name="passoutDate[]" class="form-input w-full">
            </div>
            <div>
                <label class="form-label block text-sm font-medium text-gray-700 mb-1 required">Division</label>
                <div class="flex space-x-4">
                    <label class="flex items-center">
                        <input type="radio" name="division[]" class="mr-2" value="junior" required>
                        <span>Junior</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="division[]" class="mr-2" value="senior">
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

        // Clear values in cloned row
        newRow.querySelectorAll("input").forEach(input => {
            input.value = "";
            if (input.type === "radio") input.checked = false;
        });

        // Attach remove handler
        newRow.querySelector(".removeSessionBtn").addEventListener("click", () => newRow.remove());

        container.appendChild(newRow);
    });

    // Remove initial row if clicked
    container.querySelectorAll(".removeSessionBtn").forEach(btn => {
        btn.addEventListener("click", e => e.target.closest(".session-row").remove());
    });
});