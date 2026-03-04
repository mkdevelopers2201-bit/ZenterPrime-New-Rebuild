// Global variables
var supabaseUrl = 'https://rfkitszqowshaoqkltit.supabase.co';
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma2l0c3pxb3dzaGFvcWtsdGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDMwODUsImV4cCI6MjA4ODExOTA4NX0.OOzrIvJTEoJ0De3eVD7qCaouMyl6e_Er-bY5tAUXrH8';

// Library check
if (typeof supabasejs !== 'undefined') {
    var supabase = supabasejs.createClient(supabaseUrl, supabaseKey);
    console.log("✅ ZenterPrime: Supabase Object Created!");
} else {
    console.error("❌ Error: Supabase CDN not loaded!");
}