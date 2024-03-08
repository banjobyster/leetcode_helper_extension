import languagesJSON from "./codes/languages.json"

/* GLOBAL KEYS */
const GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql/';

/* Local Storage Keys */
const KEYS = {
    username: "LC_HELPER_USERNAME",
    fileTemplateKey: "LC_HELPER_FILE_TEMPLATE_CONTENT",
    fileMainKey: "LC_HELPER_FILE_MAIN_CONTENT",
    globalLangKey: "LC_HELPER_GLOBAL_LANG",
    isZipDownloadEnabled: "LC_HELPER_ZIP_DOWNLOAD",
    friendList: "LC_HELPER_FRIEND_LIST"
};

/* Language List */
const LANGUAGE_LIST = languagesJSON;

const REST_TO_GRAPHQL_MAPPING = {
    questionExampleTestcases: "exampleTestcaseList",
    codeDefinition: "codeSnippets",
    defaultCode: "code",
    text: "lang",
    value: "langSlug",
    metaData: "metaData",
}

export { GRAPHQL_ENDPOINT, KEYS, LANGUAGE_LIST, REST_TO_GRAPHQL_MAPPING };