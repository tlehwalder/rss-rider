import { useState, useEffect } from "react";
import styled from "styled-components";
import fetch from "isomorphic-unfetch";
import Parser from "rss-parser";
import PageTitle from "../components/PageTitle";
import LoadingBars from "../components/LoadingBars";
import FeedTile from "../components/FeedTile";
import { useLocalStorage } from "../hooks/useLocalStorage";

const FeedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AddFeedButton = styled.button`
  margin-left: -1px;
`;

const Index = ({ posts }) => {
  const [feedsLocal, setFeedsLocal] = useLocalStorage("feeds", []);

  const [requestedFeeds, setRequestedFeeds] = useState(feedsLocal || []);
  const [articles, setArticles] = useState([]);
  const [feedInput, setFeedInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeeds = async () => {
      setLoading(true);
      const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

      let parser = new Parser();
      let articles = null;
      try {
        articles = await Promise.all(
          requestedFeeds.map(async feed => {
            return await parser.parseURL(CORS_PROXY + feed);
          })
        );
      } catch (error) {
        console.error(error);
      }
      setArticles(articles);
      setLoading(false);
    };
    fetchFeeds();
  }, [requestedFeeds]);

  function addFeed(url) {
    setRequestedFeeds([...requestedFeeds, url]);
    setFeedsLocal([...requestedFeeds, url]);
    setFeedInput("");
  }

  function _handleKeyDown(e) {
    if (e.key === "Enter") {
      console.log("do validate");
    }
  }

  const buildFeedTile = item =>
    item.title.includes(searchInput) ||
    (item.content && item.content.includes(searchInput)) ? (
      <FeedTile item={item} />
    ) : null;
  const feeds =
    articles &&
    articles.flatMap((article, _i) =>
      article.items.map((item, _j) => ({ ...item, key: `${_i}-${_j}` }))
    );

  return (
    <>
      <PageTitle>RSS Rider 🏇</PageTitle>
      <ul>
        {requestedFeeds.map((feed, _i) => (
          <li key={_i}>{feed}</li>
        ))}
      </ul>
      <input
        value={feedInput}
        onChange={event => setFeedInput(event.target.value)}
        onKeyDown={_handleKeyDown}
        type="text"
        placeholder="insert rss feed..."
      />
      <AddFeedButton onClick={() => addFeed(feedInput)}>+</AddFeedButton>
      <input
        style={{ marginLeft: "1em" }}
        value={searchInput}
        onChange={event => setSearchInput(event.target.value)}
        type="text"
        placeholder="filter..."
      />
      <LoadingBars loading={isLoading} />
      <FeedList>{feeds && feeds.map(feed => buildFeedTile(feed))}</FeedList>
    </>
  );
};

Index.getInitialProps = async function() {
  const fetchPosts = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await fetchPosts.json();

  return {
    posts
  };
};

export default Index;
