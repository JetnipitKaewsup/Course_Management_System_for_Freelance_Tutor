
document.addEventListener("DOMContentLoaded", () => {

    const eye = document.getElementById("eye");
    const password = document.getElementById("password");

    if (eye && password) {
        eye.addEventListener("click", () => {
            if (password.type === "password") {
                password.type = "text";
                eye.classList.replace("bi-eye-slash", "bi-eye-fill");
            } else {
                password.type = "password";
                eye.classList.replace("bi-eye-fill", "bi-eye-slash");
            }
        });
    }

    // Supabase config
    const supabaseUrl = 'https://rdzcyeprmpkhwskfeydt.supabase.co'
    const supabaseKey = 'sb_publishable_ZaiwZRZ6VuH8KgHmeAV4sQ_kEtaGkg6'

    const sb = supabase.createClient(supabaseUrl, supabaseKey)

    console.log("Supabase connected:", sb)

});

