/*
Support for three types
1 -> /contest/
2 -> /constest/../problems/
3 -> /problems/
*/

import { useEffect, useState } from "react";
import { getPathNameArray } from "./utils/getPathname";
import { Button, FormControlLabel, FormGroup, LinearProgress, Switch } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { getDataRest } from "./utils/getDataRest";
import { getDataGraphql } from "./utils/getDataGraphql";
import { getStorage, setStorage } from "../store/Store";
import { KEYS } from "../config";
import { startDownload } from "./utils/startDownload";

const Downloader = () => {
    const [pathnameArray, setPathnameArray] = useState([]);
    const [isZipDownloadEnabled, setZipDownloadEnabled] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [canDownload, setCanDownload] = useState(false);

    const getPathname = async () => {
        const pathnameArrayTemp = await getPathNameArray();
        setPathnameArray(pathnameArrayTemp);
    }

    const getZipDownload = async () => {
        const { [KEYS.isZipDownloadEnabled]: globalZipDownload } = await getStorage();
        if (globalZipDownload === undefined) {
            await setStorage({
                [KEYS.isZipDownloadEnabled]: false,
            })
            setZipDownloadEnabled(false);
        }
        else {
            setZipDownloadEnabled(globalZipDownload);
        }
    }

    const getCanDownload = () => {
        if (pathnameArray.includes("contest") || pathnameArray.includes("problems")) {
            setCanDownload(true);
        }
        else {
            setCanDownload(false);
        }
    }

    useEffect(() => {
        getPathname();
        getZipDownload();
    }, []);

    useEffect(() => {
        getCanDownload();
    }, [pathnameArray])

    const handleDownload = async () => {
        setIsDownloading(true);
        if (pathnameArray === undefined || pathnameArray.length === 0) {
            await getPathname();
        }

        const problems = [];

        if (pathnameArray.includes("contest")) {
            if (pathnameArray.includes("problems")) {
                const res = await getDataRest(pathnameArray);
                problems.push(res);
            }
            else {
                const contestSlug = `${pathnameArray[pathnameArray.indexOf("contest") + 1]}`;
                const contestApi = `https://leetcode.com/contest/api/info/${contestSlug}/`;
                try {
                    const response = await fetch(contestApi);
                    if (!response.ok) {
                        throw new Error(`REST request failed with status ${response.status}`);
                    }
                    const data = await response.json();
                    const problemPromises = data["questions"].map(async (problem) => {
                        const problemSlug = problem["title_slug"];
                        const problemUrlPathname = `/contest/${contestSlug}/problems/${problemSlug}/`;
                        const problemPathnameArray = problemUrlPathname.split('/').filter(Boolean);

                        return getDataRest(problemPathnameArray);
                    });

                    const problemResponses = await Promise.all(problemPromises);
                    problemResponses.forEach((problem) => problems.push(problem));

                } catch (error) {
                    console.dir(error);
                    throw new Error('Error making REST request');
                }
            }
        }
        else if (pathnameArray.includes("problems")) {
            const res = await getDataGraphql(pathnameArray);
            problems.push(res);
        }
        else {
            setIsDownloading(false);
            return;
        }

        await startDownload(problems);
        setIsDownloading(false);
    }

    const updateZipDownload = async (event) => {
        const value = event.target.checked;
        setStorage({
            [KEYS.isZipDownloadEnabled]: value,
        });
        setZipDownloadEnabled(value);
    }

    return (
        <div>
            <Button variant="contained" endIcon={<DownloadIcon />} fullWidth onClick={handleDownload} disabled={!canDownload}>
                Download
            </Button>
            <FormGroup style={{ display: "flex", alignItems: "center" }}>
                <FormControlLabel control={<Switch checked={isZipDownloadEnabled} onChange={updateZipDownload} />} label="Download in .zip" />
            </FormGroup>
            {isDownloading && <LinearProgress />}
        </div>
    )
};

export { Downloader };