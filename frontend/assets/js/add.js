// Search Cadets
function searchCadets() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('#cadetTableBody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
}

document.getElementById('searchInput').addEventListener('input', searchCadets);

// Form submission
document.getElementById('cadetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Hide all previous errors
    document.querySelectorAll('#cadetForm .border-red-500').forEach(el => el.classList.remove('border-red-500'));
    document.querySelectorAll('#cadetForm [id^="error-"]').forEach(el => {
        el.textContent = '';
        el.classList.add('hidden');
    });

    let hasError = false;

    // Cadet Number
    if (!/^NCC-\d{5}$/.test(data.cadet_no)) {
        const input = document.querySelector('[name="cadet_no"]');
        input.classList.add('border-red-500');
        document.getElementById('error-cadet_no').textContent = 'Cadet Number must be in NCC-XXXXX format (e.g., NCC-00123)';
        document.getElementById('error-cadet_no').classList.remove('hidden');
        hasError = true;
    }

    // Name
    if (!data.name || !data.name.trim()) {
        const input = document.querySelector('[name="name"]');
        input.classList.add('border-red-500');
        document.getElementById('error-name').textContent = 'Full Name is required';
        document.getElementById('error-name').classList.remove('hidden');
        hasError = true;
    }

    // Contact
    if (!/^\d{10}$/.test(data.contact)) {
        const input = document.querySelector('[name="contact"]');
        input.classList.add('border-red-500');
        document.getElementById('error-contact').textContent = 'Contact must be a 10-digit number';
        document.getElementById('error-contact').classList.remove('hidden');
        hasError = true;
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        const input = document.querySelector('[name="email"]');
        input.classList.add('border-red-500');
        document.getElementById('error-email').textContent = 'Invalid email address';
        document.getElementById('error-email').classList.remove('hidden');
        hasError = true;
    }

    // Guardian Contact
    if (!/^\d{10}$/.test(data.guardian_contact)) {
        const input = document.querySelector('[name="guardian_contact"]');
        input.classList.add('border-red-500');
        document.getElementById('error-guardian_contact').textContent = 'Guardian Contact must be a 10-digit number';
        document.getElementById('error-guardian_contact').classList.remove('hidden');
        hasError = true;
    }

    if (hasError) {
        hideLoader();
        return;
    }

    // If no errors, proceed to submit
    try {
        const response = await fetch(APP_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            alert('Cadet registered successfully!');
            e.target.reset();
            loadDashboardStats();
            showScreen('dashboard');
        } else {
            errorDiv.textContent = result.error || 'Registration failed. Please try again.';
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        errorDiv.textContent = 'Registration failed. Please try again.';
        errorDiv.classList.remove('hidden');
    }
    hideLoader();
});



async function loadCadetTable() {
    showLoader();
    try {
        // Get all districts
        const districtsRes = await fetch(`${APP_URL}?action=districts`);
        const districtsData = await districtsRes.json();
        let allCadets = [];
        for (const district of districtsData.districts) {
            const cadetRes = await fetch(`${APP_URL}?action=cadets&district=${encodeURIComponent(district)}`);
            const cadetData = await cadetRes.json();
            if (cadetData.success) {
                allCadets = allCadets.concat(cadetData.cadets.map(cadet => ({
                    ...cadet,
                    District: district
                })));
            }
        }
        renderCadetTable(allCadets);
    } catch (error) {
        console.error('Error loading cadets:', error);
    }
    hideLoader();
}

function renderCadetTable(cadets) {
    const tbody = document.getElementById('cadetTableBody');
    tbody.innerHTML = '';
    cadets.forEach((cadet, idx) => {
        const cadetId = `${cadet.Timestamp}_${cadet.District}`;
        tbody.innerHTML += `
        <tr>
            <td class="py-2 px-2">${cadet['Cadet Number'] || ''}</td>
            <td class="py-2 px-2">${cadet.Name}</td>
            <td class="py-2 px-2"><span class="bg-olive-100 text-olive-800 px-3 py-1 rounded-full text-sm">${cadet.Rank}</span></td>
            <td class="py-2 px-2">${cadet.Contact}</td>
            <td class="py-2 px-2">${cadet.Gender}</td>
            <td class="py-2 px-2">${cadet['School Name']}</td>
            <td class="py-2 px-2">${cadet.District}</td>
            <td class="py-2 px-2">
                <div class="flex gap-2">
                    <button class="text-blue-600 hover:text-blue-800" onclick="viewCadet('${cadetId}')"><i class="fas fa-eye"></i></button>
                    <button class="text-olive-600 hover:text-olive-800" onclick="editCadet('${cadetId}')"><i class="fas fa-edit"></i></button>
                    <button class="text-red-600 hover:text-red-800" onclick="deleteCadet('${cadetId}')"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        </tr>
    `;
    });
    window.cadetList = cadets; // Store for later use
}

