$(function () {
	console.log('links.js loaded ...');
	listenForGetLink();
	// getLinkComments();
})

// Show comments on click

function getLinkComments() {
	$("button.load_comments").on("click", function (e) {
		e.preventDefault();

		let id = this.id
		// http://localhost:3000/links/:id/comments

		$.ajax({
			url: `http://localhost:3000/links/${id}/comments`,
			method: 'get',
			dataType: 'json'
		}).done(function (response) {

			debugger;
			$("div.comment").html(response)
			var comment_section = document.querySelector('.comments_section')

			response.forEach(function (comment) {
				var comment_body = `${comment.body}`
				comment_section.innerHTML += `${comment_body} <br> `
			});
		})
	})
};

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


// Fetch all links
function listenForGetLink() {
	$('a#show-links').on('click', function (e) {
		e.preventDefault()
		let url = this.href
		fetch(url + '.json')
			.then(res => res.json()
				.then(data => {
					data.map((link, index) => {
						let newLink = new Link(link)
						let linkHTML = newLink.formatHtml()
						// document.querySelector('div#links-index').append(linkHTML)
						// document.querySelector('div#links-index').innerHTML += linkHTML
						$('div#links-index').append(linkHTML)
					})
					getLinkComments();
					// document.getElementById('random-link-spot').innerHTML = linkHTML
				}))
	})
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
			<a href=${this.url}>${this.title}</a><br>
			<button class='load_comments' id=${this.id}>Show comments</button>
		</div>
	`)
}