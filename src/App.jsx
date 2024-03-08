import "./App.css";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { BackgroundDesign } from "./components/utils/backgroundDesign";
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import { useState } from "react";
import { Home } from "./pages/home";
import { Friends } from "./pages/friends";

const App = () => {
	const [value, setValue] = useState(0);
	const Page = [<Home key={0} />, <Friends key={1} />];

	return (
		<>
			<BackgroundDesign />
			<div className="container">
				{Page[value]}
				<BottomNavigation
					showLabels
					value={value}
					onChange={(event, newValue) => {
						setValue(newValue);
					}}
					sx={{ borderRadius: "4px", boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)" }}
				>
					<BottomNavigationAction label="Home" icon={<HomeIcon />} />
					<BottomNavigationAction label="Friends" icon={<GroupIcon />} />
				</BottomNavigation>
			</div>
		</>
	);
};

export default App;
