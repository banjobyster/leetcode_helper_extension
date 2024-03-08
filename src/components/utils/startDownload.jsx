/*
FILE:
    template
    input and output taking functions
    problem content
    problem class
    main
    solve function (if default main enabled)

DOWNLOAD MODES:
    zip
    individual
*/
import { mappings } from "../../codes/exportMappings";
import { KEYS, LANGUAGE_LIST } from "../../config";
import { getStorage } from "../../store/Store";
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { convert } from "html-to-text"

const makeFile = async (problem) => {
    const { [KEYS.globalLangKey]: globalLang, [KEYS.fileTemplateKey]: globalTemplate, [KEYS.fileMainKey]: globalMain } = await getStorage();
    const props = {
        content: convert(problem.content).replace(/\n+\s*\n+/g, '\n\n'),
        codeSnippet: problem.codeSnippets.filter((snippet) => snippet.langSlug === globalLang)[0].code,
        metaData: problem.metaData,
    }
    const eol = "\n";

    const mapping = mappings[globalLang];
    const {
        template: default_template,
        body,
        main: default_main,
    } = mapping(props);

    const template = globalTemplate?.fileContent ?? default_template;
    const main = globalMain?.fileContent ?? default_main;

    const code = template + eol + eol + body + eol + eol + main;
    const examples = problem.exampleTestcaseList;

    const codeFileName = `${problem.metaData.name}.${LANGUAGE_LIST[globalLang].extension}`;
    const examplesFileName = `${problem.metaData.name}_input.txt`;

    return { codeFileName, examplesFileName, code, examples };
};

const download = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    FileSaver.saveAs(blob, filename);
};

const startDownload = async (problems) => {
    const { [KEYS.isZipDownloadEnabled]: zipDownloadEnabled } = await getStorage();
    const files = [];

    for (let i = 0; i < problems.length; i++) {
        const problem = problems[i];
        const { codeFileName, examplesFileName, code, examples } = await makeFile(problem);
        if (!zipDownloadEnabled) {
            download(codeFileName, code, 'text/plain');
            download(examplesFileName, examples, 'text/plain');
        }
        else files.push({ codeFileName, examplesFileName, code, examples });
    }

    if (zipDownloadEnabled) {
        const zip = new JSZip();

        let problemNumber = 0;
        for (const file of files) {
            const folder = zip.folder(`${problemNumber}`);
            folder.file(file.codeFileName, file.code);
            folder.file(file.examplesFileName, file.examples);
            problemNumber += 1;
        }

        const zipFileName = 'lc_helper.zip';
        const zipContent = await zip.generateAsync({ type: 'blob' });
        download(zipFileName, zipContent, 'application/zip');
    }
};

export { startDownload };