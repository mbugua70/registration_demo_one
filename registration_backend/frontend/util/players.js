const inputSearch = document.getElementById("input-searchplayer");

fetchTableData();

inputSearch.addEventListener(
  "input",
  async () => {
    const query = inputSearch.value.trim();
    if (query === "") {
      fetchTableData();
    }

    try {
      const res = await fetch(
        `http://localhost:4040/api/report/general/players/?q=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      if (res.ok) {
        displayPackages(data);
      }
    } catch (error) {
      // appNotifier("Failed to fetch");
    }
  },
  false
);

async function fetchTableData() {
  const starting_time = Date.now();
  try {
    const response = await fetch(
      `http://localhost:4040/api/report/general/players/?q=`,
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
    displayPackages(data);
  } catch (error) {
    console.error("Error fetching  data:", error);
    // appNotifier("Failed to fetch data");
  }
}

let packageCounter = 1;

// function to generate the card HTML for each package
const generateCard = async (tableData) => {
  //  console.log(packageStatus);
  return `
    <tr>
    <td>
     ${tableData.player_email}
    </td>
    <td>
      ${tableData.player_phone}
    </td>
  </tr>
        `;
};

// function to display the cards

async function displayPackages(tableDatashow) {
  const tableContainer = document.getElementById("table-container");
  tableContainer.innerHTML = "";

  if (tableDatashow.generalReport.length > 0) {
    tableDatashow.generalReport.forEach(async (packageType) => {
      const cardHTML = await generateCard(packageType);
      tableContainer.innerHTML += cardHTML;
    });
  }
  if (tableDatashow.generalReport.length === 0) {
    const tableContainer = document.getElementById("table-container");
    const message = `<p> You don't have an </p>`;
    cardContainer.innerHTML = message;
  } else {
  }
}
