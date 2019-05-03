const _showFile = (blob) => {
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  var newBlob = new Blob([blob], { type: "application/pdf" })

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  // For other browsers: 
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob);
  var link = document.createElement('a');
  link.href = data;
  link.download = "file.pdf";
  link.click();
  setTimeout(function () {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
  }, 100)
}

const _doFetchDocument = (payload) => {
  let formData = new FormData();
  formData.append('action', payload.action);
  formData.append('applicationId', payload.applicationId);
  formData.append('rand', Math.floor(Math.random() * 100000));

  return fetch("https://waterlooworks.uwaterloo.ca/myAccount/co-op/coopApplications.htm",
    {
      body: formData,
      method: "post"
    }
  ).then(response => response.blob())
    .then(_showFile)
}

const fetchPackages = async () => {
  const table = document.getElementById("na_jobApplications_employerTableID");
  const links = table.querySelectorAll("tr > td:nth-of-type(3) .dropdown-menu > li:first-of-type > a");
  for (let i = 0; i < links.length; i++) {
    const item = links[i];
    const click = item.getAttribute("onclick");
    const startIdx = click.indexOf("{");
    const endIdx = click.indexOf("}");
    const jsonStr = click.substring(startIdx, endIdx + 1).replace(/'/g, '"');
    let payload;
    try {
      payload = JSON.parse(jsonStr);
    } catch (err) { }

    if (payload) {
      await _doFetchDocument(payload);
    }
  }
}

fetchPackages();