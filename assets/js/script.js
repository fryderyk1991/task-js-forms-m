const uploaderInput = document.querySelector(".uploader__input");
uploaderInput.addEventListener("change", uploadTravels);

function uploadTravels(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = event.target.result;
      convertCsvToArray(data);
    };
    reader.readAsText(file);
  }
}

function convertCsvToArray(stringValue) {
  const newStringValue = stringValue.split("\n");

  const objectsArray = [];

  for (const string of newStringValue) {
    const values = string.replace(/"/g, "").trim().split(",");

    const obj = {
      id: +values[0],
      title: values[1],
      description: values.slice(2, -2).join(''), 
      adultPrice: +values[values.length - 2],
      childPrice: +values[values.length - 1],
    };
    objectsArray.push(obj);
  }
  addTravelsToDOM(objectsArray);
}

function addTravelsToDOM(travelsData) {
    const travels = travelsData;
    const listTravels = document.querySelector('.excursions');
    travels.forEach(function(travel) {
      listTravels.innerHTML += `
      <li data-id="${travel.id}" class="excursions__item excursions__item--prototype">
      <header class="excursions__header">
        <h2 class="excursions__title">${travel.title}</h2>
        <p class="excursions__description">${travel.description}</p>
      </header>
      <form class="excursions__form">
        <div class="excursions__field">
          <label class="excursions__field-name">
            Dorosły: <span class="excursions__price">${travel.adultPrice}</span>PLN x
            <input class="excursions__field-input" name="adults" />
          </label>
        </div>
        <div class="excursions__field">
          <label class="excursions__field-name">
            Dziecko: <span class="excursions__price">${travel.childPrice}</span>PLN x
            <input class="excursions__field-input" name="children" />
          </label>
        </div>
        <div class="excursions__field excursions__field--submit">
          <input
            class="excursions__field-input excursions__field-input--submit"
            value="dodaj do zamówienia"
            type="submit"
          />
        </div>
      </form>
    </li>
      `
    })
    getAccesToForm(listTravels)
}


function getAccesToForm (listTravels) {
    const list = listTravels;
    const listChildren = [...list.children];
    console.log(listChildren)

  listChildren.forEach(function(li) {
    const formEl = li.querySelector('form');
    
    return formEl;
  })
}


