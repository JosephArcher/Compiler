Joe's Compiler -Spring 2016
============

This is my Spring 2016 Compilers class project.

			// Define tree stuff
			var width = 500;
			var	height = 500;

			// Make dat tree
			var tree = d3.layout.tree()
				.size([height, width - 160]);

			// Random diagonal stuff just cause website does it also
			var diagonal = d3.svg.diagonal()
				.projection(function(d) { return [d.y, d.x]; });

			// Setup a place to draw this stuff out
			var svg = d3.select("#messages").append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform", "translate(40,0)");

			var treeData = [
				{
					"name": "Top Level",
					"parent": "null",
					"children": [
						{
							"name": "Level 2: A",
							"parent": "Top Level",
							"children": [
								{
									"name": "Son of A",
									"parent": "Level 2: A"
								},
								{
									"name": "Daughter of A",
									"parent": "Level 2: A"
								}
							]
						},
						{
							"name": "Level 2: B",
							"parent": "Top Level"
						}
					]
				}
			];

			var root = treeData[0];
			var nodes = tree.nodes(treeData),

				links = tree.links(nodes);

			var link = svg.selectAll("path.link")
				.data(links)
				.enter().append("path")
				.attr("class", "link")
				.attr("d", diagonal);

			var node = svg.selectAll("g.node")
				.data(nodes)
				.enter().append("g")
				.attr("class", "node")
				.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

			node.append("circle")
				.attr("r", 4.5);

			// node.append("text")
			// 	.attr("dx", function(d) { return d.children ? -8 : 8; })
			// 	.attr("dy", 3)
			// 	.attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
			// 	.text(function(d) { return d.name; });

