import {getCurrentlyListeningCached} from "~/server/api/v1/fun/currently_listening";
import {getRecentGithubCommitCached} from "~/server/api/v1/fun/recent_github_commit";
import {getPageSettingCached} from "~/lib/checkPageSettings";
import {customCachedFunction} from "~/lib/customCache";

const getHomePageList = async () => {
  console.log("Generating home page fun card order");

  const availableCards = ["currently-listening", "recent-github-commit", "phone-battery", "currently-playing"]

  let returnList = [];

  for (let i = 0; i < availableCards.length; i++) {
    // check if the card is enabled
    const settingsData = await getPageSettingCached(`enable-${availableCards[i]}`) as { value: boolean };

    if (settingsData?.value !== true) {
      // if the card is disabled, remove it from the list
      availableCards.splice(i, 1);
    }
  }

  if (availableCards.includes("currently-listening")) {
    const currentlyListeningData = await getCurrentlyListeningCached();

    if (currentlyListeningData.state === "playing") {
      // remove from the list of available cards and add it to the return list
      availableCards.splice(availableCards.indexOf("currently-listening"), 1);
      returnList.push("currently-listening");
    }
  }

  if (availableCards.includes("recent-github-commit")) {
    const recentGithubCommitData = await getRecentGithubCommitCached();

    // remove from the list of available cards
    availableCards.splice(availableCards.indexOf("recent-github-commit"), 1);

    // is the commit is less than 24 hours old
    if (
      recentGithubCommitData &&
      new Date(recentGithubCommitData.createdAt as string).getTime() > (Date.now() - (1000 * 60 * 60 * 24)) // 24 hours
    ) {
      // add on top
      returnList.unshift("recent-github-commit");
    } else {
      // add next
      returnList.push("recent-github-commit");
    }
  }

  // add the rest of the cards
  returnList = returnList.concat(availableCards);

  // add current time to a random position
  returnList.splice(Math.floor(Math.random() * (returnList.length - 1) + 1), 0, "current-time");

  return returnList;
}

const getHomePageListCached = customCachedFunction(
  getHomePageList,
  {
    name: "home-page-list",
    maxAge: 60 * 10, // 10 minutes
  }
);

export default defineEventHandler(async () => {
  return await getHomePageListCached();
});