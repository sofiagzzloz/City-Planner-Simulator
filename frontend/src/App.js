import React, { useState, useEffect } from "react";
import "./App.css";

const BACKEND_URL = "http://127.0.0.1:8000"; // FastAPI Backend

const CityPlanner = () => {
  const GRID_SIZE = 10;
  const EMPTY = "empty";
  const ROAD = "road";
  const BUILDING = "building";
  const PARK = "park";

  const [cityGrid, setCityGrid] = useState(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(EMPTY))
  );
  const [selectedTile, setSelectedTile] = useState(ROAD);
  const [layouts, setLayouts] = useState([]); // Archive list
  const [history, setHistory] = useState([]); // Store previous states

  useEffect(() => {
    fetchLayouts(); // Load saved layouts on startup
  }, []);

  const handleTileClick = (row, col) => {
    setHistory((prevHistory) => [...prevHistory, cityGrid]); // Save state before change
    const newGrid = cityGrid.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? selectedTile : cell
      )
    );
    setCityGrid(newGrid);
  };

  // ✅ Save Layout to Backend
  const saveLayout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/save-layout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grid_data: cityGrid }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Layout saved:", data);
        alert(`Layout saved! ID: ${data.id}`);
        fetchLayouts(); // Reload archive
      } else {
        console.error("Error saving layout:", data.detail);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✅ Fetch all saved layouts from Supabase
  const fetchLayouts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/get-layouts/`); // Backend route to get all layouts
      const data = await response.json();

      if (response.ok) {
        setLayouts(data.layouts);
      } else {
        console.error("Error fetching layouts:", data.detail);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loadLayout = async (id) => {
    try {
      console.log("Fetching layout with ID:", id); // ✅ Debugging
      const response = await fetch(`${BACKEND_URL}/load-layout/${id}`);
      const data = await response.json();
      console.log("Received Response:", data); // ✅ Debugging

      if (response.ok) {
        if (data.layout && data.layout.grid_data) {
          console.log("Loaded Grid Data:", data.layout.grid_data);
          setCityGrid(data.layout.grid_data);
        } else {
          console.error("Invalid layout format:", data);
          alert("Error: Layout data is not in the correct format.");
        }
      } else {
        console.error("Error loading layout:", data.detail);
        alert("Error: Could not load layout.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: Could not fetch layout.");
    }
  };

  const clearGrid = () => {
    setCityGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(EMPTY)));
  };

  const randomizeGrid = () => {
    const tileTypes = [EMPTY, ROAD, BUILDING, PARK];
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE).fill(null).map(() => tileTypes[Math.floor(Math.random() * tileTypes.length)])
      );
    setCityGrid(newGrid);
  };

  const undoLastChange = () => {
    if (history.length > 0) {
      setCityGrid(history[history.length - 1]); // Restore previous state
      setHistory(history.slice(0, -1)); // Remove last history entry
    }
  };

  return (
    <div className="container">
      <h1>City Planner Simulator</h1>

      {/* Controls */}
      <div className="controls">
        <button onClick={() => setSelectedTile(ROAD)}>Road</button>
        <button onClick={() => setSelectedTile(BUILDING)}>Building</button>
        <button onClick={() => setSelectedTile(PARK)}>Park</button>
        <button onClick={saveLayout}>Save Layout</button>
        <button onClick={clearGrid} style={{ backgroundColor: "red", color: "white" }}>Clear Grid</button>
        <button onClick={randomizeGrid} style={{ backgroundColor: "purple", color: "white" }}>Randomize Layout</button>
        <button onClick={undoLastChange} style={{ backgroundColor: "orange", color: "white" }}>Undo</button>
      </div>

      <div className="grid" style={{ 
  display: "grid",
  gridTemplateColumns: `repeat(10, 32px)`, // Force correct columns
  gridTemplateRows: `repeat(10, 32px)`, // Force correct rows
  gap: "2px"
}}>
  {cityGrid.map((row, rowIndex) =>
    row.map((cell, colIndex) => (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={`cell ${cell}`}
        onClick={() => handleTileClick(rowIndex, colIndex)}
        style={{
          width: 30,
          height: 30,
          border: "1px solid black",
          backgroundColor:
            cell === ROAD
              ? "gray"
              : cell === BUILDING
              ? "brown"
              : cell === PARK
              ? "green"
              : "white",
        }}
      ></div>
    ))
  )}
</div>

      {/* Archive Section */}
      <div className="archive">
        <h2>Past Layouts</h2>
        {layouts.length === 0 ? (
          <p>No layouts saved yet.</p>
        ) : (
          <ul>
            {layouts.map((layout) => (
              <li key={layout.id}>
                <button onClick={() => loadLayout(layout.id)}>
                  Load Layout {layout.id}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CityPlanner;

