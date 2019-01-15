$(function () {
	listenForGetLink();
})

// Show comments on click

$(function () {
	$("a.load_comments").on("click", function (e) {
		e.preventDefault();

		$.ajax({
			url: this.href,
			method: 'get',
			dataType: 'json'
		}).done(function (response) {

			$("div.comment").html(response)
			var comment_section = document.querySelector('.comments_section')

			response.forEach(function (comment) {
				var comment_body = `${comment.body}`
				comment_section.innerHTML += `${comment_body} <br> `
			});
		})
	})
});

// Submit comment via AJAX

$(function () {
	$("#new_comment").on("submit", function (e) {
		url = this.action
		var commentText = document.getElementById("comment_body").innerHTML
		var myJSON = JSON.stringify(commentText);

		data = {
			'authenticity_token': $("input[name='authenticity_token']").val(),
			'comment': {
				'content': $(myJSON).val()
			}
		};

		$.ajax({
			type: "POST",
			url: url,
			data: data,
			headers: { 'Content-Type': 'application/json' },
			success: function (response) {
				var $div = $("div.comments ul");
				$div.append(response)
			}
		})
		e.preventDefault();
	})
});

// Show a User's Links

$(function () {
	$("a.load_links").on("click", function (e) {
		$.get(this.href).success(function (response) {
			$("div.link").html(response)
			var link_section = document.querySelector('.links_section')

			response.forEach(function (link) {
				var link_title = `${link.title}`
				link_section.innerHTML += `${link_title} <br> `
			});
		})
		e.preventDefault();
	})
});


// Fetch a random link
function listenForGetLink() {
	$('#random-link').on('click', function (e) {
		e.preventDefault()
		let href = this.href
		getLinks(href)
	});
}

function getLinks(url) {
	fetch(url + '.json')
		.then(res => res.json()
			.then(data => {

				// data.map((link, index)=>{
				// 	let newLink = new Link(link)
				// })

				const link = new Link(data[0])
				const linkHTML = link.formatHtml()

				document.getElementById('random-link-spot').innerHTML = linkHTML

			}))
}

class Link {
	constructor(obj) {
		this.id = obj.id
		this.title = obj.title
		this.url = obj.url
	}
}

Link.prototype.formatHtml = function () {
	return (`
	<div>
		<p>${this.title}></p>
		<a href=${this.url}></a>
	</div>
	`)
}