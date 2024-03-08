import { Avatar, Box, Divider, IconButton, LinearProgress, Paper, Tooltip } from "@mui/material"
import { getStorage, setStorage } from "../store/Store";
import { useEffect, useState } from "react";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [isDownloading, setIsDownloading] = useState(false);

    const getFriends = async () => {
        setIsDownloading(true);
        const { LC_HELPER_FRIEND_LIST } = await getStorage();
        const friendList = [];

        const fetchFriendData = async (friend) => {
            const graphqlEndpoint = "https://leetcode.com/graphql";
            const graphqlQuery = `
                query globalDataQuery($username: String!) {
                    userContestRanking(username: $username) {
                        rating
                    }
                    matchedUser(username: $username) {
                        profile {
                            userAvatar
                            realName
                        }
                    }
                }
            `;
            const variables = { "username": friend };
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

            return {
                name: res.data.matchedUser.profile.realName !== "" ? res.data.matchedUser.profile.realName : friend,
                avatar: res.data.matchedUser.profile.userAvatar,
                rating: res.data?.userContestRanking?.rating ?? 0,
                username: friend,
            };
        };

        const promises = LC_HELPER_FRIEND_LIST?.map((friend) => fetchFriendData(friend));

        try {
            const results = await Promise.allSettled(promises);
            results.forEach((result) => {
                if (result.status === 'fulfilled') {
                    friendList.push(result.value);
                }
            });
        } catch (error) {
            console.error(`Error fetching friends data: ${error.message}`);
        }
        setFriends(friendList);
        setIsDownloading(false);
    };

    useEffect(() => {
        getFriends();
    }, []);

    const removeFriend = async (friend) => {
        const { LC_HELPER_FRIEND_LIST } = await getStorage();
        const newFriends = LC_HELPER_FRIEND_LIST.filter((friendId) => friendId !== friend);
        await setStorage({
            "LC_HELPER_FRIEND_LIST": newFriends,
        });
        setFriends(newFriends);
    }

    const navigate = async (friend) => {
        const newUrl = `https://leetcode.com/${friend}/`;
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs[0]) {
                const tabId = tabs[0].id;
                browser.tabs.update(tabId, { url: newUrl });
            }
        });
    }

    function getRatingColor(rating) {
        if (rating >= 3400) return "#AA0100"; // ~LGM
        else if (rating >= 3000) return "#FF3333"; // ~IGM
        else if (rating >= 2800) return "#FF7777"; // ~GM
        else if (rating >= 2700) return "#FFBB55"; // ~IM
        else if (rating >= 2500) return "#FFCC87"; // ~M
        else if (rating >= 2300) return "#FF88FF"; // ~CM
        else if (rating >= 2000) return "#AAAAFF"; // ~Expert
        else if (rating >= 1800) return "#76DDBB"; // ~Specialist
        else if (rating >= 1600) return "#76FF77"; // ~Pupil
        else return "#808080"; // ~Newbie
    }

    return (
        <Paper sx={{ flex: "1", p: "12px", overflowY: "scroll", fontSize: "14px" }}>
            {friends?.map((friend, index) => {
                return (
                    <>
                        <Box key={index} sx={{ display: "flex", alignItems: "center", flexDirection: "row", p: "2px", justifyContent: "center" }}>
                            <Tooltip title={friend.name} arrow>
                                <Avatar alt="" src={friend.avatar} sx={{ width: 24, height: 24, mr: "4px" }} />
                            </Tooltip>
                            <Tooltip title={parseInt(friend.rating)} arrow>
                                <Box title={friend.name} sx={{ cursor: "default", color: `${getRatingColor(friend.rating)}`, flex: "1", display: "flex", alignItems: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {friend.name}
                                </Box>
                            </Tooltip>
                            <Tooltip title={`https://leetcode.com/${friend.username}/`} arrow>
                                <IconButton color="primary" onClick={() => navigate(friend.username)} >
                                    <ArrowOutwardIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove Friend" arrow>
                                <IconButton color="error" onClick={() => removeFriend(friend.username)} >
                                    <PersonRemoveIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        {(index != friends.length - 1) && <Divider />}
                    </>
                )
            })}
            {isDownloading && <LinearProgress />}
        </Paper>
    )
}

export { Friends };