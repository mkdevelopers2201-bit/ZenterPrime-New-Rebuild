document.addEventListener('DOMContentLoaded', async () => {
    const activeCompanyId = localStorage.getItem('active_company_id');

    // 1. Through back if company not selected
    if (!activeCompanyId) {
        window.location.href = 'companies.html';
        return;
    }

    // 2. Auth Check
    const { data: { user }, error: authError } = await window.supabase.auth.getUser();
    if (authError || !user) {
        window.location.href = 'login.html';
        return;
    }

    // 3. Fetch Company Data
    loadZentllyDashboard(activeCompanyId);
});

async function loadZentllyDashboard(companyId) {
    const { data: shop, error } = await window.supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

    if (error) {
        console.error("Zentlly Error:", error.message);
        return;
    }

    // Update UI with Shop Name
    document.getElementById('active-company-name').innerText = shop.name;
    
    const gstElement = document.getElementById('active-company-gst');
    if (gstElement) {
        gstElement.innerText = shop.gst_no ? `GST: ${shop.gst_no}` : "Personal/Non-GST";
    }

    console.log(`Welcome to ZentllyPrime: ${shop.name}`);
}