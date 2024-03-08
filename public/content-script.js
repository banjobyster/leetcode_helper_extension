/* GENERIC UTILS */
const getPathnameArray = async () => new Promise(resolve => setTimeout(() => resolve(window.location.pathname.split('/').filter(item => item !== '')), 1000));

const setStorage = async (dataObject) => {
    await browser.storage.local.set(dataObject);
};

const getStorage = async () => {
    return new Promise((resolve) => {
        browser.storage.local.get(null, (storageResult) => {
            resolve(storageResult);
        });
    });
};

const unsetStorage = async (...keys) => {
    await browser.storage.local.remove(keys);
};

const setUsername = async () => {
    const graphqlEndpoint = "https://leetcode.com/graphql";
    const graphqlQuery = `
        query globalDataQuery {
            userStatus {
                username
            }
        }
    `;
    const variables = {};
    const operationName = 'globalDataQuery';
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

    setStorage({
        "LC_HELPER_USERNAME": res?.data?.userStatus?.username ?? ""
    });
};

/* FRIEND UTILS */
const getFriends = async () => {
    const { LC_HELPER_FRIEND_LIST } = await getStorage();
    return LC_HELPER_FRIEND_LIST ?? [];
};

const updateFriend = async () => {
    const addFriend = document.getElementById('LC_HELPER_ADD_FRIEND_DIV');
    const pathnameArray = await getPathnameArray();
    const friends = await getFriends();

    if (addFriend) {
        const isFriend = friends.includes(pathnameArray[0]);
        if (isFriend) {
            const newList = friends.filter((friend) => friend !== pathnameArray[0]);
            addFriend.innerText = 'Add Friend';
            await setStorage({
                "LC_HELPER_FRIEND_LIST": newList,
            });
        }
        else {
            friends.push(pathnameArray[0]);
            addFriend.innerText = 'Remove Friend';
            await setStorage({
                "LC_HELPER_FRIEND_LIST": friends,
            });
        }
    }
};

