"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var KTAppEcommerceReportCustomerOrders = (function () {
    var t, e;
    return {
      init: function () {
        (t = document.querySelector(
          "#kt_ecommerce_report_customer_orders_table"
        )) &&
          (() => {
            const e = "General Report";
            new $.fn.dataTable.Buttons(t, {
              buttons: [
                { extend: "copyHtml5", title: e },
                { extend: "excelHtml5", title: e },
                { extend: "csvHtml5", title: e },
                { extend: "pdfHtml5", title: e },
              ],
            })
              .container()
              .appendTo($("#kt_ecommerce_report_customer_orders_export")),
              document
                .querySelectorAll(
                  "#kt_ecommerce_report_customer_orders_export_menu [data-kt-ecommerce-export]"
                )
                .forEach((btn) => {
                  btn.addEventListener("click", (event) => {
                    event.preventDefault();
                    const exportType = event.target.getAttribute(
                      "data-kt-ecommerce-export"
                    );
                    document
                      .querySelector(".dt-buttons .buttons-" + exportType)
                      .click();
                  });
                });
          })(),
          document
            .querySelector('[data-kt-ecommerce-order-filter="search"]')
            .addEventListener("keyup", function (event) {
              e.search(event.target.value).draw();
            }),
          (() => {
            const statusFilter = document.querySelector(
              '[data-kt-ecommerce-order-filter="status"]'
            );
            $(statusFilter).on("change", (event) => {
              let filterValue = event.target.value;
              if (filterValue === "all") {
                filterValue = "";
              }
              e.column(2).search(filterValue).draw();
            });
          })();
      },
    };
  })();
  KTUtil.onDOMContentLoaded(function () {
    KTAppEcommerceReportCustomerOrders.init();
  });
});
