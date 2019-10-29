import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Parser from "rss-parser";
import PageTitle from "../components/PageTitle";

const Index = ({ posts }) => {
  const [feeds, setFeeds] = useState([]);
  const [articles, setArticles] = useState([]);
  const [feedInput, setFeedInput] = useState("");

  useEffect(() => {
    const fetchFeeds = async () => {
      const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

      let parser = new Parser();
      const articles = await Promise.all(
        feeds.map(async feed => {
          return await parser.parseURL(CORS_PROXY + feed);
        })
      );
      setArticles(articles);
    };
    fetchFeeds();
  }, [feeds]);

  function addFeed(url) {
    setFeeds([...feeds, url]);
    setFeedInput("");
  }

  console.log(articles);

  return (
    <>
      <PageTitle>RSS Rider</PageTitle>
      <p>
        Next.js PWA Boilerplate starts your progressive web app off with a
        perfect Google Lighthouse score. To see this in action, open this
        website with Chrome, go to the “Audits” tab in dev tools, and click “Run
        audit”.
      </p>
      <p>
        Check out the{" "}
        <a
          href="https://github.com/pingboard/next-pwa-boilerplate"
          rel="noopener noreferrer"
          target="_blank"
        >
          source code
        </a>{" "}
        and a more full{" "}
        <a
          href="https://nextter.now.sh"
          rel="noopener noreferrer"
          target="_blank"
        >
          example
        </a>{" "}
        for details.
      </p>
      <ul>
        {feeds.map(feed => (
          <li>{feed}</li>
        ))}
      </ul>
      <input
        value={feedInput}
        onChange={event => setFeedInput(event.target.value)}
        type="text"
        placeholder="insert rss feed..."
      />
      <button onClick={() => addFeed(feedInput)}>+</button>
      <ul>
        {articles.map(article =>
          article.items.map(item => (
            <li>
              <a href={item.link}>{item.title}</a>
            </li>
          ))
        )}
      </ul>
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
