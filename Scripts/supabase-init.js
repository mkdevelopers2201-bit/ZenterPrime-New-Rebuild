const supabaseUrl = 'https://rfkitszqowshaoqkltit.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJma2l0c3pxb3dzaGFvcWtsdGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDMwODUsImV4cCI6MjA4ODExOTA4NX0.OOzrIvJTEoJ0De3eVD7qCaouMyl6e_Er-bY5tAUXrH8';

const { createClient } = supabase;
window.supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase initialized successfully.");