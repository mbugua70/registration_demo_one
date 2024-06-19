const inputSearch = document.getElementById("input-searchelement");

fetchTableData();

inputSearch.addEventListener(
  "input",
  async () => {
    console.log("checked");
    const query = inputSearch.value.trim();
    if (query === "") {
      fetchTableData();
    }
    try {
      const res = await fetch(
        `http://localhost:4040/api/report/general/?q=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      if (res.ok) {
        displayPackages(data);
      }
    } catch (error) {
      console.log(error);
    }
  },
  false
);

async function fetchTableData() {
  const starting_time = Date.now();
  try {
    const response = await fetch(
      `http://localhost:4040/api/report/general/?q=`,
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
  <td>
      <div class="badge">${tableData.player_marchandize}</div>
  </td>
  <td class="text-end pe-0">${tableData.createdAt}</td>
  <td class="text-end pe-0">${tableData.updatedAt}</td>
</tr>
      `;
};

// function to display the cards

async function displayPackages(generalData) {
  const tableContainer = document.getElementById("table-container");
  tableContainer.innerHTML = "";

  if (generalData.generalReport.length > 0) {
    generalData.generalReport.forEach(async (packageType) => {
      const cardHTML = await generateCard(packageType);
      tableContainer.innerHTML += cardHTML;
    });
  }
  if (generalData.generalReport.length === 0) {
    const tableContainer = document.getElementById("table-container");
    const message = `<p> You don't have an </p>`;
    cardContainer.innerHTML = message;
  } else {
  }
}

// export

// Get export buttons

const exportButtons = document.querySelectorAll(".export-option");
exportButtons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    const exportType = this.getAttribute("data-kt-ecommerce-export");
    if (exportType === "excel") {
      exportToExcel();
    } else if (exportType === "pdf") {
      exportToPDF();
    }
  });
});

// Export to Excel function
function exportToExcel() {
  const table = document.getElementById(
    "kt_ecommerce_report_customer_orders_table"
  );
  const wsData = [];

  // Extract table headers as subtitles
  const headersRow = [];
  table.querySelectorAll("thead th").forEach((th) => {
    headersRow.push(th.textContent);
  });
  wsData.push(headersRow);

  // Extract table data
  table.querySelectorAll("tbody tr").forEach((tr) => {
    const rowData = [];
    tr.querySelectorAll("td").forEach((td) => {
      rowData.push(td.textContent);
    });
    wsData.push(rowData);
  });

  // Convert to worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "report.xlsx");
}

function exportToPDF() {
  const table = document.getElementById(
    "kt_ecommerce_report_customer_orders_table"
  );
  const doc = new jsPDF();

  // Add table headers as subtitles
  let yOffset = 10;
  table.querySelectorAll("thead th").forEach((th) => {
    doc.text(th.textContent, 10, yOffset);
    yOffset += 10;
  });

  // Add table data
  doc.autoTable({
    html: table,
    theme: "grid",
    startY: yOffset + 5, // Add some padding after headers
  });

  doc.save("report.pdf");
}
