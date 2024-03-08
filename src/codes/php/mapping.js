const mapping = {}; 

const get_template = (props) => { return ""; } 

const get_body = (props) => { return props.codeSnippet; } 

const get_main = (props) => { return ""; } 

export const mapping_php = (props) => {
    return { "template": get_template(props), "body": get_body(props), "main": get_main(props), }; 
}