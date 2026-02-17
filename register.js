document.addEventListener("DOMContentLoaded", () => {
    // 1. ตั้งค่า Supabase
    const supabaseUrl = "https://rdzcyeprmpkhwskfeydt.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkemN5ZXBybXBraHdza2ZleWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NzgyNDMsImV4cCI6MjA4NjU1NDI0M30.p338Q-WCZWddgY89kFfpt7oUN7640u3lQ2hiC2KYy0Q"; // ใช้ Anon Key ของคุณ
    const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

    let selectedRole = 'parent'; // ค่าเริ่มต้น

    // 2. สลับ Role (ผู้ปกครอง/ติวเตอร์)
    const roles = document.querySelectorAll(".choose-role");
    roles.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            roles.forEach((b) => b.style.border = "none"); // ลบไฮไลท์เก่า
            btn.style.border = "2px solid #2bca46"; // เพิ่มไฮไลท์ (หรือใช้ class แทน)
            btn.style.backgroundColor = "#70f185";
            // index 0 = parent, 1 = tutor (อิงตามลำดับใน HTML ของคุณ)
            selectedRole = (index === 0) ? 'parent' : 'tutor';
            console.log("Selected Role:", selectedRole);
        });
    });

    // 3. Toggle Password
    const eyeIcons = document.querySelectorAll("#eye");
    const passInputs = document.querySelectorAll('input[type="password"]');
    
    eyeIcons.forEach((eye, index) => {
        eye.addEventListener("click", () => {
            const input = passInputs[index];
            if (input.type === "password") {
                input.type = "text";
                eye.classList.replace("bi-eye-slash", "bi-eye-fill");
            } else {
                input.type = "password";
                eye.classList.replace("bi-eye-fill", "bi-eye-slash");
            }
        });
    });

    // 4. ฟังก์ชันสมัครสมาชิก (ผูกกับปุ่ม .regist-btn ใน HTML)
    const registBtn = document.querySelector(".regist-btn");
    
    if (registBtn) {
        registBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            // ดึงค่าจากฟอร์ม
            const email = document.querySelector('input[name="mail"]').value;
            const passwords = document.querySelectorAll('input[type="password"]');
            const password = passwords[0].value;
            const confirmPassword = passwords[1].value;

            const fname = document.querySelector('input[name="fname"]').value;
            const lname = document.querySelector('input[name="lname"]').value;
            
            // ดึงค่ากลุ่มช่องติดต่อ (ใช้ Array index เพราะ name ซ้ำกัน)
            const contactInputs = document.querySelectorAll('.contact-right input');
            const phone = contactInputs[0].value;
            const line = contactInputs[1].value;
            const fb = contactInputs[2].value;

            if (password !== confirmPassword) {
                alert("รหัสผ่านไม่ตรงกัน!");
                return;
            }

            // --- STEP 1: สร้าง User ใน Supabase Auth ---
            const { data, error: authError } = await _supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (authError) {
                alert("Auth Error: " + authError.message);
                return;
            }

            // --- STEP 2: บันทึกลงตาราง (Parents หรือ Tutors) ---
            if (data.user) {
                const tableName = (selectedRole === 'parent') ? 'parents' : 'tutors';
                
                const { error: insertError } = await _supabase
                    .from(tableName)
                    .insert([{
                        id: data.user.id,
                        first_name: fname,
                        last_name: lname,
                        tel: phone,
                        line_id: line,
                        facebook: fb
                    }]);

                if (insertError) {
                    alert("Database Error: " + insertError.message);
                } else {
                    alert("สมัครสมาชิกสำเร็จ! กรุณาเช็คอีเมลเพื่อยืนยันตัวตน");
                    // window.location.href = "login.html"; // ย้ายหน้าเมื่อสำเร็จ
                }
            }
        });
    }
});