// Initialize Parse app
Parse.initialize("LWWRftJpcr62loKrOCunPNzep72k5qbZr9aJcnWi", "Khcqr1X3mSIq6z9JeB2hqYuqrhlJfMpJ8KgrECZU");

// Create a new sub-class of the Parse.Object, with name "Music"
var Review = Parse.Object.extend('Review');
$('#ratings').raty({path: 'raty-2.7.0/lib/images'});

// Click event when form is submitted
$('form').submit(function() {
	var review = new Review();
	review.set('revTitle', $(revTitle).val());
	review.set('revDescription', $(revDescription).val());
	review.set('revRating', $('#ratings').raty('score'));
	review.set('likes', 0);
	review.set('dislikes', 0);

	if ($(revTitle).val() == '') {
		alert("You need a title and rating to submit a review");
	}

	$(revTitle).val('');
	$(revDescription).val('');
	$('#ratings').raty({ score: 0, path: 'raty-2.7.0/lib/images'});

	review.save(null, {
		success: getData
	});
	return false;
})


// Write a function to get data
var getData = function() {
	var query = new Parse.Query(Review);

	// Set a parameter for your query -- where the properties isn't missing
	query.notEqualTo('revTitle', '');
	//query.exists('revReview');
	//query.notEqualTo('revReview', 'undefined');
	query.find({
		success:buildList
	});
}


// A function to build your list
var buildList = function(data) {
	$('ul').empty();
	var count = 0;
	var total = 0;

	data.forEach(function(item){
		addItem(item);
		count++;
		total += item.get('revRating');
	})
	var average = total / count;
	$('#averageRatings').raty({readOnly: true, score: average, path: 'raty-2.7.0/lib/images'});
}


// This function takes in an item, adds it to the screen
var addItem = function(item) {
	var revTitle = item.get('revTitle');
	var revDescription = item.get('revDescription');
	var revRating = item.get('revRating');
	var likes = item.get('likes');
	var dislikes = item.get('dislikes');
	
	var li = $('<div id="reviewBox">').html("<h4><b>" + revTitle + "</b></h4>" + revDescription + "<br>");
	var stars = $('<span id="stars">').raty({readOnly: true, score: revRating, path: 'raty-2.7.0/lib/images'});
	var helpful = $('<div id="likes">').html(likes + " out of " + (dislikes + likes) + " people found this helpful");
	
	var likeButton = $('<button class="btn-xs btn-info"><span class ="glyphicon glyphicon-thumbs-up"></span></button>');
	likeButton.on('click', function(){
		item.increment('likes');
		item.save();
		getData();
	});

	var dislikeButton = $('<button class="btn-xs btn-info"><span class ="glyphicon glyphicon-thumbs-down"></span></button>');
	dislikeButton.on('click', function(){
		item.increment('dislikes');
		item.save();
		getData();
	});
	
	var removeButton = $('<button id="removeButton" class="btn-xs btn-danger"><span class ="glyphicon glyphicon-trash"></span></button>');
	removeButton.on('click', function(){
		item.destroy({
			success:getData
		})
	});
	
	li.prepend(stars);
	li.prepend(removeButton);
	li.append(likeButton);
	li.append(dislikeButton);
	li.append(helpful);
	$('ul').prepend(li);
}

// Call your getData function when the page loads
getData();
