const giftForm = document.getElementById("giftForm");
const createGiftEl = document.getElementById("gift-create");
const addForm = document.getElementById("addFormGift");

let selectedIdGift;
async function fetchTableData() {
  const starting_time = Date.now();
  try {
    const response = await fetch(`http://localhost:4040/api/report/gifts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
    console.error("Error fetching  data:", error);
    return [];
  }
}

let packageCounter = 1;

// function to generate the card HTML for each package
const generateCard = async (tableData) => {
  //  console.log(packageStatus);
  return `
    <tr>
    <td>
     ${tableData.text}
    </td>
    <td>
      ${tableData.gift_number}
    </td>
    <td>
    ${tableData.fillStyle}
    </td>
    <td>
    ${tableData.textFillStyle}
    </td>
    <td>
    ${tableData.strokeStyle}
    </td>
    <td>
    <button type="button" class="btn btn-edit btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo" data-gift-id="${tableData._id}">EDIT</button>
    </td>
    <td>
    <button type="button" class="btn btn-delete btn-danger"   data-delete-id="${tableData._id}" style="display: flex; align-items: center;">DELETE</button>
    </td>
  </tr>
        `;
};

// function to display the cards

async function displayPackages() {
  const tableContainer = document.getElementById("table-container");
  tableContainer.innerHTML = "";

  const tableDatashow = await fetchTableData();
  if (tableDatashow.giftReport.length === 0) {
    const tableContainer = document.getElementById("table-container");
    // const message = `<p> You don't have an </p>`;
    // cardContainer.innerHTML = message;
  } else {
    tableDatashow.giftReport.forEach(async (packageType) => {
      const cardHTML = await generateCard(packageType);
      tableContainer.innerHTML += cardHTML;
    });
  }
}

const handleFetchUpdateForm = async (e) => {
  const marchandizeId = e.target.dataset.giftId;
  selectedIdGift = marchandizeId;
  try {
    const res = await fetch(
      `http://localhost:4040/api/report/gifts/${marchandizeId}`,
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
      const text = document.getElementById("text");
      const fillStyle = document.getElementById("fillStyle");
      const textFillStyle = document.getElementById("textFillStyle");
      const gift_number = document.getElementById("gift_number");
      const strokeStyle = document.getElementById("strokeStyle");

      // dyanamically filling the form values
      text.value = data.SingleGift.text;
      fillStyle.value = data.SingleGift.fillStyle;
      textFillStyle.value = data.SingleGift.textFillStyle;
      gift_number.value = data.SingleGift.gift_number;
      strokeStyle.value = data.SingleGift.strokeStyle;
    }
  } catch (error) {
    console.log("Failed to fetch:", error);
  }
};

giftForm.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();
    const marchandizeId = selectedIdGift;

    const giftData = new FormData(giftForm);

    const text = giftData.get("text");
    const fillStyle = giftData.get("fillStyle");
    const textFillStyle = giftData.get("textFillStyle");
    const strokeStyle = giftData.get("strokeStyle");
    const gift_number = giftData.get("gift_number");

    const updatedValues = {
      text: text,
      fillStyle: fillStyle,
      textFillStyle: textFillStyle,
      strokeStyle: strokeStyle,
      gift_number: gift_number,
    };

    try {
      const res = await fetch(
        `http://localhost:4040/api/report/gifts/${marchandizeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedValues),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update the marchandize");
      }

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        workingNotifier("Marchandize Updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      appNotifier("Failed to update the marchandize");
    }
  },
  false
);

// handle add marchandize

addForm.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();
    const addedData = new FormData(addForm);

    const text = addedData.get("text");
    const fillStyle = addedData.get("fillStyle");
    const textFillStyle = addedData.get("textFillStyle");
    const strokeStyle = addedData.get("strokeStyle");
    const gift_number = addedData.get("gift_number");

    const addedValue = {
      text: text,
      fillStyle: fillStyle,
      textFillStyle: textFillStyle,
      strokeStyle: strokeStyle,
      gift_number: gift_number,
    };

    if (
      addedValue.text === "" ||
      addedValue.fillStyle === "" ||
      addedValue.textFillStyle === "" ||
      addedValue.strokeStyle === "" ||
      addedValue.gift_number === ""
    ) {
      appNotifier("Please fill in all the required fields");
    }

    try {
      const res = await fetch("http://localhost:4040/api/report/gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addedValue),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        workingNotifier("Marchandize added successufully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log();
    }
  },

  false
);

// handleDelete function
const handleDeleteClick = async (e) => {
  const giftId = e.target.dataset.deleteId;
  try {
    const res = await fetch(
      `http://localhost:4040/api/report/gifts/${giftId}`,
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
      workingNotifier("Marchandize deleted successfully");
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
  const exampleModal = document.getElementById("exampleModal");
  if (exampleModal) {
    exampleModal.addEventListener("show.bs.modal", (event) => {});
  }
};

const openModalTwo = () => {
  const exampleModalTwo = document.getElementById("exampleModalTwo");
  if (exampleModalTwo) {
    exampleModalTwo.addEventListener("show.bs.modal", (event) => {});
  }
};

// modal code delete
document.getElementById("table-container").addEventListener("click", (e) => {
  console.log("clicked");
  if (e.target.classList.contains("btn-delete")) {
    swalDelete(e);
  }
});

// modal code
document.getElementById("table-container").addEventListener("click", (e) => {
  console.log("clicked");
  if (e.target.classList.contains("btn-edit")) {
    openModal();
    handleFetchUpdateForm(e);
  }
});

createGiftEl.addEventListener(
  "click",
  () => {
    openModalTwo();
  },
  false
);
// code for package status
displayPackages();
