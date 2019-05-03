let buildform = (parameters, action, target) => {
  var theForm = $(document.createElement("form")).attr("method", "post").attr("action", action).attr("enctype", "multipart/form-data");

  if (target && typeof target === "string") {
    theForm.attr("target", target);
  }
  else if (target && typeof target === "boolean") {
    theForm.attr("target", '_BLANK' + Math.random() * 100000);
  }

  $(theForm).insertObject(parameters);

  theForm.append($(document.createElement("input")).attr({
    type: "hidden",
    name: "rand",
    value: Math.floor(Math.random() * 100000)
  }));

  $(theForm).appendTo("body");
  return theForm;
}

let fetch = () => {
  const table = document.getElementById("na_jobApplications_employerTableID");
  const links = table.querySelectorAll("tr > td:nth-of-type(3) .dropdown-menu > li:first-of-type > a");
  for (let i = 0; i < links.length; i++) {
    const item = links[i];
    const click = item.getAttribute("onclick");
    const startIdx = click.indexOf("{");
    const endIdx = click.indexOf("}");
    const jsonStr = click.substring(startIdx, endIdx + 1).replace(/'/g, '"');
    try {
      const payload = JSON.parse(jsonStr);
      console.log("building", payload.action);
      buildform(payload, '', '').submit();
      setTimeout()
    } catch (err) {
      console.error("Error parsing", item);
    }
  }
}