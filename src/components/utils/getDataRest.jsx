import { parse } from "@babel/parser"
import { REST_TO_GRAPHQL_MAPPING } from "../../config";

const getProblemContent = (res) => {
    const tempContainer = document.createElement('div');
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(res, 'text/html');
    
    Array.from(parsedDocument.body.childNodes).forEach((node) => {
        tempContainer.appendChild(node.cloneNode(true));
    });

    const problemDiv = tempContainer.querySelector('.question-content.default-content');
    tempContainer.remove();

    return problemDiv?.innerHTML.trim() ?? "";
}


const populatePageData = (pageData, properties) => {
    Object.keys(properties).forEach((key) => {
        const idx = properties[key];

        if (idx.key.name === "questionExampleTestcases") {
            pageData[REST_TO_GRAPHQL_MAPPING["questionExampleTestcases"]] = idx.value.value;
        }
        else if (idx.key.name === "codeDefinition") {
            const elements = idx.value.elements;
            const elementsHolder = []
            for (const elem of elements) {
                const property = elem.properties;
                const propertyHolder = {};
                for (const prop of property) {
                    propertyHolder[REST_TO_GRAPHQL_MAPPING[prop.key.value]] = prop.value.value;
                }
                elementsHolder.push(propertyHolder);
            }

            pageData[REST_TO_GRAPHQL_MAPPING["codeDefinition"]] = elementsHolder;
        }
        else if (idx.key.name === "metaData") {
            if (idx?.value?.arguments?.[0]?.left) {
                const leftExp = idx.value.arguments[0].left;
                pageData[REST_TO_GRAPHQL_MAPPING["metaData"]] = JSON.parse(leftExp.value);
            }
            else {
                pageData[REST_TO_GRAPHQL_MAPPING["metaData"]] = JSON.parse(idx.value.arguments[0].value);
            }
        }
    })
}

const getPageData = (pageDataString) => {
    const ast = parse(pageDataString, { ecmaVersion: 6 });
    const properties = ast.program.body[0].declarations[0].init.properties;

    const pageData = {};
    populatePageData(pageData, properties);

    return pageData;
}

const getDataRest = async (pathnameArray) => {
    const restEndpoint = `https://leetcode.com/${pathnameArray.join('/')}/`;
    try {
        const response = await fetch(restEndpoint);
        if (!response.ok) {
            throw new Error(`REST request failed with status ${response.status}`);
        }
        const res = await response.text();
        const dataRegex = /<script>\s*(var\s+pageData\s*=\s*[^;]*\s*;)\s*<\/script>/;
        const dataMatch = res.match(dataRegex);

        if (dataMatch && dataMatch[1]) {
            const pageData = dataMatch[1];
            const data = getPageData(pageData);
            data["content"] = getProblemContent(res);

            return data;
        } else {
            throw new Error('Matching failed for example test cases or code snippet.');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error making REST request');
    }
};

export { getDataRest };