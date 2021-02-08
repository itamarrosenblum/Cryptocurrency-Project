/**
* Purpose: Main JS File
* Author: Itamar Rosenblum
* Date: 23-01-2021
* Last modified: 07-02-2021
*/

// Function 0: Create the home page
(async function homePage() {
    // Get element
    const learnMoreBtn = document.querySelector('#learn-more');
    const mainContainer = document.querySelector('main');

    // Creates the page after load
    const res = await fetch('pages/home.html');
    const data = await res.text();
    mainContainer.innerHTML = data;
    
    learnMoreBtn.addEventListener('click', async (e) => {
        // Create the page after user clicks on the 'Learn More' button
        const res = await fetch('pages/home.html');
        const data = await res.text();
        mainContainer.innerHTML = data;
    });
})();

// Function 1: Create the markets page
(function marketsPage() {
    // Get element
    const header = document.querySelector('header');
    const mainContainer = document.querySelector('main');
    const mainNav = document.querySelector('.main-nav');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const searchInput = document.querySelector('#search-input');

    // Create the markets page and the cards for coins
    header.addEventListener('click', async (e) => {
        if (e.target.classList.contains('markets')) {
            // Fetch markets page
            const res = await fetch('pages/markets.html');
            const data = await res.text();
            mainContainer.innerHTML = data;

            // Get element
            const coinContainer = document.querySelector('#coin-container');
            const spinner = document.querySelector('.spinner');

            // Fetch list of coins
            try {
                spinner.style.display = 'flex';
                const res = await fetch('https://api.coingecko.com/api/v3/coins');
                const data = await res.json();
                spinner.style.display = 'none';
                
                for (let i = data.length -1; i >= 0; i--) {
                    // Create cards
                    coinContainer.insertAdjacentHTML('afterbegin',
                    `<div class="card-coin">
                        <div class="card-header">
                            <button class="btn-favorite">
                                <ion-icon name="heart" id="${data[i].symbol}"class='fav-star'></ion-icon>
                            </button>
                            <h3 id="card-title" class="card-title">
                                ${data[i].name} <span>(${data[i].symbol})</span>
                            </h3>
                            <h4 id="crad-number">#${[i]}</h4>
                        </div>
                        <div class="more-info">
                            <a class="more-content" id="${data[i].id}"><ion-icon name="information-circle-outline"></ion-icon> Click For More Info...</a>
                        </div>
                    </div>`);
                }
                
                // Mark heart icons to exisiting currncies on the listReport
                const allFavStars = document.querySelectorAll('.fav-star');
                const listReport = JSON.parse(localStorage.getItem('listReport'));

                if (listReport !== null) {
                    for (let i = 0; i < allFavStars.length; i++) {
                        for (let k = 0; k < listReport.length; k++) {
                            if (listReport[k] === allFavStars[i].id) {
                                allFavStars[i].classList.add('checked-star');
                            }
                        }
                    }
                }       
            } catch(err) {
                console.error(err);
            }
        }
    }); // end of the header addEventLisitner

    // Sticky navigation effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        nav.classList.toggle('sticky', window.scrollY > 0);
    });

    // Mobile navigation toggle on click
    window.addEventListener('click', e => {
        // Toggle on 'hamburger-icon' click
        if (e.target.classList.contains('hamburger-icon')) {
            if (hamburgerIcon.name === 'reorder-three') {
                hamburgerIcon.name = 'close';
            } else {
                hamburgerIcon.name = 'reorder-three';
            }

            mainNav.classList.toggle('display-main-nav');
        }
        
        // Toggle on link click
        if (e.target.classList.contains('main-link')) {
            mainNav.classList.toggle('display-main-nav');
            hamburgerIcon.name = 'reorder-three';
        }
    });

    // Mobile navigation toggle on keydown
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            mainNav.classList.toggle('display-main-nav');
            hamburgerIcon.name = 'reorder-three';
        }
    });
})(); // End of the marketsPage function

