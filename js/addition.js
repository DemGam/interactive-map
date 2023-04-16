const button = document.querySelectorAll('.action');
const card = document.querySelector('.card')



button.forEach(button => {
	button.addEventListener('click', function () {
		card.querySelector('.title').innerText = this.dataset.title;
		// card.querySelector('.text').innerText = this.dataset.description;

		// parse(this.dataset.source)
		// 	.then((response) => response.json())
		// 	.then((data) => console.log(data));
		// card.querySelector('.text').innerText = mydata;

		fetch(this.dataset.source)
			.then((data) => console.log(data))
		// .then((response) => response.json())
		// .then((response) => console.log(response.text))


	});
})
