import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { KEYS, LANGUAGE_LIST } from "../config"
import { getStorage, setStorage } from "../store/Store";
import { useEffect } from "react";
import useStore from "../store/stateStore";

const LanguageSelector = () => {
    const { globalLang, setGlobalLang } = useStore();

    useEffect(() => {
        const getGlobalLanguage = async () => {
            const { [KEYS.globalLangKey]: globalLang } = await getStorage();

            if (globalLang === undefined) {
                await setStorage({
                    [KEYS.globalLangKey]: "cpp"
                })
                setGlobalLang("cpp");
            }
            else {
                setGlobalLang(globalLang);
            }
        }

        getGlobalLanguage();
    }, []);

    const menuItems = [];
    for (const key in LANGUAGE_LIST) {
        const language = LANGUAGE_LIST[key];
        menuItems.push(
            <MenuItem key={key} value={key}>
                {language.formatted_name}
            </MenuItem>
        );
    }

    const handleChange = async (event) => {
        event.preventDefault();
        const value = event.target.value;

        await setStorage({
            [KEYS.globalLangKey]: value
        });
        setGlobalLang(value);
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="language-selector-label">Language</InputLabel>
            <Select
                labelId="language-selector-label"
                id="language-selector"
                label="Language"
                value={globalLang}
                onChange={handleChange}
            >
                {menuItems}
            </Select>
        </FormControl>
    )
}

export { LanguageSelector }