// Function 2: Create the modal window for the more info button
(function moreInfoModal () {
    // Get element
    const mainContainer = document.querySelector('main');

    // Modal window function
    mainContainer.addEventListener('click', async e => {
        if(e.target.classList.contains('more-content')) {
            // Get element
            const spinner = document.querySelector('.spinner');

            // Get the modal element
            const modalBg = document.querySelector('.modal-bg');
            const modalContent = document.querySelector('.modal-content');
            const modalHeader = document.querySelector('.modal-header');
            const modalImg = document.querySelector('.modal-img');
            const priceUsd = document.querySelector('.price-usd');
            const priceIls = document.querySelector('.price-ils');
            const priceEuro = document.querySelector('.price-euro');

            const coinId = e.target.id;
            const twoMinutes = 1000 * 60 * 2;
            const localData = JSON.parse(localStorage.getItem(coinId));
            
            // Check if the selected coin exist in localStorage
            if (localData !== null) {
                // Check if two minutes have passed
                if(new Date().getTime() - localData.time < twoMinutes) {
                    // Display modal
                    modalBg.style.display = 'flex';
                    modalContent.style.display = 'flex';
                    // Set the modal content
                    modalHeader.innerHTML = localData.name;
                    modalImg.src = localData.image;
                    modalImg.alt= 'localData.name} currency image';
                    priceUsd.innerHTML = `USD: &#36;${localData.currency[0].usd}`;
                    priceIls.innerHTML = `ILS: &#8362;${localData.currency[0].ils}`;
                    priceEuro.innerHTML = `EURO: &euro;${localData.currency[0].euro}`;
                    } else {
                        // If two minutes have been passed, fetch, save in localStorage and display
                        try {
                            spinner.style.display = 'flex';
                            const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
                            const data = await res.json();
                            spinner.style.display = 'none';

                            // Display modal
                            modalBg.style.display = 'flex'
                            modalContent.style.display = 'flex';
                            // Set the modal content
                            modalHeader.innerHTML = data.name;
                            modalImg.src = data.image.large;
                            modalImg.alt = 'data.name currency image';
                            priceUsd.innerHTML = `USD: &#36;${data.market_data.current_price.usd}`;
                            priceIls.innerHTML = `ILS: &#8362;${data.market_data.current_price.ils}`;
                            priceEuro.innerHTML = `EURO: &euro;${data.market_data.current_price.eur}`;  

                            // Save the data in localStorage
                            const obj = {
                                name: data.name,
                                image: data.image.large,
                                currency: [{
                                    usd: data.market_data.current_price.usd,
                                    ils: data.market_data.current_price.ils,
                                    euro: data.market_data.current_price.eur
                                }],
                                time: new Date().getTime()
                            };
                            localStorage.removeItem(coinId);
                            localStorage.setItem(coinId, JSON.stringify(obj));
                        } catch(err) {
                            console.error(err);
                        }   
                    }
                } else {
                // if the selected coin doesn't exist in localStorage, fetch, save in localStorage and display
                try {
                    spinner.style.display = 'flex';
                    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
                    const data = await res.json();
                    spinner.style.display = 'none';

                    // Display modal
                    modalBg.style.display = 'flex';
                    modalContent.style.display = 'flex';
                    // Set the modal content
                    modalHeader.innerHTML = data.name;
                    modalImg.src = data.image.large ;
                    modalImg.alt = 'data.name currency image';
                    priceUsd.innerHTML = `USD: &#36;${data.market_data.current_price.usd}`;
                    priceIls.innerHTML = `ILS: &#8362;${data.market_data.current_price.ils}`;
                    priceEuro.innerHTML = `EURO: &euro;${data.market_data.current_price.eur}`;

                    // Save data in localStorage
                    const obj = {
                        name: data.name,
                        image: data.image.large,
                        currency: [{
                            usd: data.market_data.current_price.usd,
                            ils: data.market_data.current_price.ils,
                            euro: data.market_data.current_price.eur
                        }],
                        time: new Date().getTime()
                    };
                    localStorage.setItem(coinId, JSON.stringify(obj));
                } catch(err) {
                    console.error(err);
                }   
            }
        }

        // Hide the modal window
        if(e.target.classList.contains('btn-close')) {
            // Get element
            const modalBg = document.querySelector('.modal-bg');
            const modalContent = document.querySelector('.modal-content');
            const modalList = document.querySelector('.modal-list');

            // Hide elements
            modalBg.style.display = 'none';
            modalContent.style.display = 'none';
            modalList.style.display = 'none';
        }
    }); // End of the mainContainer addEventLisitner
})(); // End of the moreInfoModal function