function showModal(cadet) {
    // Fill modal fields
    document.getElementById('cadetModalName').textContent = cadet.Name || '';
    document.getElementById('cadetModalRank').textContent = cadet.Rank || '';
    document.getElementById('cadetModalDistrict').textContent = cadet.District || '';
    document.getElementById('cadetModalContact').textContent = cadet.Contact || '';
    document.getElementById('cadetModalGender').textContent = cadet.Gender || '';
    document.getElementById('cadetModalSchool').textContent = cadet['School Name'] || '';
    document.getElementById('cadetModalBatch').textContent = cadet['NCC Batch'] || '';
    document.getElementById('cadetModalPassout').textContent = cadet['Passout Year'] || '';
    document.getElementById('cadetModalEmail').textContent = cadet.Email || '';
    document.getElementById('cadetModalAddress').textContent = cadet.Address || '';
    document.getElementById('cadetModalGuardianName').textContent = cadet['Guardian Name'] || '';
    document.getElementById('cadetModalGuardianContact').textContent = cadet['Guardian Contact'] || '';
    document.getElementById('cadetModalRelation').textContent = cadet.Relation || '';
    document.getElementById('cadetModalCadetNo').textContent = cadet['Cadet Number'] || '';
    document.getElementById('cadetModal').classList.remove('hidden');
}

// Close modal logic
document.getElementById('closeCadetModal').addEventListener('click', () => {
    document.getElementById('cadetModal').classList.add('hidden');
});
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.getElementById('cadetModal').classList.add('hidden');
});

// Update viewCadet to use showModal
function viewCadet(cadetId) {
    const cadet = window.cadetList.find(c => `${c.Timestamp}_${c.District}` === cadetId);
    if (!cadet) return;
    showModal(cadet);
}

function editCadet(cadetId) {
    const cadet = window.cadetList.find(c => `${c.Timestamp}_${c.District}` === cadetId);
    if (!cadet) return;

    // Set all form fields
    document.getElementById('editCadetNo').value = cadet['Cadet Number'] || '';
    document.getElementById('editOriginalCadetNo').value = cadet['Cadet Number'] || '';
    document.getElementById('editName').value = cadet.Name || '';
    document.getElementById('editRank').value = cadet.Rank || '';
    document.getElementById('editContact').value = cadet.Contact || '';
    document.getElementById('editGender').value = cadet.Gender || '';
    document.getElementById('editSchool').value = cadet['School Name'] || '';
    document.getElementById('editBatch').value = cadet['NCC Batch'] || '';
    document.getElementById('editPassoutYear').value = cadet['Passout Year'] || '';
    document.getElementById('editDistrict').value = cadet.District || '';
    document.getElementById('editAddress').value = cadet.Address || '';
    document.getElementById('editEmail').value = cadet.Email || '';
    document.getElementById('editGuardianName').value = cadet['Guardian Name'] || '';
    document.getElementById('editGuardianContact').value = cadet['Guardian Contact'] || '';
    document.getElementById('editRelation').value = cadet.Relation || '';

    document.getElementById('editCadetModal').classList.remove('hidden');
}





// Edit form submission
document.getElementById('editCadetForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    showLoader();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.action = "edit";

    try {
        const response = await fetch(APP_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
            alert('Cadet updated successfully!');
            document.getElementById('editCadetModal').classList.add('hidden');
            loadCadetTable(); // Refresh the table
        } else {
            alert('Update failed: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Update failed. Please try again.');
    } finally {
        hideLoader();
    }
});
document.getElementById('closeEditCadetModal').addEventListener('click', function () {
    document.getElementById('editCadetModal').classList.add('hidden');
});

