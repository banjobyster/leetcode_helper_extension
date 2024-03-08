const mapping = {
    "string": "string",
    "integer": "int",
    "boolean": "bool",
    "double": "double",
    "long": "long long",
    "char": "character",
    "ListNode": "ListNode*",
    "TreeNode": "TreeNode*",
    "void": "void",
    // NOT SURE OF THE FOLLOWING
    "float": "float",
};

// types of array ([] or list<>)

const helper_functions = String.raw`
#define __nullreplacestr "1000000000000000001"
#define __nullreplace 1000000000000000001
struct TreeNode { int val; TreeNode *left; TreeNode *right; TreeNode() : val(0), left(nullptr), right(nullptr) {} TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {} };
struct ListNode { int val; ListNode *next; ListNode() : val(0), next(nullptr) {} ListNode(int x) : val(x), next(nullptr) {} ListNode(int x, ListNode *next) : val(x), next(next) {} };
void __trim_input(string &input) {
    int firstNonEmpty = -1, lastNonEmpty = input.size() - 1; for (int i = 0; i < input.size(); i++) { if (input[i] != ' ') { lastNonEmpty = i; if (firstNonEmpty == -1) { firstNonEmpty = i; } } };
    if (firstNonEmpty == -1) { input = ""; return; }; input = input.substr(firstNonEmpty, lastNonEmpty - firstNonEmpty + 1);
}
void __get_input(string input, int &value) { __trim_input(input); value = stoi(input); }
void __get_input(string input, string &value) { __trim_input(input); value = input.substr(1, input.size() - 2); }
void __get_input(string input, bool &value) { __trim_input(input); value = input == "true"; }
void __get_input(string input, double &value) { __trim_input(input); value = stod(input); }
void __get_input(string input, long long &value) { __trim_input(input); if (input == "null") input = __nullreplacestr; value = stoll(input); }
void __get_input(string input, char &value) { __trim_input(input); value = input[1]; }
template<typename T>
void __get_input(string input, vector<T> &value) {
    __trim_input(input); string subInput = ""; int stackParanthesis = 1; vector<T> container = {};
    for (int i = 1; i < input.size(); i++) { if (input[i] == '[') { stackParanthesis++; } else if (input[i] == ']') { stackParanthesis--; } if ((input[i] == ',' && stackParanthesis == 1) || stackParanthesis == 0) { if (subInput.length() == 0) continue; T subValue; __get_input(subInput, subValue); container.push_back(subValue); subInput = ""; } else { subInput += input[i]; } }
    value = container;
}
void __get_input(string input, ListNode* &value) { vector<int> list; __get_input(input, list); ListNode *temp = NULL; value = temp; if (list.size() > 0) { temp = new ListNode(list[0]); value = temp; for (int i = 1; i < list.size(); i++) { ListNode *next = new ListNode(list[i]); temp->next = next; temp = next; } } }
void __get_input(string input, TreeNode *&value) {
    vector<long long int> list; __get_input(input, list); TreeNode *temp = NULL; value = temp;
    if (list.size() > 0 && list[0] != __nullreplace)
    {
        int n = list.size(); vector<TreeNode *> hold(n, NULL); int curr = 0, next = 1;
        while (curr < n) { if (list[curr] != __nullreplace) { TreeNode *left = NULL, *right = NULL; if (next < n) { if (list[next] != __nullreplace) { left = new TreeNode(list[next]); hold[next] = left; } next++; } if (next < n) { if (list[next] != __nullreplace) { right = new TreeNode(list[next]); hold[next] = right; } next++; } if (hold[curr] == NULL) hold[curr] = new TreeNode(list[curr]); hold[curr]->left = left; hold[curr]->right = right; } curr++; }
        value = hold[0];
    }
}
void __print_output(int x) {cout << x;}
void __print_output(long x) {cout << x;}
void __print_output(long long x) {cout << x;}
void __print_output(unsigned x) {cout << x;}
void __print_output(unsigned long x) {cout << x;}
void __print_output(unsigned long long x) {cout << x;}
void __print_output(float x) {cout << x;}
void __print_output(double x) {cout << x;}
void __print_output(long double x) {cout << x;}
void __print_output(char x) {cout << "'" << x << "'";}
void __print_output(const char *x) {cout << '"' << x << '"';}
void __print_output(const string &x) {cout << '"' << x << '"';}
void __print_output(bool x) {cout << (x ? "true" : "false");}
void __print_output(ListNode *x) {cout << '['; while(x != NULL) { cout << x->val; cout << (x->next ? "," : ""); x = x->next; } cout << ']'; }
void __print_output(TreeNode *x) { cout << '['; vector<TreeNode*> hold; if (x != NULL) { int i = 0, j = 0; hold.push_back(x); while(i < hold.size()) { if (hold[i] != NULL) { hold.push_back(hold[i]->left); hold.push_back(hold[i]->right); j = i; } i++; } i = 0; while(i <= j) cout << (i ? "," : "") << (hold[i] == NULL ? "null" : to_string(hold[i]->val)), i++; } cout << ']'; }
template<typename T, typename V>
void __print_output(const pair<T, V> &x) {cout << '['; __print_output(x.first); cout << ','; __print_output(x.second); cout << ']';}
template<typename T>
void __print_output(const T &x) {int f = 0; cout << '['; for (auto &i: x) cout << (f++ ? "," : ""), __print_output(i); cout << "]";}
void _print_output() {cout << "\n";}
template <typename T, typename... V>
void _print_output(T t, V... v) {__print_output(t); if (sizeof...(v)) cout << ", "; _print_output(v...);}
#define ___print_output(x...) _print_output(x)
`;