// Function 3: Create the modal window for the reportList button
(function favoritesModal () {
    // Get element
    const mainContainer = document.querySelector('main');
    const arr = [];
    const arrTemporal = [];
    
    // Modal window function
    mainContainer.addEventListener('click', e => {
        // Get element
        let listReport = JSON.parse(localStorage.getItem('listReport'));
        let checkIfExist = JSON.stringify(listReport).indexOf(e.target.id) === -1;
 
        if (e.target.classList.contains('fav-star')) {  
            // Check if item exist in localStorage
            if (listReport !== null) {
                if (listReport.length < 5 && checkIfExist) {
                    // Push coin symbol to arr
                    arr.push(e.target.id);
                    // Set coin symbol in localStorage
                    localStorage.setItem('listReport', JSON.stringify(arr));
                } else if(listReport.length === 5 && checkIfExist) {
                    // Get element
                    const modalBg = document.querySelector('.modal-bg');
                    const modalList = document.querySelector('.modal-list');
                    const ul = document.querySelector('.list-report');
                    // Clear the ul element
                    ul.innerHTML = '';

                    const allFavStars = document.querySelectorAll('.fav-star');
                    const listReport = JSON.parse(localStorage.getItem('listReport'));

                    // Display modal
                    modalBg.style.display = 'flex';
                    modalList.style.display = 'flex';

                    // Create the reportList
                    for (let i = allFavStars.length -1; i >= 0; i--) {
                        for (let k = 0; k < listReport.length; k++) {
                            if (listReport[k] === allFavStars[i].id) {    
                                ul.insertAdjacentHTML('afterbegin',
                                `<li>
                                    <p>${allFavStars[i].parentNode.nextElementSibling.textContent}</p>
                                    <button class="btn-favorite "><ion-icon name="heart" class='modal-fav-star checked-star' id="${listReport[k]}"></ion-icon></button>
                                </li>`);
                            }
                        }
                    }
                    // Push coin symbol to temproal array
                    arrTemporal.push(e.target.id);                  
                }
            } else {
                // Push coin symbol to arr
                arr.push(e.target.id);  
                // Set coin symbol in localStorage
                localStorage.setItem('listReport', JSON.stringify(arr));
            }

            // Get the latest reportList
            listReport = JSON.parse(localStorage.getItem('listReport'));
            checkIfExist = JSON.stringify(listReport).indexOf(e.target.id) !== -1;

            // Mark heart icons or remove as needed
            if(e.target.classList.contains('checked-star') === false) {
                if (checkIfExist) {
                    e.target.classList.add('checked-star');
                }
            } else {
                    e.target.classList.remove('checked-star'); 
                    arr.splice(arr.indexOf(e.target.id), 1); // remove from reportList
                    localStorage.setItem('listReport', JSON.stringify(arr)); 
            }
        }

        // Get the latest reportList
        listReport = JSON.parse(localStorage.getItem('listReport'));

        //Remove listReport from local storage if it's empty
        if (listReport !== null && listReport.length === 0) {
            localStorage.removeItem('listReport');
        }

        // Hide modal after item are been removed
        if(e.target.classList.contains('modal-fav-star')) {
            const modalBg = document.querySelector('.modal-bg');
            const modalList = document.querySelector('.modal-list');
            modalBg.style.display = 'none';
            modalList.style.display = 'none';
        }  
    }); // End of the mainContainer addEventLisitner

    // Remove item from list report function
    mainContainer.addEventListener('click', e => {
        if(e.target.classList.contains('modal-fav-star')) {
            // Get element
            let allFavStars = document.querySelectorAll('.fav-star');

            // Remove coin from reportList
            arr.splice(arr.indexOf(e.target.id), 1);
            // Push coin form the temporary array to the main array
            arr.push(arrTemporal[0]);
            localStorage.setItem('listReport', JSON.stringify(arr));            
            
            // Get the latest reportList
            let listReport = JSON.parse(localStorage.getItem('listReport'));

            // Mark heart icons or remove as needed
            if (listReport !== null) {
                for (let i = 0; i < allFavStars.length; i++) {
                    // Remove checked hearts icon for coins
                    if (e.target.id === allFavStars[i].id) {
                        allFavStars[i].classList.remove('checked-star');
                    } 

                    // Add checked hearts icon for coins
                    if (arrTemporal[0] === allFavStars[i].id) {
                        allFavStars[i].classList.add('checked-star');
                    }
                }
            }
            // Clear arrTemporal when an coin has been selected
            arrTemporal.length = 0;
        } 
        // Clear arrTemporal when modal has ben closed
        if(e.target.classList.contains('btn-close')) {
            arrTemporal.length = 0;
        }
    }); // End of the mainContainer addEventLisitner

    // Initializes the array using localStorage once the window has loaded
    const listReport = JSON.parse(localStorage.getItem('listReport'))
    if(listReport !== null) {
        for (let i = 0; i < listReport.length; i++) {
            arr.push(listReport[i]);
        }
    }
})(); // End of the favoritesModal function

