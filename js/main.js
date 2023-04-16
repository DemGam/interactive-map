const tooltip = document.querySelector('.tooltip');
const provinces = document.querySelectorAll('.map__section');
const popupBg = document.querySelector('.info__wrapper');
const popup = document.querySelector('.info__card');
const description = popup.querySelector('.info__description');
const emblemWrapper = popup.querySelector('.info__image-wrapper');
const emblem = popup.querySelector('.info__image');
const loadingBG = window.getComputedStyle(emblemWrapper).background;

//==========================================
provinces.forEach(province => {
	province.addEventListener('click', function () {

		let wikiImgEnd = this.dataset.image;
		let title = this.dataset.title;
		let dataDescription = this.dataset.description;
		let wikiLinkEnd = title.replaceAll(' ', '_');
		const wikiUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=';

		popup.querySelector('.info__title').innerText = title;
		description.innerText = 'Loading...';

		if (dataDescription) {
			description.innerText = dataDescription;
			showMoreLink();

		} else {
			console.log('start fetch');
			//Send request to wiki API
			fetch(wikiUrl + wikiLinkEnd + '&origin=*')
				.then(function (response) {
					console.log('get responce');
					return response.json();
				})
				.then(function (data) {
					const pages = data.query.pages;
					for (let page in pages) {
						const extract = pages[page].extract;
						const firstParagraph = extract.split('\n')[0];

						//Change the description text in popup
						description.innerText = firstParagraph;

						//Change the description attribute
						province.dataset.description = firstParagraph;

						showMoreLink();
					}
				})
				.catch(function (error) {
					console.log(error);
					description.innerText = error;
				});
		}

		//Change and show "More" link
		function showMoreLink() {
			popup.querySelector('.info__link').setAttribute('href', 'https://en.wikipedia.org/wiki/' + title);
			popup.querySelector('.info__link').style.display = 'inline-block';
		};
		console.log('start image');
		emblem.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/' + wikiImgEnd);

		//Hide loading animation and show the province emblem after it was loaded
		emblem.addEventListener('load', onEmblemLoad);
		function onEmblemLoad() {
			emblemWrapper.style.background = 'unset';
			emblem.style.visibility = 'visible';
			console.log('get image');
			emblem.removeEventListener('load', onEmblemLoad);
		}

		//Add "active" class to popup background
		popupBg.classList.add('active');
	});

	//Check the window width while resize
	let winWidth = window.innerWidth;

	window.addEventListener('resize', function (event) {
		winWidth = window.innerWidth;
	}, true);

	//Display the tooltip when mouse enter the province
	let tooltipWidth;
	let tooltipHeight;

	province.addEventListener('mouseenter', function () {
		if (winWidth >= 480) {
			tooltip.style.display = 'block';
			//Set delay to get tooltip size for avoiding the js slow engine
			setTimeout(getTooltipSize, 1);
		};
	});


	function getTooltipSize() {
		tooltipWidth = tooltip.getBoundingClientRect().width;
		tooltipHeight = tooltip.getBoundingClientRect().height
	};

	//Hide the tooltip when mouse leave the province
	province.addEventListener('mouseleave', function () {
		tooltip.style.display = 'none';
	});

	//Move the tooltip along mouse cursor
	province.addEventListener('mousemove', function (e) {
		tooltip.innerText = this.dataset.title;
		tooltip.style.top = (e.y - tooltipHeight - 12) + 'px';

		if (winWidth >= 640) {
			if (e.x > winWidth * 0.75) {
				tooltip.style.left = (e.x - tooltipWidth - 20) + 'px';
			} else {
				tooltip.style.left = (e.x + 20) + 'px';
			};
		};

		if (winWidth < 640) {
			if (e.x > winWidth * 0.5) {
				tooltip.style.left = (e.x - tooltipWidth - 20) + 'px';
			} else {
				tooltip.style.left = (e.x + 20) + 'px';
			};
		};

		// let tooltipX;
		// let tooltipY = e.clientY - tooltipHeight - 12;
		// if (e.x > winWidth * 0.75) {
		// 	tooltipX = e.clientX - tooltipWidth - 20;
		// } else {tooltipX = e.clientX + 20;};
		// tooltip.style.transform = `translate(${tooltipX}px, ${tooltipY}px)`;
	});
});

//Close the popup when click out of info card
document.addEventListener('click', (e) => {
	const buttonClose = popup.querySelector('.info__close');
	if (e.target === popupBg || e.target === buttonClose) {
		e.preventDefault();
		popupBg.classList.remove('active');

		//Show default loading animation and hide province emblem
		emblemWrapper.style.background = loadingBG;
		emblem.style.visibility = 'hidden';

		//Hide the show more link
		popup.querySelector('.info__link').style.display = 'none';
	}
})

