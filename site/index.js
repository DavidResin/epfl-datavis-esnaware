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