// Function 4: Create the charts page
(function chartsPage() {
    // Get element
    const mainContainer = document.querySelector('main');
    const chartsPageLink = document.querySelector('#charts');
    // Set variables globally
    let chart;
    let chartData;

    // Set the charts page function
    chartsPageLink.addEventListener('click', async e => { 
        // Fetch charts page
        const res = await fetch('pages/charts.html')
        const data = await res.text();
        mainContainer.innerHTML = data;

        // Get element
        const reportList = JSON.parse(localStorage.getItem('listReport')); 
        const spinner = document.querySelector('.spinner');
  
        if (reportList != null) {
            // Display sipnner - displayed to 'none' in line 397
            spinner.style.display = 'flex';

            // Data stack from API
            const obj = {
                // dynamic keys and values
            }

            // Create dynamic keys for obj
            for (let i = 0; i < reportList.length; i++) {
                obj[reportList[i].toUpperCase()] = [];
            }   

            // Fetch currencie price and set a timeout to request again
            clearInterval(chartData); // Clear setIntreval after page is loaded
            chartData = setInterval(async () => {
                try { 
                    const res = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${reportList}&tsyms=USD`);
                    const data = await res.json();
                    // Hide spinner - displayed to 'flex' in line 378
                    spinner.style.display = 'none';

                    // Create dynamic values for obj
                    for (let key in data) {       
                        obj[key].push(data[key].USD);
                    }
                } catch(err) {
                    console.error(err);
                }

                // Converting the object to array for the highcharts CDN
                const arr = Object.entries(obj);
                
                // Add data to the graph
                for (let i = 0; i <= reportList.length-1; i++) {
                        const [date, value] = arr[i][1];
                        const point = [new Date().getTime(), value];
                        const series = chart.series[0];
                        // shift if the series is longer than 20
                        shift = series.data.length > 20; 
                        // add the point
                        chart.series[i].addPoint(point, true, shift);
                        chart.series[i].name = arr[i][0];
                        // force update tooltips  
                        chart.series[i].isDirty = true;                     
                }
                // Redraw the chart with new data
                chart.redraw();
            }, 2000); // End of setIntreval
    
            // Highcharts creation
            Highcharts.setOptions({
                lang: {
                  thousandsSep: ","
              }
            })
            
            chart = new Highcharts.chart('highcharts', {
                chart: {
                    defaultSeriesType: 'spline',
                    animation: Highcharts.svg,
                    events: {
                        // Loading data from highcharts setInterval function
                        load: chartData,
                    },
                    backgroundColor: '#252a34',
                    type: 'line',
                    borderColor: '#2e303e',
                    borderWidth: 2,
                },
                
                colors: ['#6963ce', '#90EE7E', '#AAEEEE', '#F45B5B', '#09c5c2'],

                title: {
                    text: `${reportList.toString().toUpperCase()} to USD`,
                    style: {
                        color: '#E0E0E3'
                    }
                },
            
                subtitle: {
                    text: 'The chart is updated every 2 seconds',
                    style: {
                        color: '#E0E0E3'
                    }
                },

                yAxis: {
                    title: {
                        text: 'Coin Value',
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    labels: {
                        enabled: true,
                        format: "${value:,0f}",
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    gridLineColor: '#707073',
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
            
                xAxis: {
                    tickPixelInterval: 150,
                    type: 'datetime',
                    style: {
                        color: '#E0E0E3'
                    },
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    tickColor: '#707073',
                    lineColor: '#707073',
                },
            
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    itemStyle: {
                        color: '#E0E0E3'
                    },
                    itemHoverStyle: {
                        color: '#b5b7ca'
                    }
                },

                tooltip: {
                    valuePrefix: '$',
                    valueDecimals: 1,
                    backgroundColor: '#000',
                    borderColor: '#6963ce',
                    style: {
                        color: '#E0E0E3'
                    }
                },
            
                plotOptions: {
                    series: {
                        stacking: 'normal'
                        }
                },
            
                // Series are loaded via 'load: chartData' event (line 422)
                series: [],
            
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            }); // End of highcharts
            
            // Set dynamic series
            for (let i = 0; i < reportList.length; i++) {
                chart.addSeries({name: reportList[i].toUpperCase()});
            }
        } else {
            // Alert to the user if the reportList is empty
            const res = await fetch('pages/alertMessage.html');
            const data = await res.text();
            mainContainer.innerHTML = "";
            mainContainer.innerHTML = data;
        }
    }); // End of the mainContainer addEventLisitner
})(); // End of the chartsPage function

// Function 5: Create the about page
(function aboutPage() {
    // Get element
    const mainContainer = document.querySelector('main');
    const aboutPageLink = document.querySelector('#about');

    // Set the about page function
    aboutPageLink.addEventListener('click', async () => {
        // Fetch about page
        const res = await fetch('pages/about.html');
        const data = await res.text();
        mainContainer.innerHTML = data;
    });
})();

// Function 6: Search input function
(function searchCoin() {
    // Get element
    let searchInput = document.querySelector('#search-input');
 
    // Set the result page function - based on the markets page
    searchInput.addEventListener('search', async e => {
        // Get element
        const mainContainer = document.querySelector('main');
        const listReport = JSON.parse(localStorage.getItem('listReport'));
        // The value is set in line 599
        let checkIfExist;

        // Turning the value to lower case letters
        searchInput.value = searchInput.value.toLowerCase();
        
        // Check if value exists on the reportList
        if (listReport !== null) {
            checkIfExist = listReport.indexOf(searchInput.value) !== -1;
        }

        // Check if reportList exist in localStorage
        if (listReport !== null && checkIfExist) {
            // Fetch markets page
            const res = await fetch('pages/markets.html');
            const data = await res.text();
            mainContainer.innerHTML = data;
    
            // Get element
            const headerSection = document.querySelector('h2');
            headerSection.innerHTML = 'Search result';

            const coinContainer = document.querySelector('#coin-container');
            coinContainer.classList.add('coin-container-one');

            const spinner = document.querySelector('.spinner');

            // Returns the search input to the neutral state
            searchInput.classList.remove("not-found");
            searchInput.placeholder = 'Search';

            // Jump to the main section after pressing 'Enter'
            window.location='#main';
       
            // Fetch list of currencies
            try {
                spinner.style.display = 'flex';
                const res = await fetch('https://api.coingecko.com/api/v3/coins');
                const data = await res.json();
                spinner.style.display = 'none';

                // Seaerching for coins that are on the listReport
                for (let i = data.length -1; i >= 0; i--) {
                    for (let k = 0; k < listReport.length; k++) {
                        if (listReport[k] === searchInput.value && 
                            data[i].symbol === searchInput.value) {
                                // Creates a coin card
                                coinContainer.insertAdjacentHTML('afterbegin',
                                `<div class="card-coin">
                                    <div class="card-header">
                                        <button class="btn-favorite">
                                            <ion-icon name="heart" id="${data[i].symbol}"class='fav-star checked-star'></ion-icon>
                                        </button>
                                        <h3 id="card-title" class="card-title">
                                            ${data[i].name} <span>(${data[i].symbol})</span>
                                        </h3>
                                        <h4 id="crad-number">#${[i]}</h4>
                                    </div>
                                    <div class="more-info">
                                        <a class="more-content" id="${data[i].id}"><ion-icon name="information-circle-outline"></ion-icon> Click For More Info...</a>
                                    </div>
                                </div>`);   
                        }
                    }
                }
                // Clear search input
                searchInput.value = '';
            } catch (err) {
                console.error(err);
            }
        // Alert to the user if the coin doesn't exist
        } else if (searchInput.value !== '') {
            // Fetch alert message page
            const res = await fetch('pages/alertMessage.html');
            const data = await res.text();
            mainContainer.innerHTML = data;

            const alertHeader = document.querySelector('h2');
            alertHeader.innerHTML = 'No Result Found';

            // Jump to the main section after pressing 'Enter'
            window.location='#main';
            
            searchInput.className = 'not-found';
            searchInput.value = '';
            searchInput.placeholder = 'No Result Found';
        } 
    }); // End of the searchInput addEventLisitner
})(); // End of searchCoin function