const userFormTwo = document.getElementById("usersFormEdit");
const createUserEl = document.getElementById("btn-adduser");
const userForm = document.getElementById("usersForm");

let selectedIdGlobal;
async function fetchUserData() {
  const starting_time = Date.now();
  try {
    const response = await fetch(
      `http://localhost:4040/api/report/user/getusers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch  data");
    }
    const data = await response.json();
    // const end_time = Date.now();
    // const loading_time = end_time - starting_time;
    // console.log("loading time:", loading_time);
    // if (loading_time) {
    //   const preloaderParent = document.querySelector(".preloader-parent");
    //   preloaderParent.style.display = "none";
    // } else {
    //   const preloaderParent = document.querySelector(".preloader-parent");
    //   preloaderParent.style.display = "flex";
    // }
    return data;
  } catch (error) {
    return [];
  }
}

let packageCounter = 1;

// function to generate the card HTML for each package
const generateCard = async (userData) => {
  return `
    <tr>
    <td>
     ${userData.name}
    </td>
    <td id="showpassword">
      <input type="password" value= ${userData.password} style="border-style: none; outline: none; appearance: none; background-color: transparent; " readOnly/>
    </td>
    <td style="display: flex; flex-direction: row; column-gap: 10px;">
    <button type="button" class="btn btn-edit btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModalUserEdit" data-gift-id="${userData._id}">EDIT</button>
    <button type="button" class="btn btn-delete btn-danger"   data-delete-id="${userData._id}" style="display: flex; align-items: center;">DELETE</button>
    </td>
    <td>

    </td>
  </tr>
        `;
};

// function to display the cards

async function displayPackages() {
  const tableContainer = document.getElementById("table_usercontainer");
  tableContainer.innerHTML = "";

  const tableDatashow = await fetchUserData();
  if (tableDatashow.UserReport.length === 0) {
    const tableContainer = document.getElementById("table_usercontainer");
    // const message = `<p> You don't have an </p>`;
    // cardContainer.innerHTML = message;
  } else {
    tableDatashow.UserReport.forEach(async (users) => {
      const cardHTML = await generateCard(users);
      tableContainer.innerHTML += cardHTML;
    });
  }
}

const handleFetchUpdateForm = async (e) => {
  const userId = e.target.dataset.giftId;
  selectedIdGlobal = userId;
  try {
    const res = await fetch(
      `http://localhost:4040/api/report/user/getusers/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    if (res.ok) {
      const data = await res.json();
      const names = document.getElementById("names");
      const passwords = document.getElementById("passwords");

      // dyanamically filling the form values
      names.value = data.SingleUser.name;
      passwords.value = data.SingleUser.password;
    }
  } catch (error) {}
};

userFormTwo.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();
    const usersId = selectedIdGlobal;

    const giftData = new FormData(userFormTwo);

    const username = giftData.get("names");
    const userpassword = giftData.get("passwords");

    const updatedValues = {
      name: username,
      password: userpassword,
    };

    try {
      const res = await fetch(
        `http://localhost:4040/api/report/user/update/${usersId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedValues),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update the user");
      }

      if (res.ok) {
        const data = await res.json();
        workingNotifier("User Updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      appNotifier("Failed to update the user");
    }
  },
  false
);

// handle add user

userForm.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();
    const addedData = new FormData(userForm);

    const username = addedData.get("name");
    const password = addedData.get("password");

    const addedValue = {
      name: username,
      password: password,
    };

    if (addedValue.name === "" || addedValue.password === "") {
      appNotifier("Please fill in all the required fields");
    }

    try {
      const res = await fetch("http://localhost:4040/api/report/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addedValue),
      });

      if (!res.ok) {
        const dataError = await res.json();
        if (dataError.error !== "Password is not strong enough") {
          throw new Error("Failed to fetch");
        }
        appNotifierEdit(dataError.error);
      }

      if (res.ok) {
        const data = await res.json();
        workingNotifier("User added successufully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      appNotifierEdit("Failed to fetch");
    }
  },

  false
);

// handleDelete function
const handleDeleteClick = async (e) => {
  const usersId = e.target.dataset.deleteId;
  try {
    const res = await fetch(
      `http://localhost:4040/api/report/user/deleteuser/${usersId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete marchandize");
    }
    if (res.ok) {
      const data = await res.json();
      workingNotifierEdit("User deleted successfully");
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  } catch (error) {
    appNotifier("Failed to delete marchandize");
  }
};

// deleting marchandize
const swalDelete = (e) => {
  new swal({
    title: "confirmation",
    text: "Are you sure you want to proceed?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "yes",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      return new Promise((resolve) => {
        handleDeleteClick(e);
        resolve();
      });
    },
  }).then((result) => {
    if (result.isConfirmed) {

    } else if (result.dismiss === swal.DismissReason.cancel) {
      //    new swal("Action");
    }
  });
};

// opening modal

const openModal = () => {
  const exampleModal = document.getElementById("exampleModalUserEdit");
  if (exampleModal) {
    exampleModal.addEventListener("show.bs.modal", (event) => {});
  }
};

const openModalTwo = () => {
  const exampleModalUsers = document.getElementById("exampleModalUser");
  if (exampleModalUsers) {
    exampleModalUsers.addEventListener("show.bs.modal", (event) => {});
  }
};

// modal code delete

// modal code
document
  .getElementById("table_usercontainer")
  .addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-edit")) {
      openModal();
      handleFetchUpdateForm(e);
    }
  });

document
  .getElementById("table_usercontainer")
  .addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
     swalDelete(e);
    }
  });

createUserEl.addEventListener(
  "click",
  () => {
    openModalTwo();
  },
  false
);

// swal libraly
const workingNotifierEdit = (message) => {
  new Swal({
    title: message,
    text: "",
    icon: "success",
  });
};

//   swal libraly
function appNotifierEdit(message) {
  new Swal({
    title: message,
    text: "",
    icon: "warning",
  });
}

displayPackages();
