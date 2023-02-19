import './css/styles.css';
import _debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const COUNTRIES_API = txt =>
  `https://restcountries.com/v3.1/name/${txt}`;

const refs = {
    seachBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

function clearInput() {
    refs.countryInfo.innerHTML  = '';
    refs.countryList.innerHTML = '';
}

function fetchCountries(txt) {
    if (!txt) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
      }    
fetch(COUNTRIES_API(txt))
.then(response => {
    if (!response.ok) {
        renderCountriesList.innerHTML = `<h2>No country with that name</h2>`;
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else return response.json();
    })
.then(countries => {
    clearInput()
    if (countries.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        return
    }
    else if (countries.length === 1) 
        refs.countryInfo.innerHTML = renderCountriesInfo(countries[0]);
   else (countries.length > 1 && countries.length < 10)
    {
        const countriesArray = countries.map(country => renderCountriesList(country)).join('');
        refs.countryList.innerHTML = countriesArray;
    } 
    
})
.catch(console.log);
};

function renderCountriesList(country) {

    return `<li> 
    <h2 class="country-list-name">
    <img class = "flag" src = "${country.flags.svg}" />
    ${country.name.official}</h2>
    </li>
    `;
}

function renderCountriesInfo({capital, population, languages}) {

    return `
    <div class="country-info">
    <p><b>capital:</b> ${capital} </p>
    <p><b>population:</b>${population}</p>
    <p><b>languages:</b> ${Object.values(languages)}</p>
    </div>
    </li>
    `;
}

const fetchCountriesDebounced = _debounce(fetchCountries, DEBOUNCE_DELAY);

refs.seachBox.addEventListener('input', function (e) {
    fetchCountriesDebounced(e.target.value.trim());
  });
  
