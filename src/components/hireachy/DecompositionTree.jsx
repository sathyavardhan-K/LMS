import React, { useState, useEffect } from "react";
import { Tree } from "react-d3-tree";
import hierarchy from "./DataStucture";
import domo from "ryuu.js";

const DecompositionTreeChart = () => {
  const [data, setData] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await domo.get(`/data/v1/tree`);
        const treedata = hierarchy(apiData);
        setData(addParentToNodes(treedata));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addParentToNodes = (node, parent = null) => {
    node.parent = parent;
    if (node.children) {
      node.children = node.children.map((child) =>
        addParentToNodes(child, node)
      );
    }
    return node;
  };

  const handleNodeClick = (nodeData) => {
    if (nodeData.children) {
      nodeData._collapsed = !nodeData._collapsed;
      setData((prevData) => ({ ...addParentToNodes(prevData) }));
    }
  };

  const renderRectSvgNode = ({ nodeDatum, toggleNode }) => {
    return (
      <g onClick={toggleNode}>
        <rect
          x="-75"
          y="-30"
          width="205"
          height="85"
          fill="white"
          stroke="#00A69A"
          rx="10"
          ry="10"
        />
        <rect
          x="-74"
          y="-30"
          width="203"
          height="20"
          fill="#FCEB61"
          stroke="none"
          rx="7"
        />
        
        {nodeDatum.name && (
          <text
            x="29"
            y="18"
            textAnchor="middle"
            fontSize="14"
            fontWeight="200"
            letterSpacing="1px"
          >
            {nodeDatum.name}
          </text>
        )}
        {nodeDatum.attributes?.total && (
          <text
            x="27"
            y="40"
            textAnchor="middle"
            fontSize="16"
            fontWeight="200"
            letterSpacing="1px"
          >
            RM {nodeDatum.attributes.total.toFixed(2)}
          </text>
        )}
      </g>
    );
  };

  const treeConfig = {
    transitionDuration: 500,
    nodeSize: { x: 400, y: 100 },
    separation: { siblings: 1, nonSiblings: 4 },
    linkType: "step",
  };

  if (!data) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          marginTop: "20px",
          fontSize: "20px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#02afaa",
      }}
    >
      <Tree
        data={data}
        orientation="horizontal"
        translate={{ x: 150, y: 200 }}
        collapsible={true}
        initialDepth={0}
        transitionDuration={treeConfig.transitionDuration}
        nodeSize={treeConfig.nodeSize}
        separation={treeConfig.separation}
        draggable={true}
        zoomable={true}
        onClick={handleNodeClick}
        renderCustomNodeElement={renderRectSvgNode}
        pathFunc="step"
      />
    </div>
  );
};

export default DecompositionTreeChart;
