async function fetchCompanies() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Taking companies from Supabase
    const { data: companies, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching companies:', error);
        return;
    }

    renderCards(companies);
}

async function renderCompanies() {
    const container = document.getElementById('companies-list');

    // 1. Fetching Data from Supabase
    const { data: companies, error } = await supabase
        .from('companies')
        .select('*');

    if (error) {
        console.error("Error fetching:", error);
        return;
    }

    // 2. Clearing Old Data
    container.innerHTML = '';

    // 3. Loop through companies and create cards
    companies.forEach(company => {
        const card = document.createElement('div');
        card.className = 'default-company';

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin: 0; color: #163953;">${company.name}</h3>
                    <p style="margin: 5px 0; color: #64748b; font-size: 0.9rem;">GST: ${company.gst_no || 'N/A'}</p>
                </div>
                <div class="actions">
                    <button class="visit-company" onclick="goToDashboard('${company.id}')">
                        <span class="material-symbols-outlined">visibility</span> Visit
                    </button>
                    <button class="edit-company" onclick="editCompany('${company.id}')">
                        <span class="material-symbols-outlined">edit</span> Edit
                    </button>
                    <button class="delete-company" onclick="deleteCompany('${company.id}')">
                        <span class="material-symbols-outlined">delete</span> Delete
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Function to Enter any Company
function goToDashboard(id) {
    localStorage.setItem('selected_company_id', id);
    window.location.href = 'index.html';
}

// Modal Functions
function openModal() {
    document.getElementById('company-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('company-modal').style.display = 'none';
    document.getElementById('create-company-form').reset();
}

// Form Submit
document.getElementById('create-company-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Form Submit Started..."); // Debugging ke liye

    // Pehle User ID uthao
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("Session expired! Please login again.");
        window.location.href = 'login.html';
        return;
    }

    const name = document.getElementById('comp-name').value;
    const gst = document.getElementById('comp-gst').value;

    // Insert karte waqt user_id manually pass karo
    const { data, error } = await supabase
        .from('companies')
        .insert([
            { 
                name: name, 
                gst_no: gst, 
                user_id: user.id  // Yeh bahut zaruri hai
            }
        ])
        .select();

    if (error) {
        console.error("Supabase Error:", error); // Console check karo!
        alert("Error: " + error.message);
    } else {
        console.log("Success:", data);
        closeModal();
        renderCompanies(); // Refresh the list
    }
});