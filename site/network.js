document.addEventListener('DOMContentLoaded', redraw);

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

function redraw() {
  var svg = d3.select("svg");
  var width = window.innerWidth;
  var height = window.innerHeight;

  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().strength(0).id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(d => Math.sqrt(60)));

  d3.json("data_viz_reduced.json", function(error, graph) {
    d3.json("data_viz_reduced.json", function(error2, graph2) {
      if (error) throw error;
      if (error2) throw error2;

      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", 2);

      var node = svg.append("g")
        .attr("class", "node")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g");

      var circles = node.append("circle")
        .on("click", clickNode)
        .on("mouseover", function(d) {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(d.label)
                  .style("left", (d3.event.pageX + 10) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
              div.transition()
                  .duration(500)
                  .style("opacity", 0);
          });

      svg.selectAll("text")
        .data([[-1, -1, "Problems"], [1, -1, "Solutions"], [-1, 1, "Causes"], [1, 1, "Consequences"]])
        .enter()
        .append("text")
        .attr("x", d => width * (3 + d[0]) / 6)
        .attr("y", d => height * (2 + d[1]) * 2 / 20)
        .style("opacity", 0)
        .style("transition", ".5s")
        .style("text-anchor", "middle")
        .text(d => d[2]);

      resetStyle();

      node.append("title")
        .text(function(d) { return d.id; });

      simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

      simulation.force("link")
        .links(graph.links);

      d3.select("#cross").on("click", sim);

      function resetStyle() {
        d3.selectAll("circle")
            .attr("r", 10)
            .attr("fill", "grey");

        link.attr("stroke-width", 2);

        d3.selectAll("text")
          .style("opacity", 0);
      }

      function sim() {
        closeNav();
        d3.select("svg").style("height", "100vh");
        setTimeout(nudge, 1000);
      }

      function updatePanel() {

      }

      function nudge() {
        height = window.innerHeight;
        resetStyle();

        simulation
          .force("link", d3.forceLink().id(function(d) { return d.id; }))
          .force("charge", d3.forceManyBody())
          .force("x", d3.forceX(width / 2))
          .force("y", d3.forceY(height / 2))
          .force("collide", d3.forceCollide(d => Math.sqrt(60)))
          .alphaTarget(0.2)
          .restart();
      }

      function ticked() {
        link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        node
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          })

        node
          .attr("cx", function(d) {
            return d.x = Math.max(30, Math.min(width - 30, d.x));
          })
              .attr("cy", function(d) {
                return d.y = Math.max(30, Math.min(height - 30, d.y));
              });
      }

      function clickNode(d) {
        openNav();
        height = window.innerHeight * .4;
        d3.selectAll("text")
          .style("opacity", 1);

        d3.select("#image-panel").attr("src", '');
        const panel = graph['panel'][d.id];
        console.log(panel);
        d3.select("#title_panel").text(panel['title']);
        d3.select("#summary").text(panel['summary']);
        d3.select("#link").attr("href", panel['link']);
        d3.select("#link").text(panel['title']);
        d3.select("#content-category").html("<strong>Category:<strong> " + panel['category']);
        d3.select('#content-topic').html("<strong>Dominant LDA Topic:</strong> " + panel['topic']);
        d3.select("#keywords-list").html("<li>" + panel['topic_keywords'].join("</li><li>") + "</li>");
        d3.select("#link").attr("href", panel['link']);
      	getJSON("https://en.wikipedia.org/w/api.php?action=query&titles=" + panel['title'] + "&prop=pageimages&format=json&pithumbsize=300",
      					function(err, data) {
      						if (err != null) {
      							console.error(err);
      						} else {
      							console.log(data);
      							var page = data['query']['pages'];
      							var page_id = Object.keys(page)[0];
                    if('thumbnail' in page[page_id]){
						          var img_link = page[page_id]['thumbnail']['source'];
			                d3.select("#image-panel").attr("src", img_link);
                    }
      						}
      					}
      				);

        d3.select("#A > .issue-content > p").text("Causes of node " + d.label);
        d3.select("#B > .issue-content > p").text("Consequences of node " + d.label);
        d3.select("#C > .issue-content > p").text("Problems of node " + d.label);
        d3.select("#D > .issue-content > p").text("Solutions of node " + d.label);

        let nb0 = graph.links.filter(e => e.source.id == d.id && e.type == "cc").map(e => e.target.id);
        let nb1 = graph.links.filter(e => e.source.id == d.id && e.type == "ps").map(e => e.target.id);
        let nb2 = graph.links.filter(e => e.target.id == d.id && e.type == "cc").map(e => e.source.id);
        let nb3 = graph.links.filter(e => e.target.id == d.id && e.type == "ps").map(e => e.source.id);

        let nbs = nb0.concat(nb1).concat(nb2).concat(nb3);

        let lineIds = graph.links.filter(e => (e.source.id == d.id || e.target.id == d.id) && (e.type != 'na')).map(e => e.index);

        let forceX = d3
          .forceX().x(e => (2 + (((nb0.concat(nb1)).includes(e.id) ? 1 : (nb2.concat(nb3)).includes(e.id) ? -1 : 0))) * width / 4)
          .strength(e => e.id == d.id ? .6 : nbs.includes(e.id) ? 0.25 : 0.005);

        let forceY = d3
          .forceY().y(e => (2 + (((nb0.concat(nb2)).includes(e.id) ? .8 : (nb1.concat(nb3)).includes(e.id) ? -.8 : 0))) * height / 4)
          .strength(e => e.id == d.id ? .6 : nbs.includes(e.id) ? 0.05 : 0.005);

        let forceOthers = d3
          .forceManyBody()
          .strength(e => e.id == d.id || nbs.includes(e.id) ? 0 : -0.5);

        // others are weak centered and grey with no links
        node.selectAll("circle")
          .attr("r", 10)

        node.selectAll("circle")
          .filter(e => !nbs.includes(e.id) && e.id != d.id)
          .attr("r", 6)
          .attr("fill", "#CCC");

        node.selectAll("circle")
          .filter(e => e.id == d.id)
          .attr("r", 25)

        node.selectAll("circle")
          .filter(e => d.id == e.id)
          .attr("fill", "#999933");

        node.selectAll("circle")
          .filter(e => nbs.includes(e.id))
          .attr("fill", "#88ccee");

        link
          .attr("stroke-width", function(e) {return lineIds.includes(e.index) ? "2" : "0"});

        simulation
          .force("x", forceX)
          .force("y", forceY)
          .force("others", forceOthers)
          .force("link", d3.forceLink().strength(0).id(function(d) { return d.id; }))
          .alphaTarget(0.2)
          .restart();
      }
    });
  });
}
