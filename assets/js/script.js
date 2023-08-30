// const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
// "2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log( txt.split( /[\r\n]+/gm) );

const uploaderInput = document.querySelector(".uploader__input");
uploaderInput.addEventListener("change", uploadTravels);

function uploadTravels(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = event.target.result;
      convertCsvToArray(data)
    };
    reader.readAsText(file);
  }
}

function convertCsvToArray(stringValue) {
  const newStringValue = stringValue.split('\n');
  
  const objectsArray = [];

  for (const string of newStringValue) {
    const values = string.replace(/"/g, '').trim().split(',');

    const obj = {
      id: values[0],
      name: values[1],
      description: values.slice(2, -2),
      adultPrice: values[values.length - 2],
      childPrice: values[values.length - 1],
    }
    objectsArray.push(obj)
  }
}

