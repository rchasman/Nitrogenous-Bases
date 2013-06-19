var width = 1240,
    height = 700;

var color = d3.scale.category10();

var radius = d3.scale.sqrt()
    .range([0, 6]);

var svg = d3.select(".box").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "canvas");


var force = d3.layout.force()
    .size([width, height])
    .charge(-200)
    .linkDistance(function(d) {
        return radius(d.source.size) + radius(d.target.size) ; });

function create_molecule(){
        molecule = set_molecule($("#type").val())
        draw_molecule(molecule)
}

function set_molecule(type){
    switch(type){
        case "a":
            return "js/molecule/adenine.json"
        case "c":
            return "js/molecule/cytosine.json"
        case "t":
            return "js/molecule/thymine.json"
        case "g":
            return "js/molecule/guanine.json"
    }
}

function draw_molecule(molecule) {
    scale = "scale(.50)"
    d3.json(molecule, function(graph) {
        force.nodes(graph.nodes)
        .links(graph.links)
        .on("tick", tick)
        .start();

        var text = svg.append("text")
            .text($("#type option:selected").text())
            .attr("x", 50)
            .attr("y", 50)
            .attr("font-size", "20px");

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("g")
            .attr("class", "link");

        link.append("line")
            .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

        link.filter(function(d) { return d.bond > 1; }).append("line")
            .attr("class", "separator");

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        node.append("circle")
            .attr("r", function(d) { return radius(d.size); })
            .attr("transform", scale)
            .style("fill", function(d) { return color(d.atom); });

        node.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("font-size", ".25em")
            .text(function(d) { return d.atom; });

        function tick() {
            link.selectAll("line")
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"
            });
        }
    });
};

function clear_molecule() {
    $("#canvas").text("")
}
