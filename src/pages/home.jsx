import { LanguageSelector } from "../components/languageSelector";
import { CodeComponent } from "../components/codeComponent";
import { Downloader } from "../components/downloader";
import { Paper } from "@mui/material";

const Home = () => {
	return (
		<>
			<Paper sx={{ display: "flex", flexDirection: "column", gap: "10px", p: "12px" }}>
				<LanguageSelector />
				<Downloader />
			</Paper>
			<CodeComponent />
		</>
	)
}

export { Home };