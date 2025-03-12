# City-Planner-Simulator

A web-based city planning simulator that allows users to design city layouts by placing roads, buildings, and parks on a grid-based interface. Users can save, load, and edit city layouts, and simulate traffic flow.

## Features
- Interactive Grid (10x10) – Click to place roads, buildings, and parks.
- Save & Load Layouts – Store your designs in Supabase and reload them anytime.
- Undo Feature – Undo the last action to correct mistakes.
- Randomize Layout – Generate a random city layout for inspiration.
- Traffic Simulation (Coming Soon!) – Visualize high-traffic areas on roads.
- Export & Import Layouts (In Progress) – Save layouts as JSON files and reload them.

## Tech Stack
- Frontend: React.js (useState, useEffect)


- Backend: FastAPI (Python)


- Database: Supabase (PostgreSQL)

## Installation 
1. Clone the Repository 
- git clone https://github.com/sofiagzzloz/city-planner-simulator.git


- cd city-planner-simulator

2. Install Dependencies
- npm install

3. Run the react frontend (cd frontend)
- npm start

4. Run FastAPI backend (cd backend)
- uvicorn main:app --reload

## How to use
- Click a tile type (Road, Building, or Park).
- Click on the grid to place that tile.
- Save Layout to store your design in Supabase.
- Load Layouts from previous saved designs.
- Undo Last Change if you make a mistake.
- Clear Grid to start fresh.
- Randomize Layout to generate a random city.

## Contributing

Contributions are welcome! Follow these steps:
	1.	Fork the repository
	2.	Create a new branch (git checkout -b feature-name)
	3.	Commit changes (git commit -m "Added new feature")
	4.	Push to your fork (git push origin feature-name)
	5.	Open a Pull Request

## License
This project is licensed under the MIT License.

## Contact
- Developer: Sofia Gonzalez
- Email: [sofiagzzloz@gmail.com]
- GitHub: sofiagzzloz
