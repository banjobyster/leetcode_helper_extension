import { GRAPHQL_ENDPOINT } from "../../config";

const getDataGraphql = async (pathnameArray) => {
    const titleSlug = pathnameArray[pathnameArray.indexOf("problems") + 1];
    const graphqlEndpoint = GRAPHQL_ENDPOINT;
    const graphqlQuery = `
        query questionEditorData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                exampleTestcaseList
                codeSnippets {
                    code
                    lang
                    langSlug
                }
                metaData
                content
            }
        }
    `;
    const variables = { titleSlug: titleSlug };
    const operationName = 'questionEditorData';
    try {
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: graphqlQuery,
                variables,
                operationName,
            }),
        });
        if (!response.ok) {
            throw new Error(`GraphQL request failed with status ${response.status}`);
        }
        const res = await response.json();

        const data = {
            exampleTestcaseList: res.data.question.exampleTestcaseList.join('\n'),
            metaData: JSON.parse(res.data.question.metaData),
            codeSnippets: res.data.question.codeSnippets,
            content: res.data.question.content,
        };

        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Error making GraphQL request');
    }
};

export { getDataGraphql };