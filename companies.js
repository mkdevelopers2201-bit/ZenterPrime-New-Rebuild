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