const default_template = String.raw`
#include<bits/stdc++.h>
using namespace std;

const int MOD = 1e9 + 7;
`;

const get_template = (props) => {
    return default_template.trim();
}

const get_body = (props) => {
    const { content, codeSnippet } = props;
    const eol = "\n";

    const make_comment = (text) => {
        return `/*\n${text}\n*/`;
    }

    const body = helper_functions.trim() + eol + eol + make_comment(content) + eol + eol + codeSnippet;

    return body;
}

const get_main = (props) => {
    const { metaData } = props;
    const tab = "    ";
    const eol = "\n";

    const get_typename = (initType) => {
        let type = initType;
        if (type.startsWith("list")) { type += ("[]").repeat((type.match(/list/g) || []).length); type = type.replace(/<|>|list/g, ''); }
        let arrCount = 0;
        for (let i = 0; i < type.length; i++) {
            if (i < type.length - 1 && type[i] == '[' && type[i + 1] == ']') {
                arrCount++;
            }
        }
    
        const typeKey = arrCount == 0 ? type : type.substr(0, type.length - (arrCount * 2));
        const typeVal = mapping[typeKey];
    
        let typeInput = "";
        for (let i = 0; i < arrCount; i++) typeInput += "vector<";
        typeInput += typeVal;
        for (let i = 0; i < arrCount; i++) typeInput += ">";
    
        return typeInput;
    }
    
    const get_input = (metaData) => {
        let prefix = `void __get_input(${get_typename(metaData.return.type)} &output) {` + eol;
    
        prefix += tab + "string input;" + eol + eol;
        for (const param of metaData.params) {
            const getline = "getline(cin, input);";
            const typeInput = `${get_typename(param.type)} ${param.name};`;
    
            prefix += tab + getline + eol;
            prefix += tab + typeInput + eol;
    
            prefix += tab + `__get_input(input, ${param.name});` + eol + eol;
        }
        prefix += tab + "Solution Sol;" + eol;
        prefix += tab + "output = Sol." + metaData.name + "(" + metaData.params.map(param => param.name).join(", ") + ");" + eol;
        prefix += "}";
    
        return prefix;
    }

    let solve = `int __get_lines(string filePath) {` + eol;
    solve += tab + `ifstream file(filePath);` + eol;
    solve += tab + String.raw`return file ? count(istreambuf_iterator<char>(file), istreambuf_iterator<char>(), '\n') + 1 : 0;` + eol;
    solve += `}` + eol + eol;

    solve += `void __solve() {` + eol;
    solve += tab + `freopen("${metaData.name}_input.txt","r",stdin);` + eol;
    solve += tab + `freopen("${metaData.name}_output.txt","w",stdout);` + eol + eol;
    solve += tab + `int tests = __get_lines("${metaData.name}_input.txt") / ${metaData.params.length};` + eol;
    solve += tab + `while(tests--) {` + eol;
    solve += tab + tab + `${get_typename(metaData.return.type)} output;` + eol;
    solve += tab + tab + `__get_input(output);` + eol;
    solve += tab + tab + `___print_output(output);` + eol;
    solve += tab + `}` + eol;
    solve += `}` + eol + eol;

    solve += `int main() {` + eol;
    solve += tab + `ios::sync_with_stdio(0);` + eol;
    solve += tab + `cin.tie(0);` + eol + eol;
    solve += tab + `__solve();` + eol;
    solve += `}` + eol;

    const main = get_input(metaData) + eol + eol + solve.trim();

    return main;
}

export const mapping_cpp = (props) => {
    return {
        "template": get_template(props),
        "body": get_body(props),
        "main": get_main(props),
    };
}