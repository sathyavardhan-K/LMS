import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface TreeProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

const TreeChart: React.FC<TreeProps> = ({ data, width = 1300, height = 600 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data) return;

    // Create the tree layout with padding
    const treeLayout = d3.tree<TreeNode>().size([width - 10, height - 200]); // Adjust width/height for padding
    const root = d3.hierarchy<TreeNode>(data);

    // Apply the tree layout
    treeLayout(root);

    // Select the SVG element and clear any existing content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create a group element and translate it to the center of the SVG
    const g = svg
      .append("g")
      .attr("transform", `translate(100, 100)`); // Adjust the position to center the tree

    // Draw links (edges between nodes)
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", (d) => {
        const source = d.source as d3.HierarchyPointNode<TreeNode>;
        const target = d.target as d3.HierarchyPointNode<TreeNode>;
        return `M${source.x},${source.y}C${source.x},${(source.y + target.y) / 2} ${target.x},${(source.y + target.y) / 2} ${target.x},${target.y}`;
      })
      .attr("fill", "none")
      .attr("stroke", "#ccc");

    // Draw nodes (circles for each node)
    const nodes = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    nodes
      .append("circle")
      .attr("r", 5)
      .attr("fill", "steelblue");

    // Add text labels to nodes
    nodes
      .append("text")
      .attr("dy", ".35em")
      .attr("x", (d) => (d.children ? -10 : 10))
      .style("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name);
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default TreeChart;
