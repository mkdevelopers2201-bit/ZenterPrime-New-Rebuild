let allCompanies = []; 

document.addEventListener('DOMContentLoaded', () => {
    fetchCompanies();

    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            const filtered = allCompanies.filter(company => {
                const nameMatch = company.name.toLowerCase().includes(query);
                const gstMatch = company.gst_no && company.gst_no.toLowerCase().includes(query);
                return nameMatch || gstMatch;
            });

            renderCompanies(filtered);
        });
    }

    const createForm = document.getElementById('create-company-form');
    if (createForm) {
        createForm.addEventListener('submit', handleCreateCompany);
    }
});

async function fetchCompanies() {
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

    allCompanies = companies; 
    renderCompanies(allCompanies);
}

function renderCompanies(companies) {
    const container = document.getElementById('companies-list');
    if (!container) return;
    
    container.innerHTML = '';

    if (companies.length === 0) {
        container.innerHTML = '<p style="color: #64748b; margin-top: 20px; text-align: center; width: 100%;">No companies found.</p>';
        return;
    }

    companies.forEach(company => {
        const card = document.createElement('div');
        card.className = 'default-company';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin: 0; color: #163953;">${company.name}</h3>
                    <p style="margin: 5px 0; color: #64748b; font-size: 0.9rem;">Created by: ${company.gst_no || 'N/A'}</p>
                </div>
                <div class="company-configuration-btn">
                    <button class="edit-company"><span class="material-symbols-outlined">edit</span></button>
                    <button class="delete-company"><span class="material-symbols-outlined">delete</span></button>
                    <button class="visit-company" onclick="visitCompany('${company.id}')">
                        <span class="material-symbols-outlined">chevron_right</span>
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
    const modal = document.getElementById('company-modal');
    if (modal) modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('company-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('create-company-form').reset();
    }
}

function visitCompany(id) {
    localStorage.setItem('active_company_id', id);
    window.location.href = 'dashboard.html';
}