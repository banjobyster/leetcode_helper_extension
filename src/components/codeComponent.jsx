import UploadFileIcon from '@mui/icons-material/UploadFile';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useEffect, useState } from "react";
import { KEYS } from "../config";
import { getStorage, setStorage, unsetStorage } from "../store/Store";
import { Icon, Modal, Paper, Tooltip } from '@mui/material';
import { mappings } from '../codes/exportMappings';
import useStore from '../store/stateStore';
import exampleProblem from "../codes/exampleProblem.json";
import { convert } from "html-to-text";
import SyntaxHighlighter from 'react-syntax-highlighter';

const readFileContent = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsText(file);
    });
};

const FileComponent = ({ fileComponentKey, componentName, defaultValue }) => {
    const [file, setFile] = useState(null);
    const [fileOpen, setFileOpen] = useState(false);
    const { globalLang } = useStore();

    useEffect(() => {
        const getFile = async () => {
            const { [fileComponentKey]: currFile } = await getStorage();

            if (currFile !== undefined) {
                setFile(currFile)
            }
        }

        getFile();
    }, []);

    const handleChange = async (event) => {
        event.preventDefault();
        const fileInput = event.target;
        const currFile = fileInput.files[0];

        const fileContent = await readFileContent(currFile);
        const fileName = currFile.name;
        const fileType = currFile.type;

        await setStorage({
            [fileComponentKey]: {
                fileContent: fileContent,
                fileName: fileName,
                fileType: fileType
            }
        });

        setFile({
            fileContent: fileContent,
            fileName: fileName,
            fileType: fileType
        });
    }

    const resetFile = async () => {
        await unsetStorage(fileComponentKey);
        setFile(null);
    }

    const updateFileVisibility = async () => {
        setFileOpen(!fileOpen);
    }

    return (
        <div className={`file-component ${componentName}`}>
            <Modal
                open={fileOpen}
                onClose={updateFileVisibility}
            >
                <Paper
                    sx={{
                        margin: "20px auto",
                        width: "70%",
                        border: "none",
                        outline: "none",
                        overflow: "scroll",
                        maxHeight: "60%",
                        background: "rgb(240, 240, 240)",
                        fontSize: "8px"
                    }}
                    elevation={5}
                >
                    <SyntaxHighlighter language={globalLang}>
                        {file?.fileContent ?? defaultValue}
                    </SyntaxHighlighter>
                </Paper>
            </Modal>
            <Tooltip title="Click To View" arrow>
                <div className="file-name" onClick={updateFileVisibility}>
                    {file?.fileName ?? `< ${componentName} />`}
                </div>

            </Tooltip>
            <Tooltip title="Upload File" arrow>
                <div className="file-input-container">
                    <input
                        className="file-input"
                        type="file"
                        accept=".txt"
                        onChange={handleChange}
                        id={fileComponentKey}
                    />
                    <label htmlFor={fileComponentKey} className="file-input-label" title="Upload prefix template">
                        <Icon>
                            <UploadFileIcon />
                        </Icon>
                    </label>
                </div>
            </Tooltip>
            <div className="file-input-reset" onClick={resetFile}>
                <Tooltip title="Reset To Use Default" arrow>
                    <Icon>
                        <RestartAltIcon />
                    </Icon>
                </Tooltip>
            </div>
        </div>
    )
}

const BodyComponent = ({ defaultValue }) => {
    const [fileOpen, setFileOpen] = useState(false);
    const { globalLang } = useStore();

    const updateFileVisibility = async () => {
        setFileOpen(!fileOpen);
    }

    return (
        <>
            <Modal
                open={fileOpen}
                onClose={updateFileVisibility}
            >
                <Paper
                    sx={{
                        margin: "20px auto",
                        width: "70%",
                        border: "none",
                        outline: "none",
                        overflow: "scroll",
                        maxHeight: "60%",
                        background: "rgb(240, 240, 240)",
                        fontSize: "8px"
                    }}
                    elevation={5}
                >
                    <SyntaxHighlighter language={globalLang}>
                        {defaultValue}
                    </SyntaxHighlighter>
                </Paper>
            </Modal>
            <Tooltip title="Click To View" arrow>
                <div id="code-body" onClick={updateFileVisibility}>
                    {"< body_code />"}
                </div>
            </Tooltip>
        </>

    )
}

const CodeComponent = () => {
    const { globalLang } = useStore();

    const ColoredDot = ({ color }) => (
        <span
            style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                backgroundColor: color,
                borderRadius: '50%',
            }}
        />
    );

    const props = {
        content: convert(exampleProblem.content).replace(/\n+\s*\n+/g, '\n\n'),
        codeSnippet: exampleProblem.codeSnippets.filter((snippet) => snippet.langSlug === globalLang)[0].code,
        metaData: exampleProblem.metaData,
    }
    const mapping = mappings[globalLang];
    const {
        template,
        body,
        main,
    } = mapping(props);

    return (
        <div id="code-component">
            <div id='editor'>
                <ColoredDot color="#EA5455"/>
                <ColoredDot color="#FFD460"/>
                <ColoredDot color="#1876d2"/>
            </div>
            <FileComponent fileComponentKey={KEYS.fileTemplateKey} componentName="template_code" defaultValue={template} />
            <BodyComponent defaultValue={body}/>
            <FileComponent fileComponentKey={KEYS.fileMainKey} componentName="main_code" defaultValue={main} />
        </div>
    )
};

export { CodeComponent };