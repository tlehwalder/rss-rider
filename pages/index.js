import { useState, useEffect } from "react";
import fetch from "isomorphic-unfetch";
import Parser from "rss-parser";
import PageTitle from "../components/PageTitle";
import LoadingBars from "../components/LoadingBars";

function useLocalStorage(key, initialValue) {
  // State to store our value

  // Pass initial state function to useState so logic is only executed once

  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key

      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue

      console.log(error);

      return initialValue;
    }
  });
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState

      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state

      setStoredValue(valueToStore);

      // Save to local storage

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case

      console.log(error);
    }
  };

  return [storedValue, setValue];
}

const Index = ({ posts }) => {
  const [feedsLocal, setFeedsLocal] = useLocalStorage("feeds", []);

  const [feeds, setFeeds] = useState(feedsLocal || []);
  const [articles, setArticles] = useState([]);
  const [feedInput, setFeedInput] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeeds = async () => {
      setLoading(true);
      const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
      //const CORS_PROXY = "https://crossorigin.me/";

      let parser = new Parser();
      let articles = null;
      try {
        articles = await Promise.all(
          feeds.map(async feed => {
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
  }, [feeds]);

  function addFeed(url) {
    setFeeds([...feeds, url]);
    setFeedsLocal([...feeds, url]);
    setFeedInput("");
  }

  console.log(articles);

  return (
    <>
      <PageTitle>RSS Rider ð</PageTitle>
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
      <LoadingBars loading={isLoading} />
      <ul>
        {articles.map(article =>
          article.items.map(item => (
            <li>
              <a href={item.link}>{item.title}</a>
              <section
                dangerouslySetInnerHTML={{ __html: item.content }}
              ></section>
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
