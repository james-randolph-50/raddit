$(function () {
	console.log('links.js loaded...');
	listenForGetLink();
	submitViaAjax()
	sortComments()
	getLinkComments();
})

// Show comments on click

function getLinkComments() {
	'use strict';
	$("button.load_comments").on("click", function (e) {
		e.preventDefault();

		let id = this.id
		// http://localhost:3000/links/:id/comments

		$.ajax({
			url: `http://localhost:3000/links/${id}`,
			method: 'get',
			dataType: 'json'
		}).done(function (response) {

			//$("div.comment").html(response)
			var comment_section = document.querySelector('.comments_section')

			response.comments.forEach(function (comment) {
				//var comment_body = `${comment.body}`
				comment_section.innerHTML += `${comment.body} <br> `
			});
		})
	})
};

// Submit comment via AJAX

function submitViaAjax() {
	$("#new_comment_button").on("click", function (e) {
		
		url = $(this.form).attr('action')
		//debugger;
		data = {
			'comment': {
				'body': $("#comment_body").val()
			}
		};
		
		myJSON = JSON.stringify(data);
		//debugger;
		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			url: url,
			data: myJSON,
			// headers: { 'Content-Type': 'application/json' },
			success: function(response) {
				//textToUpload = $("#comment_body").val("");
				textToUpload = document.getElementById("comment_body").value;		
				var $ul = $("div.comments_section ul")
				$ul.append('<li>' + response.body + '</li>');
				$('#comment_body').val('');
			}
		})
		e.preventDefault();
	})
};

// Sort Comments

function sortComments() {
	$("#sort_comments").on("click", function (e) {
		e.preventDefault();
		var buttonData = document.getElementById("sort_comments").dataset.linkid

		fetch(`/links/${buttonData}/comments.json`)
		  .then(r => r.json())
		  .then(comments => {
			const sortedComments = comments.sort(({body: a}, {body: b}) => a.localeCompare(b))
				
			var $ul = $("div.comments_section ul")

				for(const comment of sortedComments) {
					var $li = $('<li>');
					$li.text(comment.body);

					$ul.val('');
					$ul.append($li)
				}
			})
		  })
		}

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
	});
});


// Fetch all links
function listenForGetLink() {
	$('a#show-links').on('click', function (e) {
		e.preventDefault()
		let url = this.href
		fetch(url + '.json')
			.then(res => res.json()
				.then(data => {
					data.forEach((link) => {
						let newLink = new Link(link)
						let linkHTML = newLink.formatHtml()
						$('div#links-index').append(linkHTML)
					})
					getLinkComments();
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
			<a href="http://localhost:3000/links/${this.id}" style="font-size: 2em;">${this.title}</a>

			<div class="comments_section"></div><br>
			<button class='load_comments' id=${this.id}>Show comments</button><br><hr>
		</div>
	`)
};