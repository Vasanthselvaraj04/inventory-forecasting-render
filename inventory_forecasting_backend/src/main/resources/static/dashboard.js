// ---------------- CHART ----------------
fetch("http://localhost:8080/api/dashboard/chart-data")
.then(res => res.json())
.then(data => {

    const labels = data.sales.map(d => d[0]);
    const sales = data.sales.map(d => d[1]);
    const forecast = data.forecast[0][1];

    new Chart(document.getElementById("salesChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Sales",
                    data: sales,
                    backgroundColor: "rgba(54,162,235,0.7)"
                },
                {
                    label: "Forecast",
                    data: Array(labels.length).fill(forecast),
                    backgroundColor: "rgba(255,99,132,0.5)"
                }
            ]
        }
    });
});

// ---------------- LOW STOCK ----------------
fetch("http://localhost:8080/api/dashboard/low-stock")
.then(res => res.json())
.then(data => {
    const table = document.getElementById("lowStockTable");

    data.forEach(item => {
        table.innerHTML += `
            <tr>
                <td>${item.inventoryId}</td>
                <td>${item.productId}</td>
                <td>${item.currentStock}</td>
            </tr>`;
    });
});

// ---------------- RECENT SALES ----------------
fetch("http://localhost:8080/api/dashboard/recent-sales")
.then(res => res.json())
.then(data => {
    const table = document.getElementById("recentSalesTable");

    data.forEach(sale => {
        table.innerHTML += `
            <tr>
                <td>${sale.saleId}</td>
                <td>${sale.productId}</td>
                <td>${sale.quantitySold}</td>
                <td>${sale.saleDate}</td>
            </tr>`;
    });
});
