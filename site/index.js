function openNav() {
	document.getElementById("data_panel").style["flex-basis"] = "70%";
	document.getElementById("graph_panel").style["flex-basis"] = "30%";
}

function closeNav() {
	document.getElementById("data_panel").style["flex-basis"] = "0";
	document.getElementById("graph_panel").style["flex-basis"] = "100%";
}

function panel(val) {
	["A", "B", "C"].forEach(v => document.getElementById(v).style["flex-basis"] = val == v ? "80%" : "10%");
}