const uploaderInput = document.querySelector(".uploader__input");
uploaderInput.addEventListener("change", uploadTravels);
const spanTotalPrice = document.querySelector(".order__total-price-value");
let basket = [];
const formArray = [];

function uploadTravels(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = event.target.result;
      convertCsvToObject(data);
    };
    reader.readAsText(file);
  }
}

function convertCsvToObject(stringValue) {
  const newStringValue = stringValue.split("\n");

  const objectsArray = [];

  for (const string of newStringValue) {
    const values = string.replace(/"/g, "").trim().split(",");

    const obj = {
      id: +values[0],
      title: values[1],
      description: values.slice(2, -2).join(""),
      adultPrice: +values[values.length - 2],
      childPrice: +values[values.length - 1],
    };
    objectsArray.push(obj);
  }
  addTravelsToDOM(objectsArray);
}

function addTravelsToDOM(travelsData) {
  const travels = travelsData;
  const listTravels = document.querySelector(".excursions");
  travels.forEach(function (travel) {
    listTravels.innerHTML += `
      <li data-id="${travel.id}" class="excursions__item excursions__item--prototype">
      <header class="excursions__header">
        <h2 class="excursions__title" data-title="${travel.title}">${travel.title}</h2>
        <p class="excursions__description">${travel.description}</p>
      </header>
      <form class="excursions__form">
        <div class="excursions__field">
          <label class="excursions__field-name">
            Dorosły: <span class="excursions__price" data-adult="${travel.adultPrice}">${travel.adultPrice}</span>PLN x
            <input class="excursions__field-input" name="adults" />
          </label>
        </div>
        <div class="excursions__field">
          <label class="excursions__field-name">
            Dziecko: <span class="excursions__price" data-child="${travel.childPrice}">${travel.childPrice}</span>PLN x
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
      `;
  });
  getListItemForm(listTravels);
}

function getListItemForm(listTravels) {
  const listItem = [...listTravels.children];
  listItem.forEach(function (li) {
    const formEl = li.querySelector("form");
    formArray.push(formEl);
  });
  passTheValue(formArray);
}

function passTheValue(forms) {
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(e);
      const parentId = +form.parentElement.dataset.id;
      const titleofTravel =
        form.previousElementSibling.firstElementChild.dataset.title;
      const adultP =
        form.firstElementChild.firstElementChild.firstElementChild.dataset
          .adult;
      const childP =
        form.firstElementChild.nextElementSibling.firstElementChild
          .firstElementChild.dataset.child;
      const adultNum = parseInt(form.querySelector("[name=adults]").value);
      const childNum = parseInt(form.querySelector("[name=children]").value);
      if (adultNum > 0 && adultNum < 11 && childNum > 0 && childNum < 11) {
        if (!isNaN(adultNum) || !isNaN(childNum)) {
          const obj = {
            id: parentId,
            title: titleofTravel,
            adultNumber: adultNum,
            adultPrice: +adultP,
            childNumber: childNum,
            childPrice: +childP,
            sum: childNum * childP + adultNum * adultP,
          };
          if (!basket.some((el) => el.id === obj.id)) {
            basket.push(obj);
            displayBasketData(basket);
          }
        }
      } else {
        alert("Wpisujemy tylko liczby w przedziale od 1 do 10 :)");
      }
    });
  });
}

function displayBasketData(basket) {
  const summaryList = document.querySelector(".summary");
  summaryList.innerHTML = "";
  let total = 0;
  basket.forEach(function (travel) {
    total += travel.sum;
    summaryList.innerHTML += `
      <li data-id=${travel.id} class="summary__item summary__item--prototype">
      <h3 class="summary__title">
        <span class="summary__name">${travel.title}</span>
        <strong class="summary__total-price">${travel.sum} PLN</strong>
        <a href="#" class="summary__btn-remove" title="usuń" data-id=${travel.id}>X</a>
      </h3>
      <p class="summary__prices">dorośli:${travel.adultNumber} x ${travel.adultPrice}PLN, dzieci:${travel.childNumber} x ${travel.childPrice}PLN</p>
    </li>
      `;
  });
  spanTotalPrice.innerHTML = `${total} PLN`;

  const removeBtn = document.querySelectorAll(".summary__btn-remove");

  removeBtn.forEach(function (btn) {
    btn.addEventListener("click", updateBasketData);
  });
}

function updateBasketData(e) {
  const currentBtn = e.target;
  const currentBtnId = +currentBtn.dataset.id;
  for (let i = 0; i < basket.length; i++) {
    if (basket[i].id === currentBtnId) {
      basket.splice(i, 1);
      const updateBasket = displayBasketData(basket);
    }
  }
}

const orderForm = document.querySelector(".order");
orderForm.addEventListener("submit", handleSubmit);

const fields = [
  { name: 'name', label: 'Imię i nazwisko'},
  { name: 'email', label: 'Email', pattern: '@'},
];

function handleSubmit(e) {
  e.preventDefault();
  const formEl = e.target;
  const listErrors = document.querySelector('.order__list-errors');
  listErrors.innerText = "";
  const spanPriceValue = document.querySelector(
    ".order__total-price-value"
  ).innerHTML;
  const errors = [];
    const emailValue = formEl.elements[1].value;
  fields.forEach(function(field) {
    const value = formEl.elements[field.name].value;

    if (field) {
      if (value.length === 0) {
        errors.push(`Dane w polu ${field.label} są wymagane!`)
      }
    }
    if (field.pattern) {
      const reg = new RegExp(field.pattern);
      if (!reg.test(value)) {
        errors.push(`Dane w polu ${field.label} są nieprawidłowe!`);
      }
    }
  })
  if (errors.length === 0) {
    alert(`Dziekujemy za złożenie zamówienia o wartości ${spanPriceValue}. Szczegóły zamówienia zostały wysłane na adres e-mail: ${emailValue}`)
    basket = [];
    const summaryList = document.querySelector(".summary");
    summaryList.innerText = "";
    fields.forEach(function(el) {
      formEl[el.name].value = "";
    })
    formArray.forEach(function (item) {
      const adultInput = item.querySelector('[name=adults]');
      const childInput = item.querySelector('[name=children]');
      adultInput.value = "";
      childInput.value = "";
    })
  }
  else {
    errors.forEach(function(text) {
      const li = document.createElement('li');
      li.classList.add('order__errors-item');
      li.innerText = text;

      listErrors.appendChild(li)
    })
  }
}
