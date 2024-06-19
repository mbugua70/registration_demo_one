const loginEl = document.getElementById("frmSignIn");
const checkLog = document.getElementById("check_login");
const btnEl = document.getElementById("btn-textcontent");

const user = localStorage.getItem("user");

let isSubmitting;
btnEl.textContent = "Login";
loginEl.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();
    const formData = new FormData(loginEl);
    const loginData = {
      name: formData.get("name"),
      password: formData.get("password"),
    };

    isSubmitting = true;
    btnEl.textContent = "Submitting...";
    if (loginData.name === "" || loginData.password === "") {
      isSubmitting = false;
      btnEl.textContent = "Login";
      appNotifier("Please fill in all the required field!");
      $("input").focus();
    } else {
      try {
        const response = await fetch(
          "http://localhost:4040/api/report/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          }
        );
        isSubmitting = false;
        btnEl.textContent = "Login";
        if (response.ok) {
          isSubmitting = false;
          btnEl.textContent = "Login";
          const data = await response.json();

          localStorage.setItem("user", JSON.stringify(data));

          workingNotifier("Login successfully");
          setTimeout(function () {
            location.href = "/backend_spin/spin_backend/dashboards/index.html";
          }, 2000);
        }
        if (!response.ok) {
          isSubmitting = false;
          btnEl.textContent = "Login";
          const data = await response.json();

          if (
            data.error === "The username does not exist" ||
            data.error === "Incorrect password"
          ) {
            isSubmitting = false;
            btnEl.textContent = "Login";
            appNotifier(data.error);
          }
          // throw new Error("Failed to fetch");
          console.log()
        }
      } catch (error) {
        isSubmitting = false;
        btnEl.textContent = "Login";
        // appNotifier("Failed to fetch");
        console.log(error);
      }
    }
  },
  false
);

const workingNotifier = (message) => {
  swal({
    buttonsStyling: !1,
    button: "Ok, got it!",
    customClass: { confirmButton: "btn btn-primary" },
    title: message,
    text: "",
    icon: "success",
  });
};

//   swal libraly
function appNotifier(message) {
  swal({
    buttonsStyling: !1,
    button: "Ok, got it!",
    customClass: { confirmButton: "btn btn-primary" },
    title: message,
    text: "",
    icon: "error",
  });
}
