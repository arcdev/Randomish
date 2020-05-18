module.exports = class Randomizer {
  address2Chunks = [];
  areaCodes = [];
  givenNames = [];
  streets = [];
  surnames = [];
  zips = [];
  adjectives = [];
  animals = [];
  companySuffix = [];
  topLevelDomains = [];

  useInvalidTaxIdRange = true;

  address2Likelihood = 0.33;
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  alphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  alphabetLowerCase = 'abcdefghijklmnopqrstuvwxyz';
  alphabetLowerCaseArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  constructor(address2Chunks, areaCodes, givenNames, streets, surnames, zips, adjectives, animals, companySuffix, topLevelDomains) {
    this.address2Chunks = address2Chunks;
    this.areaCodes = areaCodes;
    this.givenNames = givenNames;
    this.streets = streets;
    this.surnames = surnames;
    this.zips = zips;
    this.adjectives = adjectives;
    this.animals = animals;
    this.companySuffix = companySuffix;
    this.topLevelDomains = topLevelDomains;
  }

  random(minInclusive, maxExclusive) {
    return Math.floor((Math.random() * (maxExclusive - minInclusive)) + minInclusive);
  }

  pickEntry(list) {
    var idx = this.random(0, list.length);
    return list[idx];
  }

  randomBoolean() {
    return Boolean(this.random(0, 2));
  }

  randomize(src, targetLength) {
    let limit = 9999;
    var rtn = "";
    while (rtn.length < targetLength) {
      limit--;
      if (limit < 0) {
        throw "too many iterations of randomize()"
      }
      rtn += this.pickEntry(src);
    }
    return rtn;
  }

  buildPerson() {
    const streetNum = this.random(1, 100000);
    const streetName = this.pickEntry(this.streets);
    const address2 = this.randomAddress2();
    let address2Formatted = null;
    if (address2 !== null) {
      address2Formatted = address2.space + " " + address2.id;
    }

    const zipObj = this.randomZip();
    const phoneParts = [this.pickEntry(this.areaCodes).AreaCode, this.random(201, 799+1), this.random(0, 9999+1)];
    const faxParts = [this.pickEntry(this.areaCodes).AreaCode, this.random(201, 799+1), this.random(0, 9999+1)];
    const taxIdParts = this.randomTaxId();
    const surname = this.pickEntry(this.surnames);
    const givenName = this.pickEntry(this.givenNames);

    const formattedAddressLines = [
      givenName + " " + surname,
      streetNum + " " + streetName,
    ];

    if (address2Formatted !== null) {
      formattedAddressLines.push(address2Formatted);
    }
    formattedAddressLines.push(zipObj.detail.split(", ")[0] + ", " + zipObj.detail.split(", ")[1] + " " + zipObj.name);

    const result = {
      streetNum: streetNum,
      streetName: streetName,
      zipobj: zipObj,
      street1: streetNum + " " + streetName,
      street2: address2Formatted,
      city: zipObj.detail.split(", ")[0],
      state: zipObj.detail.split(", ")[1],
      zip: this.formatZip(zipObj),

      phoneParts: phoneParts,
      phone: phoneParts.join(""),
      phoneFormatted: phoneParts.join("-"),
      
      faxParts: faxParts,
      fax: faxParts.join(""),
      faxFormatted: faxParts.join("-"),

      surname: surname,
      givenName: givenName,
      name: givenName + " " + surname,
      taxIdParts: taxIdParts,
      taxId: taxIdParts.join(""),
      taxIdFormatted: taxIdParts.join("-"),
      addressFormatted: formattedAddressLines.join("\n"),
      email: null,
      company: this.randomCompany()
    }

    result.email = this.randomEmail(result);
    return result;
  }

  formatZip(zipObj){
    if (zipObj.plusFour){
      return zipObj.name + "-" + zipObj.plusFour;
    }
    return zipObj.name;
  }

  randomZip(){
    const rtn = this.pickEntry(this.zips);
    if (this.randomBoolean()){
      rtn.plusFour = this.random(1,9999+1);
    }
    return rtn;
  }

  randomEmail(person) {
    const adj = this.pickEntry(this.adjectives);
    const noun = this.pickEntry(this.animals);
    const domain = `${this.lowerCaseWord(adj)}${this.lowerCaseWord(noun)}`;
    const tld = this.pickEntry(this.topLevelDomains);
    return `${person.givenName}.${person.surname}@${domain}.${tld}`;
  }

  randomString(length){
    length = length || 8;
    return this.randomize(this.alphabetLowerCaseArray, length)
  }

  randomCompany(){
    const adj = this.pickEntry(this.adjectives);
    const noun = this.pickEntry(this.animals);
    let suffix = this.pickEntry(this.companySuffix);
    const includeComma = suffix !== '' && this.randomBoolean();
    if (suffix !== ''){
      suffix = ' ' + suffix;
    }
    if (includeComma){
      suffix = ',' + suffix;
    }
    return `${this.upperCaseWord(adj)} ${this.upperCaseWord(noun)}${suffix}`;
  }

  upperCaseWord(word){
    return word[0].toUpperCase() + word.slice(1);
  }
  
  lowerCaseWord(word){
    return word[0].toLowerCase() + word.slice(1);
  }

  randomAddress2() {
    const diceRoll = this.random(1, 101);
    if (diceRoll > this.address2Likelihood * 100) {
      return null;
    }

    const chunk = this.pickEntry(this.address2Chunks);

    const hasLetter = this.randomBoolean();
    const startsWithLetter = this.randomBoolean();
    const hasNumber = !hasLetter || this.randomBoolean();

    const letterPart = hasLetter ? this.pickEntry(this.alphabetArray) : '';
    const numberPart = hasNumber ? this.random(0, 999 + 1) : '';

    const separatorPart = hasLetter && hasNumber && this.randomBoolean() ? '-' : '';

    const parts = [];
    if (startsWithLetter) {
      parts.push(letterPart);
      parts.push(separatorPart);
      parts.push(numberPart);
    }
    else {
      parts.push(numberPart);
      parts.push(separatorPart);
      parts.push(letterPart);
    }

    var idPart = parts.join('');

    return {
      "space": chunk,
      "id": idPart
    };
  }

  randomTaxId() {
    let area = this.useInvalidTaxIdRange ? this.random(900, 999 + 1) : this.random(1, 900);
    const group = this.random(1, 99 + 1);
    const serial = this.random(1, 9999 + 1)

    if (area === 666) {
      area = this.random(1, 900);
    }
    return [
      area.toString().padStart(3, '0'),
      group.toString().padStart(2, '0'),
      serial.toString().padStart(4, '0')];
  }

  getRandomPerson(fcnFormat) {
    const p = this.buildPerson();
    if (typeof fcnFormat === '') {
      return fcnFormat(p);
    }
    return p;
  }

  getRandomPeople(count, fcnFormat) {
    const rtn = [];
    for (let i = 0; i < count; i++) {
      const person = this.getRandomPerson(fcnFormat);
      rtn.push(person);
    }
    return rtn;
  }

  formatPersonInTabs(p) {
    const parts = [
      p.name,
      p.street1,
      p.street2,
      p.city,
      p.state,
      p.zip,
      p.phoneFormatted
    ];
    const rtn = parts.join('\t');
    console.log(rtn);
    return rtn;
  }
}