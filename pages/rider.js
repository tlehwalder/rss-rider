import { useState, useEffect } from "react";
import styled from "styled-components";
import Parser from "rss-parser";
import findIndex from "lodash/findIndex";
import PageTitle from "../components/PageTitle";
import LoadingBars from "../components/LoadingBars";
import { useLocalStorage } from "../hooks/useLocalStorage";
import FeedList from "../components/FeedList";
import FeedUrls from "../components/FeedUrls";
import "../index.css";

const AddFeedButton = styled.button`
  margin-left: -1px;
`;

const Index = () => {
  const [feedsLocal, setFeedsLocal] = useLocalStorage("feeds", []);

  const [forceReload, setForceReload] = useState(true);
  const [requestedFeeds, setRequestedFeeds] = useState(feedsLocal || []);
  const [articles, setArticles] = useState([]);
  const [feedInput, setFeedInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeeds = async () => {
      if (forceReload) {
        setLoading(true);
        const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

        let parser = new Parser();
        let articles = null;
        try {
          articles = await Promise.all(
            requestedFeeds.map(
              async feed => await parser.parseURL(CORS_PROXY + feed.feedUrl)
            )
          );

          articles.map(article => {
            const index = findIndex(requestedFeeds, {
              feedUrl: article.feedUrl
            });
            const oldObject = requestedFeeds[index];
            requestedFeeds.splice(index, 1, {
              ...oldObject,
              title: article.title
            });
            setFeedsLocal(requestedFeeds);
          });
        } catch (error) {
          console.error(error);
        }
        console.log(
          `%c${"SET ARTICLES"}`,
          "color: lime;background-color:black; font-weight: bold; font-size: 18px"
        );

        setArticles(articles.map(article => ({ ...article, visible: true })));
        setLoading(false);
        setForceReload(false);
      }
    };
    fetchFeeds();
  }, [forceReload]);

  function addFeed(url) {
    setRequestedFeeds([...requestedFeeds, { feedUrl: url, visible: true }]);
    setFeedsLocal([...requestedFeeds, { feedUrl: url, visible: true }]);
    setFeedInput("");
    setForceReload(true);
  }

  function setFeedVisibility(url, visible) {
    const newFeeds = [...requestedFeeds];
    const newArticles = [...articles];
    const index = findIndex(newFeeds, { feedUrl: url });
    const articleIndex = findIndex(newArticles, { feedUrl: url });
    const oldObject = newFeeds[index];
    newFeeds.splice(index, 1, {
      ...oldObject,
      visible
    });
    const oldArticle = newArticles[articleIndex];
    newArticles.splice(index, 1, {
      ...oldArticle,
      visible
    });
    setRequestedFeeds(newFeeds);
    setFeedsLocal(requestedFeeds);
    setArticles(newArticles);
  }

  function _handleKeyDown(e) {
    if (e.key === "Enter") addFeed(feedInput);
  }

  return (
    <div className="bg-gray-100">
      <PageTitle>RSS Rider 🏇</PageTitle>
      <FeedUrls
        setFeedVisibility={setFeedVisibility}
        requestedFeeds={requestedFeeds}
      />
      <input
        value={feedInput}
        onChange={event => setFeedInput(event.target.value)}
        onKeyDown={_handleKeyDown}
        type="text"
        className="border-gray-500"
        placeholder="insert rss feed..."
      />
      <AddFeedButton onClick={() => addFeed(feedInput)}>+</AddFeedButton>
      <input
        style={{ marginLeft: "1em" }}
        value={searchInput}
        onChange={event => setSearchInput(event.target.value)}
        type="text"
        className="border-gray-500"
        placeholder="filter..."
      />
      <LoadingBars loading={isLoading} />
      <FeedList articles={articles} searchInput={searchInput} />
    </div>
  );
};

export default Index;
