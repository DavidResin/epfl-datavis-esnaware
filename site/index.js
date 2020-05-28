var panel_data = [];

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("data_panel.json", function(text){
    panel_data = JSON.parse(text);
    console.log(panel_data);
});

function openNav() {
	var s = document.getElementsByTagName('p');

	for (i = 0; i < s.length; i++) {
		s[i].style["opacity"] = "1";
		s[i].style["transition-delay"] = "1s";
	}

	document.getElementById("data_panel").style["transition-delay"] = "0s";
	document.getElementById("graph_panel").style["transition-delay"] = "0s";
	document.getElementById("main_panel").style["transition-delay"] = "0.5s";
	document.getElementById("right_panel").style["transition-delay"] = "0.5s";
	document.getElementById("descr_panel").style["transition-delay"] = "0s";
	document.getElementById("content_panel").style["transition-delay"] = "0s";
	document.getElementById("title_panel").style["transition-delay"] = "0s";

	document.getElementById("data_panel").style["flex-basis"] = "70%";
	document.getElementById("graph_panel").style["flex-basis"] = "30%";
	document.getElementById("main_panel").style["flex-basis"] = "75%";
	document.getElementById("right_panel").style["flex-basis"] = "25%";
	document.getElementById("descr_panel").style["flex-basis"] = "20%";
	document.getElementById("content_panel").style["flex-basis"] = "70%";
	document.getElementById("title_panel").style["flex-basis"] = "10%";
}

function closeNav() {
	var s = document.getElementsByTagName('p');

	for (i = 0; i < s.length; i++) {
		s[i].style["opacity"] = "0";
		s[i].style["transition-delay"] = "0s";
	}

	document.getElementById("data_panel").style["transition-delay"] = "0.7s";
	document.getElementById("graph_panel").style["transition-delay"] = "0.7s";
	document.getElementById("main_panel").style["transition-delay"] = "0.2s";
	document.getElementById("right_panel").style["transition-delay"] = "0.2s";
	document.getElementById("descr_panel").style["transition-delay"] = "0.7s";
	document.getElementById("content_panel").style["transition-delay"] = "0.7s";
	document.getElementById("title_panel").style["transition-delay"] = "0.7s";

	document.getElementById("data_panel").style["flex-basis"] = "7.5%";
	document.getElementById("graph_panel").style["flex-basis"] = "92.5%";
	document.getElementById("main_panel").style["flex-basis"] = "100%";
	document.getElementById("right_panel").style["flex-basis"] = "0";
	document.getElementById("descr_panel").style["flex-basis"] = "0";
	document.getElementById("content_panel").style["flex-basis"] = "0";
	document.getElementById("title_panel").style["flex-basis"] = "100%";
}

function panel(val) {
	["A", "B", "C"].forEach(v => document.getElementById(v).style["flex-basis"] = val == v ? "80%" : "10%");
	["A", "B", "C"].forEach(v => document.getElementById(v).style["background-color"] = val == v ? "#8D8" : "#7A7");
}

var getJSON = function(url, callback) {
		const proxy_url = "https://cors-anywhere.herokuapp.com/"
    var xhr = new XMLHttpRequest();
    xhr.open('GET', proxy_url + url, true);
    xhr.responseType = 'json';

    xhr.onload = function() {

        var status = xhr.status;

        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };

    xhr.send();
};


function test_panel(id) {
	document.getElementById("image-panel").setAttribute("src", '');
	console.log(id);
	const test = panel_data[id];
	document.getElementById("summary").innerHTML = test['summary'];
	document.getElementById("title_panel").innerHTML = test['title'];
	document.getElementById("link").setAttribute("href", test['link']);
	document.getElementById("link").innerHTML = test['title'];
	document.getElementById('content-category').innerHTML = "<strong>Category:<strong> " + test['category'];
	document.getElementById('content-topic').innerHTML = "<strong>Dominant LDA Topic:</strong> " + test['topic'];
	document.getElementById('keywords-list').innerHTML = "<li>" + test['topic_keywords'].join("</li><li>") + "</li>";
	document.getElementById("link").setAttribute("href", test['link']);
	getJSON("https://en.wikipedia.org/w/api.php?action=query&titles=" + test['title'] + "&prop=pageimages&format=json&pithumbsize=300",
					function(err, data) {
						if (err != null) {
							console.error(err);
						} else {
							console.log(data);
							page = data['query']['pages']
							page_id = Object.keys(page)[0]
							img_link = page[page_id]['thumbnail']['source'];
							document.getElementById("image-panel").setAttribute("src", img_link);
						}
					}
				);

}