/* CONTEST RANK UTILS */
const getRank = async (contestSlug, tparent, tbody, maxRank, loader, button) => {
    const friends = await getFriends();
    const { LC_HELPER_USERNAME } = await getStorage();
    const maxPage = maxRank / 25;
    button.disabled = true;
    button.style.cursor = "not-allowed";
    loader.innerText = 'Loading...';

    let isOneIndexed = 0;

    const contestInfoRes = await fetch(` https://leetcode.com/contest/api/info/${contestSlug}/`)
    const contestInfo = await contestInfoRes.json();
    const { start_time: contestStartTime } = contestInfo.contest;
    const { questions: contestQuestions } = contestInfo;

    let count = friends.length;
    for (let page = 1; page <= maxPage && count > 0; page++) {
        const response = await fetch(`https://leetcode.com/contest/api/ranking/${contestSlug}/?pagination=${page}&region=global`);
        const data = await response.json();

        if (data.total_rank.length === 0) break;

        for (let i = 0; i < 25; i++) {
            if (page == 1 && i == 0 && data.total_rank[i].rank == 0) isOneIndexed = 1;

            if (friends.includes(data.total_rank[i].username) || (LC_HELPER_USERNAME === data.total_rank[i].username)) {
                const tr = document.createElement('tr');
                tr.className = 'success LC_HELPER_RANK_ROW';

                const createNavigateElement = (tdElem) => {
                    const linkElement = document.createElement('a');
                    linkElement.href = `https://leetcode.com/contest/${contestSlug}/ranking/${page}`;
                    linkElement.style.cursor = 'pointer';
                    linkElement.style.textDecoration = 'none';

                    const arrowIcon = document.createElement('span');
                    arrowIcon.textContent = '↗';
                    arrowIcon.style.display = 'inline-block';
                    arrowIcon.style.position = 'relative';

                    linkElement.appendChild(arrowIcon);

                    tdElem.appendChild(linkElement);
                }

                const rankTd = document.createElement('td');
                rankTd.textContent = data.total_rank[i].rank + isOneIndexed;
                createNavigateElement(rankTd);

                const nameTd = document.createElement('td');
                const usernameLink = document.createElement('a');
                usernameLink.classList.add('ranking-username');
                usernameLink.title = data.total_rank[i].username;
                usernameLink.href = `/${data.total_rank[i].user_slug}`;
                usernameLink.textContent = data.total_rank[i].username;

                const countrySpan = document.createElement('span');
                countrySpan.classList.add('country-name');
                countrySpan.setAttribute('data-toggle', 'tooltip');
                countrySpan.setAttribute('data-placement', 'top');
                countrySpan.setAttribute('data-original-title', '');
                countrySpan.setAttribute('aria-hidden', 'true');
                countrySpan.style.cursor = 'pointer';

                const flagSpan = document.createElement('span');
                flagSpan.style.position = 'relative';
                flagSpan.style.display = 'inline-block';
                flagSpan.style.width = '1.33333em';
                flagSpan.style.height = '1em';
                flagSpan.style.backgroundImage = 'url("https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.8.0/flags/4x3/.svg")';
                flagSpan.style.backgroundPosition = '50% center';
                flagSpan.style.backgroundRepeat = 'no-repeat';
                flagSpan.style.backgroundSize = 'contain';
                flagSpan.style.fontSize = '1em';
                flagSpan.style.lineHeight = '1em';
                flagSpan.style.verticalAlign = 'middle';

                countrySpan.appendChild(flagSpan);

                nameTd.appendChild(usernameLink);
                nameTd.appendChild(document.createTextNode('\u00A0\u00A0')); // Add non-breaking space
                nameTd.appendChild(countrySpan);

                const scoreTd = document.createElement('td');
                scoreTd.textContent = data.total_rank[i].score;

                const timeTd = document.createElement('td');
                timeTd.textContent = (new Date((data.total_rank[i].finish_time - contestStartTime) * 1000).toISOString()).substr(11, 8);

                tr.appendChild(rankTd);
                tr.appendChild(nameTd);
                tr.appendChild(scoreTd);
                tr.appendChild(timeTd);

                const createSubmissionElement = (index, trElem) => {
                    const questionId = contestQuestions[index].question_id;
                    if (!(questionId in data.submissions[i])) return;

                    const submission = data.submissions[i][questionId];

                    const elem = document.createElement('td');

                    const codeElement = document.createElement('a');
                    codeElement.setAttribute('disabled', true);
                    const codeIcon = document.createElement('span');
                    codeIcon.className = 'fa fa-file-code-o';
                    codeElement.appendChild(codeIcon);

                    const time = (new Date((submission.date - contestStartTime) * 1000).toISOString()).substr(11, 8);
                    const timeElement = document.createTextNode(time);

                    let errorElement;
                    if (submission.fail_count) {
                        const errorIcon = document.createElement('span');
                        errorIcon.className = 'fa fa-bug';
                        errorIcon.setAttribute('data-toggle', 'tooltip');
                        errorIcon.setAttribute('data-placement', 'top');
                        errorIcon.setAttribute('data-original-title', `${submission.fail_count} incorrect attempt(s)`);
                        errorIcon.setAttribute('aria-hidden', 'true');
                        errorIcon.style.cursor = 'pointer';
                        errorIcon.style.color = 'rgb(220, 20, 60)';

                        const failCountElement = document.createTextNode(submission.fail_count);

                        errorElement = document.createElement('span');
                        errorElement.appendChild(errorIcon);
                        errorElement.appendChild(failCountElement);
                    } else {
                        errorElement = document.createTextNode('');
                    }

                    elem.appendChild(codeElement);
                    elem.appendChild(timeElement);
                    elem.appendChild(errorElement);

                    trElem.appendChild(elem);
                }
                if (!tparent.className.includes('ranking-list')) {
                    for (let quesInd = 0; quesInd < 4; quesInd++) {
                        createSubmissionElement(quesInd, tr);
                    }
                }

                tbody.insertBefore(tr, tbody.firstChild);

                count--;
            }
            loader.innerText = `Searched till rank: ${(page + 1) * 25}`;
        }
    }

    button.disabled = false;
    button.style.cursor = "pointer";
    loader.innerText = "Search completed!";
};