function deleteCadet(cadetId) {
    if (!confirm('Are you sure you want to delete this cadet?')) return;
    const cadet = window.cadetList.find(c => `${c.Timestamp}_${c.District}` === cadetId);
    if (!cadet) return alert('Cadet not found.');

    showLoader();

    fetch(APP_URL, {
        method: 'POST',
        body: JSON.stringify({
            action: 'delete',
            cadet_no: cadet['Cadet Number'],
            district: cadet.District
        })
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert('Cadet deleted successfully!');
                loadCadetTable();
            } else {
                alert('Delete failed: ' + (result.error || 'Unknown error'));
            }
        })
        .catch(() => alert('Delete failed. Please try again.'))
        .finally(hideLoader);
}



// Reports functionality
// Initialize reports functionality
function initReports() {
    // Navigation between report sections
    const navLinks = document.querySelectorAll('[data-route]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const route = this.getAttribute('data-route');
            navigateToReports(route);
        });
    });

    // View report buttons
    const viewButtons = document.querySelectorAll('.view-report');
    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const reportId = this.getAttribute('data-id');
            navigateToReports('view', reportId);
        });
    });

    // Initialize dynamic form elements
    initDynamicForms();

    // Initialize total participants calculation
    initParticipantCounter();
}

function navigateToReports(route, id = null) {
    // Hide all report sections
    document.querySelectorAll('#reports .report-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the requested section
    if (route === 'overview') {
        document.getElementById('overview-section').classList.add('active');
        updateActiveNavReports('overview');
    } else if (route === 'create') {
        document.getElementById('create-section').classList.add('active');
        updateActiveNavReports('create');
    } else if (route === 'view') {
        document.getElementById('view-section').classList.add('active');
        // In a real app, we would fetch report data based on the ID
        updateActiveNavReports('view');
    }
}

function updateActiveNavReports(activeRoute) {
    // Update navigation highlighting within reports
    const navLinks = document.querySelectorAll('[data-route]');
    navLinks.forEach(link => {
        if (link.getAttribute('data-route') === activeRoute) {
            link.classList.remove('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
            link.classList.add('border-primary', 'text-dark', 'hover:bg-gray-50');
        } else {
            link.classList.remove('border-primary', 'text-dark', 'hover:bg-gray-50');
            link.classList.add('border-transparent', 'text-gray-500', 'hover:border-gray-300', 'hover:text-gray-700');
        }
    });
}

function initDynamicForms() {
    // Add guest functionality
    const addGuestBtn = document.getElementById('add-guest');
    const guestsContainer = document.getElementById('guests-container');

    if (addGuestBtn && guestsContainer) {
        addGuestBtn.addEventListener('click', function () {
            const guestEntry = document.querySelector('.guest-entry').cloneNode(true);
            guestEntry.querySelectorAll('input, select').forEach(input => {
                input.value = '';
            });
            guestsContainer.appendChild(guestEntry);

            // Add event listener to remove button
            const removeBtn = guestEntry.querySelector('.remove-guest');
            removeBtn.addEventListener('click', function () {
                if (document.querySelectorAll('.guest-entry').length > 1) {
                    this.closest('.guest-entry').remove();
                    calculateTotalParticipants();
                }
            });

            // Add event listener to service select for rank options
            const serviceSelect = guestEntry.querySelector('select[name="guest-service[]"]');
            serviceSelect.addEventListener('change', function () {
                updateRankOptions(this);
            });
        });
    }

    // Add participant functionality
    const addParticipantBtn = document.getElementById('add-participant');
    const participantsContainer = document.getElementById('participants-container');

    if (addParticipantBtn && participantsContainer) {
        addParticipantBtn.addEventListener('click', function () {
            const participantEntry = document.querySelector('.participant-entry').cloneNode(true);
            participantEntry.querySelectorAll('input, select').forEach(input => {
                input.value = '';
            });
            participantsContainer.appendChild(participantEntry);

            // Add event listener to remove button
            const removeBtn = participantEntry.querySelector('.remove-participant');
            removeBtn.addEventListener('click', function () {
                if (document.querySelectorAll('.participant-entry').length > 1) {
                    this.closest('.participant-entry').remove();
                    calculateTotalParticipants();
                }
            });

            // Add event listener to count input
            const countInput = participantEntry.querySelector('input[name="participant-count[]"]');
            countInput.addEventListener('input', calculateTotalParticipants);
        });
    }

    // Initialize remove buttons for existing entries
    document.querySelectorAll('.remove-guest').forEach(btn => {
        btn.addEventListener('click', function () {
            if (document.querySelectorAll('.guest-entry').length > 1) {
                this.closest('.guest-entry').remove();
                calculateTotalParticipants();
            }
        });
    });

    document.querySelectorAll('.remove-participant').forEach(btn => {
        btn.addEventListener('click', function () {
            if (document.querySelectorAll('.participant-entry').length > 1) {
                this.closest('.participant-entry').remove();
                calculateTotalParticipants();
            }
        });
    });

    // Initialize service selects for rank options
    document.querySelectorAll('select[name="guest-service[]"]').forEach(select => {
        select.addEventListener('change', function () {
            updateRankOptions(this);
        });
    });
}

function initParticipantCounter() {
    // Add event listeners to count inputs
    document.querySelectorAll('input[name="participant-count[]"]').forEach(input => {
        input.addEventListener('input', calculateTotalParticipants);
    });

    // Initial calculation
    calculateTotalParticipants();
}

function calculateTotalParticipants() {
    let total = 0;

    // Count guests (each guest entry with a name counts as 1)
    document.querySelectorAll('input[name="guest-name[]"]').forEach(input => {
        if (input.value.trim() !== '') {
            total += 1;
        }
    });

    // Count participants from participant counts
    document.querySelectorAll('input[name="participant-count[]"]').forEach(input => {
        const count = parseInt(input.value) || 0;
        total += count;
    });

    // Update the total display
    const totalElement = document.getElementById('total-participants');
    if (totalElement) {
        totalElement.textContent = total;
    }
}

function updateRankOptions(selectElement) {
    const service = selectElement.value;
    const rankSelect = selectElement.parentElement.nextElementSibling.querySelector('select');

    // Clear existing options
    rankSelect.innerHTML = '<option value="">Select Rank</option>';

    // Add options based on service
    if (service === "police") {
        const ranks = [
            "Deputy Inspector General (DIG)",
            "Senior Superintendent of Police (SSP)",
            "Superintendent of Police (SP)",
            "Deputy Superintendent of Police (DSP)",
            "Inspector",
            "Assistant Sub-Inspector",
            "Sub-Inspector",
            "Constable"
        ];

        ranks.forEach(rank => {
            const option = document.createElement('option');
            option.value = rank.toLowerCase().replace(/\s+/g, '_');
            option.textContent = rank;
            rankSelect.appendChild(option);
        });
    } else if (service === "nccaa") {
        const ranks = [
            "Central Director",
            "Province Director",
            "District Director",
            "Central Co-Director",
            "Province Co-Director",
            "District Co-Director",
            "District Member",
            "Province Member",
            "Central Member"
        ];

        ranks.forEach(rank => {
            const option = document.createElement('option');
            option.value = rank.toLowerCase().replace(/\s+/g, '_');
            option.textContent = rank;
            rankSelect.appendChild(option);
        });
    } else if (service === "army") {
        const ranks = [
            "Chief of Army Staff (COAS)",
            "General",
            "Lieutenant General",
            "Major General",
            "Brigadier General",
            "Colonel",
            "Lieutenant Colonel",
            "Major",
            "Captain",
            "Lieutenant",
            "Second Lieutenant"
        ];

        ranks.forEach(rank => {
            const option = document.createElement('option');
            option.value = rank.toLowerCase().replace(/\s+/g, '_');
            option.textContent = rank;
            rankSelect.appendChild(option);
        });
    }
}
// Close sidebar function
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').style.display = 'none';
    document.body.classList.remove('sidebar-open');
}

// Set up event listeners
document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').style.display = 'block';
    document.body.classList.add('sidebar-open');
});
