$(function () {
	console.log('links.js loaded ...');
	listenForGetLink();
	submitViaAjax()
	// getLinkComments();
})

// Show comments on click

function getLinkComments() {
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
		e.preventDefault();

		// debugger
		url = $(this.form).attr('action')
		//var commentText = document.getElementById("comment_body").innerHTML
		//var myJSON = JSON.stringify(commentText);
		
		data = {
			'authenticity_token': $("input[name='authenticity_token']").val(),
			'comment': {
				'content': $("#comment_body").val()
			}
		};

		//serializeddata = data.serialize()
		
		console.log(data);
		
		$.ajax({
			type: "POST",
			url: $(this).parent("form").attr("action") + "?authenticity_token=" + $("input[name='authenticity_token']").val(), 
			// data:$(this).parent("form").serialize(),
			dataType: "json",
		//   url: url,
			data: data,
			// headers: { 'Content-Type': 'application/json' },
			success: function (response) {
				debugger
				var $ul = $("div.comments_section ul");
				$ul.append(response)
				
			}
		}).done(function(response){
			debugger
			var $ul = $("div.comments_section ul");
			$ul.append(response)
		})
	})
};

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
}