const createRankFetchElement = (tparent, tbody, contestSlug) => {
    const elements = Array.from(document.getElementsByClassName("LC_HELPER_FETCH_RANK"));
    elements.forEach((element) => {
        element.remove();
    });

    var fetchRankElement = document.createElement('div');
    fetchRankElement.className = 'LC_HELPER_FETCH_RANK';
    fetchRankElement.style.display = 'flex';
    fetchRankElement.style.flexDirection = 'row';
    fetchRankElement.style.gap = '8px';
    fetchRankElement.style.alignItems = 'center';
    fetchRankElement.style.margin = '8px';

    var button = document.createElement('button');
    button.textContent = 'Fetch Ranks';
    button.className = 'btn btn-default panel-hover';

    var input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('min', '1');
    input.setAttribute('placeholder', 'Max rank to search');
    input.className = 'panel-hover btn';
    input.style.padding = '6px 12px';
    input.style.textAlign = 'left';
    input.style.outline = 'none';

    var loader = document.createElement('div');
    loader.style.color = "#ddd";

    fetchRankElement.appendChild(input);
    fetchRankElement.appendChild(button);
    fetchRankElement.appendChild(loader);

    tparent.parentNode.insertBefore(fetchRankElement, tparent);
    button.addEventListener('click', () => {
        if (input.value < 1) {
            input.value = 100;
        }
        const elements = Array.from(document.getElementsByClassName("LC_HELPER_RANK_ROW"));
        elements.forEach((element) => {
            element.remove();
        });
        getRank(contestSlug, tparent, tbody, input.value, loader, button);
    });
};

/* INIT */
const __init__ = async () => {
    const pathnameArray = await getPathnameArray();
    const friends = await getFriends();
    const allDivs = document.querySelectorAll('div');

    if (pathnameArray.length === 1) {
        // probably in profile page
        const title = document.querySelectorAll('head title')[0].innerText;
        const isSelf = document.querySelector('body a[href="/profile/"]');

        if (title.includes(pathnameArray[0]) && title.includes("Profile") && !isSelf) {
            // in profile page
            const addFriend = document.createElement('div');
            addFriend.className = 'bg-green-0 dark:bg-dark-green-0 text-green-s dark:text-dark-green-s hover:text-green-s dark:hover:text-dark-green-s w-full rounded-lg py-[7px] text-center font-medium mb-2 cursor-pointer';
            addFriend.id = 'LC_HELPER_ADD_FRIEND_DIV'
            addFriend.innerText = friends?.includes(pathnameArray[0]) ? 'Remove Friend' : 'Add Friend';
            addFriend.onclick = updateFriend;

            let community_stats = null
            Object.keys(allDivs).forEach((k) => {
                if (community_stats === null && allDivs[k].innerText === "Community Stats") {
                    community_stats = allDivs[k];
                }
            });

            community_stats.insertAdjacentElement('beforebegin', addFriend);
        }
    } else {
        if (pathnameArray.length == 2 || pathnameArray.includes('ranking')) {
            // probably in contest page
            if (pathnameArray[0] === 'contest') {
                // in contest page
                const rankingList = document.querySelector('.ranking-list');
                let tbody = null, tparent = null;
                if (rankingList) {
                    tparent = rankingList;
                    tbody = rankingList.getElementsByTagName('tbody')[0];
                }
                else {
                    const rankingListDiff = document.querySelectorAll('[class^="ranking-table-container"]');

                    tparent = Array.from(rankingListDiff).filter(element => {
                        const classNames = element.className.split(' ');
                        return classNames.some(className => /^ranking-table-container/.test(className));
                    })[0];
                    tbody = tparent.getElementsByTagName('tbody')[0];
                }

                createRankFetchElement(tparent, tbody, pathnameArray[1]);
            }
        }
    }

    // send a global data call after 1s
    setTimeout(async () => {
        await setUsername();
    }, 1000);
};

const observeUrlChange = () => {
    setTimeout(__init__, 1000);
    let oldHref = document.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver(mutations => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            setTimeout(__init__, 1000);
        }
    });
    observer.observe(body, { childList: true, subtree: true });
};

window.onload = observeUrlChange;