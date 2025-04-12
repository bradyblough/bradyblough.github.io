const apiKey = "HcSkv0VzXdOMlrefSlzIY2uAo3C12YCGAaFUlucb"; // Replace with your actual API key

// Function to format date and time
function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${formattedDate} ${formattedTime}`;
}

// Make an API request to fetch the latest solar flare events
fetch(`https://api.nasa.gov/DONKI/FLR?api_key=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    // Reverse order of data
    data.reverse();
    // Get the table element
    const table = document.getElementById("flare-events");

    // Iterate through the response data and create table rows
    data.forEach(event => {
      const flareID = event.flrID;
      const beginTime = formatDateTime(event.beginTime);
      const peakTime = formatDateTime(event.peakTime);
      const endTime = formatDateTime(event.endTime);
      const classType = event.classType;

      // Create a new table row
      const row = document.createElement("tr");

      // Create table cells for each event property
      const idCell = document.createElement("td");
      idCell.textContent = flareID;
      row.appendChild(idCell);

      const beginCell = document.createElement("td");
      beginCell.textContent = beginTime;
      row.appendChild(beginCell);

      const peakCell = document.createElement("td");
      peakCell.textContent = peakTime;
      row.appendChild(peakCell);

      const endCell = document.createElement("td");
      endCell.textContent = endTime;
      row.appendChild(endCell);

      const classCell = document.createElement("td");
      classCell.textContent = classType;
      row.appendChild(classCell);

      // Add the row to the table
      table.appendChild(row);
    });
  })
  .catch(error => {
    console.log("Error:", error);
  });