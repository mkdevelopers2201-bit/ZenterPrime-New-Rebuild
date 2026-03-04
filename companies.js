document.addEventListener('DOMContentLoaded', () => {
    fetchCompanies();

    const createForm = document.getElementById('create-company-form');
    if (createForm) {
        createForm.addEventListener('submit', handleCreateCompany);
    }
});

async function fetchCompanies() {
    const container = document.getElementById('companies-list');
    if (!container) return;

    const { data: { user } } = await window.supabase.auth.getUser();
    if (!user) return;

    const { data: companies, error } = await window.supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching companies:', error);
        return;
    }

    renderCompanies(companies);
}

function renderCompanies(companies) {
    const container = document.getElementById('companies-list');
    container.innerHTML = '';

    companies.forEach(company => {
        const card = document.createElement('div');
        card.className = 'default-company';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin: 0; color: #163953;">${company.name}</h3>
                    <p style="margin: 5px 0; color: #64748b; font-size: 0.9rem;">Created by: ${company.gst_no || 'N/A'}</p>
                </div>
                <div class="actions">
                    <button class="visit-company" onclick="visitCompany('${company.id}')">
                        <span class="material-symbols-outlined">visibility</span> Visit
                    </button>
                    <button class="edit-company">
                        <span class="material-symbols-outlined">edit</span> Edit
                    </button>
                    <button class="delete-company">
                        <span class="material-symbols-outlined">delete</span> Delete
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

async function handleCreateCompany(e) {
    e.preventDefault();

    const name = document.getElementById('comp-name').value;
    const gst = document.getElementById('comp-gst').value;

    const { data: { user } } = await window.supabase.auth.getUser();

    const { error } = await window.supabase
        .from('companies')
        .insert([{
            name: name,
            gst_no: gst,
            user_id: user.id
        }]);

    if (error) {
        alert('Error creating company: ' + error.message);
    } else {
        closeModal();
        fetchCompanies();
    }
}

function openModal() {
    document.getElementById('company-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('company-modal').style.display = 'none';
    document.getElementById('create-company-form').reset();
}

function visitCompany(id) {
    localStorage.setItem('active_company_id', id);
    window.location.href = 'index.html';
}