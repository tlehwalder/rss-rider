import styled from "styled-components";
import FeedTile from "./FeedTile";

const StyledFeedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const buildFeedTile = (item, searchInput) => {
  return item.title.includes(searchInput) ||
    (item.content && item.content.includes(searchInput)) ? (
    <FeedTile item={item} />
  ) : null;
};
const FeedList = ({ articles, searchInput }) => {
  const feeds =
    articles &&
    articles.flatMap((article, _i) =>
      article.items.map((item, _j) => ({ ...item, key: `${_i}-${_j}` }))
    );
  return (
    <StyledFeedList>
      {feeds && feeds.map(feed => buildFeedTile(feed, searchInput))}
    </StyledFeedList>
  );
};

export default FeedList;
