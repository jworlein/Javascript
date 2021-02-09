//data from data.js
var tableData = data;

//Page prep
$(document).ready(function() {
    buildFilters();
    buildTable();

    //Event Listeners ("el")
    $("#filter-btn").on("click", function(el) {
        el.preventDefault();
        buildTable();
    });
    $("#filter-clear").on("click", function(el) {
        el.preventDefault();
        resetFilters();
    });
    $("#form").on("submit", function(el) {
        el.preventDefault();
        buildTable();
    });
});

//filtering the data
function buildFilters() {
    buildUniqueFilterHelper("country", "country");
    buildUniqueFilterHelper("state", "state");
    buildUniqueFilterHelper("shape", "shape");
}
//reset filters
function resetFilters() {
    $("#datetime").val("");
    $("#datetime").text("");

    $("#city").val("");
    $("#city").text("");

    $("#state").val("");
    $("#country").val("");
    $("#shape").val("");
//clears data table filters and resets table to default
    buildTable();
}

//filter
function buildUniqueFilterHelper(colName, filterID) {
    var unq_column = [...new Set(tableData.map(x => x[colName]))];
    unq_column = unq_column.sort();
    unq_column.forEach(function(val) {
        var newOption = `<option>${val.toUpperCase()}</option>`;
        $(`#${filterID}`).append(newOption);
    });
}

//building table
function buildTable() {
    var dateFilter = $("#datetime").val();
    var cityFilter = $("#city").val();
    var stateFilter = $("#state").val();
    var countryFilter = $("#country").val();
    var shapeFilter = $("#shape").val();

    //apply filters
    var filteredData = tableData;
    if (dateFilter) {
        filteredData = filteredData.filter(row => Date.parse(row.datetime) === Date.parse(dateFilter));
    }
    if (cityFilter) {
        filteredData = filteredData.filter(row => row.city === cityFilter.toLowerCase());
    }
    if (stateFilter) {
        filteredData = filteredData.filter(row => row.state === stateFilter.toLowerCase());
    }
    if (countryFilter) {
        filteredData = filteredData.filter(row => row.country === countryFilter.toLowerCase());
    }
    if (shapeFilter) {
        filteredData = filteredData.filter(row => row.shape === shapeFilter.toLowerCase());
    }

    // checking for additional data
    if (filteredData.length === 0) {
        alert("No Data Found!");
    }

    buildTableString(filteredData);
}

function buildTableString(data) {

    //HTML string via jquery
    var tbody = $("#ufo-table>tbody");
    //clear table
    tbody.empty();

    //clear data table
    $("#ufo-table").DataTable().clear().destroy();

    //appending data
    data.forEach(function(row) {
        var newRow = "<tr>"
            // loop through each Object (dictionary)
        Object.entries(row).forEach(function([key, value]) {
            // set the cell data
            newRow += `<td>${value}</td>`
        });

        //append to data table
        newRow += "</tr>";
        tbody.append(newRow);
    });

    //redraw table
    $("#ufo-table").DataTable({
        dom: 'Bfrtip', 
        buttons: [
            { extend: 'copyHtml5' },
            { extend: 'excelHtml5' },
            { extend: 'csvHtml5' },
            {
                extend: 'pdfHtml5',
                title: function() { return "UFO Observations"; },
                orientation: 'portrait',
                pageSize: 'LETTER',
                text: 'PDF',
                titleAttr: 'PDF'
            }
        ]
    });

}