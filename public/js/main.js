// Password Toggle
function togglePassword(id) {
  const input = document.getElementById(id);
  const icon = document.getElementById(id + "-icon");

  if (!input || !icon) return;

  if (input.type === "password") {
    input.type = "text";
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="pointer-events:none;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
      </svg>
    `;
  } else {
    input.type = "password";
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="pointer-events:none;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>
    `;
  }
}


// Custom Alert Box

const CustomAlert = {
  init() {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "alert-overlay";
    overlay.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      z-index: 99998;
      align-items: center;
      justify-content: center;
    `;

    // Create box
    const box = document.createElement("div");
    box.id = "alert-box";
    box.style.cssText = `
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 30px;
      width: 360px;
      text-align: center;
    `;

    box.innerHTML = `
      <div id="alert-icon" style="font-size: 36px; margin-bottom: 12px;"></div>
      <h3 id="alert-title" style="font-size: 18px; font-weight: 900; margin-bottom: 8px; color: #ffffff;"></h3>
      <p id="alert-message" style="font-size: 13px; color: #aaaaaa; margin-bottom: 24px; line-height: 1.6;"></p>
      <div id="alert-buttons" style="display: flex; gap: 10px; justify-content: center;"></div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);
    this.overlay = overlay;
  },

  show({ icon = "⚠️", title = "Alert", message = "", type = "info", onConfirm = null, onCancel = null, confirmText = "OK", cancelText = "Cancel" }) {
    if (!this.overlay) this.init();

    document.getElementById("alert-icon").textContent = icon;
    document.getElementById("alert-title").textContent = title;
    document.getElementById("alert-message").textContent = message;

    const buttons = document.getElementById("alert-buttons");
    buttons.innerHTML = "";

    // Confirm button
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = confirmText;
    confirmBtn.style.cssText = `
      padding: 10px 24px;
      background: #ff6b35;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 1px;
    `;
    confirmBtn.onclick = () => {
      this.hide();
      if (onConfirm) onConfirm();
    };
    buttons.appendChild(confirmBtn);

    // Cancel button (only if onCancel provided)
    if (onCancel !== null) {
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = cancelText;
      cancelBtn.style.cssText = `
        padding: 10px 24px;
        background: #1a1a1a;
        color: #aaaaaa;
        border: 1px solid #333;
        border-radius: 8px;
        font-size: 13px;
        cursor: pointer;
      `;
      cancelBtn.onclick = () => {
        this.hide();
        if (onCancel) onCancel();
      };
      buttons.appendChild(cancelBtn);
    }

    this.overlay.style.display = "flex";
  },

  hide() {
    if (this.overlay) {
      this.overlay.style.display = "none";
    }
  },

  confirm({ icon, title, message, confirmText, cancelText, onConfirm, onCancel }) {
    this.show({ icon, title, message, confirmText, cancelText, onConfirm, onCancel });
  }
};

// Init on load
document.addEventListener("DOMContentLoaded", () => {
  CustomAlert.init();
});

document.addEventListener("DOMContentLoaded", () => {
  const messages = document.querySelectorAll(".success-msg, .error-msg");
  messages.forEach((msg) => {
    setTimeout(() => {
      msg.style.transition = "opacity 0.5s";
      msg.style.opacity = "0";
      setTimeout(() => msg.remove(), 500);
    }, 3000);
  });
});


// Frontend Formvalidation

document.addEventListener("DOMContentLoaded",()=>{
  const registerForm = document.getElementById("registerForm");

  if(registerForm){
    registerForm.addEventListener("submit", (e)=>{

      let valid = true;

      clearErrors();

      const fullName = document.getElementById("fullname").value.trim()
      const username = document.getElementById("username").value.trim()
      const email = document.getElementById("email").value.trim()
      const phone = document.getElementById("phone").value.trim()
      const password = document.getElementById("password").value;


      if(!fullName){
        showError("fullName","Full name is required.")
        valid = false
      }else if (!/^[a-zA-Z\s]{3,50}$/.test(fullName)){
        showError("fullName","Name must be 3-50 letters only.")
        valid = false
      }

      if(!username){
        showError("username","username is required.");
        valid = false
      }else if(!/^[a-zA-Z0-9_]{3,20}$/.test(username)){
        showError("username","Username must be 3-20 chars, letters/numbers/underscore only.")
        valid = false 
      }

      if(!email){
        showError("email","Email is required.");
        valid = false;
      }else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)){
        showError("email","Enter a valid email address.")
        valid = false
      }

      if(!phone){
        showError("phone","Phone number is required")
        valid = false
      }else if (!/^\d{10}$/.test(phone)){
        showError("phone","Enter a valid 10-digit phone number.")
        valid = false
      }


      const storngPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if(!password){
        showError("password","Password is required.")
        valid = false
      }else if(!storngPassword.test(password)){
        showError("password","Password must be 8+ chars with uppercase, lowercase,number and special character")
        valid = false;
      }

      if(!valid) e.preventDefault()

    })
  }

  //Login Form

const loginForm = document.getElementById("loginForm")
if(loginForm){
  loginForm.addEventListener("submit",(e)=>{
    let valid = true;
    clearErrors();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if(!email){
      showError("email","Email is required")
      valid = false
    }else if(!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)){
      showError("email","Enter a valid email address")
      valid = false
    }

    if(!password){
      showError("password","Password is required")
      valid = false
    }

    if(!valid){
      e.preventDefault();
      Loader.finish();
    } 
  })
}
})

function showError(fieldId, message){
  const field = document.getElementById(fieldId);
  if(!field) return;

  const group = field.closest(".form-group") || field.parentElement;

  let error = group.querySelector(".fe-error");
  if(!error){
    error = document.createElement("span");
    error.className = "fe-error field-error";
    group.appendChild(error);
  }
  error.textContent = message;
  field.style.borderColor = "#ff4444";
}


function clearErrors(){
  document.querySelectorAll(".fe-error").forEach(e => e.remove());
  document.querySelectorAll("input").forEach(i => i.style.borderColor = "");
}

document.addEventListener("DOMContentLoaded", () => {
  // Clear autofilled values after page load
  setTimeout(() => {
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    if (emailField && emailField.value) emailField.value = "";
    if (passwordField && passwordField.value) passwordField.value = "";
  }, 100);
});