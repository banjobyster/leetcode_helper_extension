#include<bits/stdc++.h> 
using namespace std;

/* INPUT_HELPER_FUNCTIONS */
void __trim_input(string &input) {
    int firstNonEmpty = -1, lastNonEmpty = input.size() - 1;
    for (int i = 0; i < input.size(); i++) { if (input[i] != ' ') { lastNonEmpty = i; if (firstNonEmpty == -1) { firstNonEmpty = i; } } };
    if (firstNonEmpty == -1) { input = ""; return; };
    input = input.substr(firstNonEmpty, lastNonEmpty - firstNonEmpty + 1);
}
void __get_input(string input, int &value) { __trim_input(input); value = stoi(input); }
void __get_input(string input, string &value) { __trim_input(input); value = input.substr(1, input.size() - 2); }
void __get_input(string input, bool &value) { __trim_input(input); value = input == "true"; }
void __get_input(string input, double &value) { __trim_input(input); value = stod(input); }
void __get_input(string input, long long &value) { __trim_input(input); value = stoll(input); }
void __get_input(string input, char &value) { __trim_input(input); value = input[1]; }
template<typename T>
void __get_input(string input, vector<T> &value) {
    string subInput = "";
    int stackParanthesis = 1;
    vector<T> container = {};
    for (int i = 1; i < input.size(); i++) {
        if (input[i] == '[') { stackParanthesis++; } else if (input[i] == ']') { stackParanthesis--; }
        if ((input[i] == ',' && stackParanthesis == 1) || stackParanthesis == 0) { T subValue; __get_input(subInput, subValue); container.push_back(subValue); subInput = ""; } else { subInput += input[i]; }
    }
    value = container;
}

/* OUTPUT_HELPER_FUNCTIONS */
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
template<typename T, typename V>
void __print_output(const pair<T, V> &x) {cout << '['; __print_output(x.first); cout << ','; __print_output(x.second); cout << ']';}
template<typename T>
void __print_output(const T &x) {int f = 0; cout << '['; for (auto &i: x) cout << (f++ ? "," : ""), __print_output(i); cout << "]";}
void _print_output() {cout << "\n";}
template <typename T, typename... V>
void _print_output(T t, V... v) {__print_output(t); if (sizeof...(v)) cout << ", "; _print_output(v...);}
#define ___print_output(x...) _print_output(x)

/* MAIN */
void __solve();

int main() {
    ios::sync_with_stdio(0);
    cin.tie(0);

    freopen("input.txt","r",stdin);
    freopen("output.txt","w",stdout);

    __solve();
}

/**
 * ALSO CHECK ALL THE POSSIBLE VARIABLES AND CORRESPONDING INPUT FROM LEETCODE
 * 
 *  * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
*/


class Solution {
public:
    int countPrefixSuffixPairs(vector<string>& words) {
        return 0;
    }
};
int main()