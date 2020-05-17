function random(minInclusive, maxExclusive) {
  return Math.floor((Math.random() * maxExclusive) + minInclusive);
}

function pickEntry(list) {
  var idx = random(0, list.length);
  return list[idx];
}

function buildPerson() {
  const streetNum = random(1, 100000);
  const streetName = pickEntry(streets);
  const zipobj = pickEntry(zips);

  const phoneParts = [pickEntry(areaCodes).AreaCode, random(201, 799), random(0, 10000)];

  const taxIdParts = randomTaxId();

  const surname = pickEntry(surnames);
  const givenName = pickEntry(givenNames);

  const addressFormatted = [
    givenName + " " + surname,
    streetNum + " " + streetName,
    "",
    zipobj.detail.split(", ")[0] + ", " + zipobj.detail.split(", ")[1] + " " + zipobj.name
  ].join("\n");

  const result = {
    streetNum: streetNum,
    streetName: streetName,
    zipobj: zipobj,
    street1: streetNum + " " + streetName,
    street2: "",
    city: zipobj.detail.split(", ")[0],
    state: zipobj.detail.split(", ")[1],
    zip: zipobj.name,
    phoneParts: phoneParts,
    phone: phoneParts.join(""),
    phoneFormatted: phoneParts.join("-"),
    surname: surname,
    givenName: givenName,
    name: givenName + " " + surname,
    taxIdParts: taxIdParts,
    taxId: taxIdParts.join(""),
    taxIdFormatted: taxIdParts.join("-"),
    addressFormatted: addressFormatted
  }
  return result;
}

function randomTaxId() {
  let area =  random(1, 900);
  const group = random(1, 99 + 1);
  const serial = random(1, 9999 + 1)

  if (area === 666){
    area = random(1, 900);
  }
  return [area, group, serial];
}

function randomize(src, targetLength) {
  var rtn = "";
  while (rtn.length < targetLength) {
    rtn += pickEntry(src);
  }
  return rtn;
}

function btnGenerate_click() {
  var d = buildPerson();
  $("#name").text(d.name);
  $("#street1").text(d.street1);
  $("#street2").text(d.street2);
  $("#city-state-zip").text(d.city + ", " + d.state + " " + d.zip);
  $("#phone").text(d.phoneFormatted);
  $("#taxid").text(d.taxIdFormatted);
  $("#json-result").val(JSON.stringify(d, "", "  "));
}

function btnCopy_click() {
  var query = $(this).data("target");
  var target = $(query);
  var range = document.createRange();
  range.selectNode(target[0]);
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

function init() {
  $("#given-name-count").text(givenNames.length);
  $("#surname-count").text(surnames.length);
  $("#street-count").text(streets.length);
  $("#zip-count").text(zips.length);
  $("#area-code-count").text(areaCodes.length);

  $("#btnGenerate").on("click", btnGenerate_click).click();
  $("button.copy").on("click", btnCopy_click);
}

$(init);