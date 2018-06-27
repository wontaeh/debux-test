  function BuildVerticalTree(treeData, treeContainerDom) {
      let margin = { top: 40, right: 120, bottom: 20, left: 120 };
      let width = 960 - margin.right - margin.left;
      let height = 500 - margin.top - margin.bottom;

      let i = 0, duration = 750;
      
      let tree = d3.layout.tree()
        .size([height, width]);
        
      let diagonal = d3.svg.diagonal()
        .projection((d) => { return [d.x, d.y]; });
        
      let svg = d3.select(treeContainerDom)
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      root = treeData;

      update(root);
      
      function update(source) {
        // Compute the new tree layout.
        let nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);
          
        // Normalize for fixed-depth.
        nodes.forEach((d) => { d.y = d.depth * 100; });
        
        // Declare the nodes
        let node = svg.selectAll("g.node")
          .data(nodes, (d) => { return d.id || (d.id = ++i); });
          
        // Enter the nodes.
        let nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", (d) => {
            return "translate(" + source.x0 + "," + source.y0 + ")";
          }).on("click", nodeclick);
          
        nodeEnter.append("circle")
          .attr("r", 10)
          .attr("stroke", (d) => { return d.children || d._children ? "steelblue" : "#00c13f"; })
          .style("fill", (d) => { return d.children || d._children ? "lightsteelblue" : "#fff"; });

        nodeEnter.append("text")
          .attr("y", (d) => {
            return d.children || d._children ? -18 : 18;
          })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text((d) => { return d.name; })
          .style("fill-opacity", 1e-6);
          
        // Transition nodes to their new position.
        //horizontal tree
        let nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", (d) => { return "translate(" + d.x + "," + d.y + ")"; });
        nodeUpdate.select("circle")
          .attr("r", 10)
          .style("fill", (d) => { return d._children ? "lightsteelblue" : "#fff"; });
        nodeUpdate.select("text")
          .style("fill-opacity", 1);


        // Transition exiting nodes to the parent's new position.
        let nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", (d) => { return "translate(" + source.x + "," + source.y + ")"; })
          .remove();
        nodeExit.select("circle")
          .attr("r", 1e-6);
        nodeExit.select("text")
          .style("fill-opacity", 1e-6);
        // Update the links…
        // Declare the links…
        let link = svg.selectAll("path.link")
          .data(links, (d) => { return d.target.id; });
          
        // Enter the links.
        link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", (d) => {
              let o = { x: source.x0, y: source.y0 };
              return diagonal({ source: o, target: o });
          });
        // Transition links to their new position.
        link.transition()
          .duration(duration)
          .attr("d", diagonal);


        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
          .duration(duration)
          .attr("d", (d) => {
              let o = { x: source.x, y: source.y };
              return diagonal({ source: o, target: o });
          })
          .remove();

        // Stash the old positions for transition.
        nodes.forEach((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      // Toggle children on click.
      function nodeclick(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
    }

  BuildVerticalTree(treeData, "#tree");