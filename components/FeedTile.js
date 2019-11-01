import styled from "styled-components";

const StyledFeedTile = styled.li`
  margin-bottom: 5rem;
  border: 1px solid #f7f7f7;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.2rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.18);
  background-color: white;

  a {
    color: #001f3f;
    text-decoration: none;
    font-weight: bold;
    font-size: 13px;
  }
`;

const FeedTile = ({ item }) => {
  return (
    <StyledFeedTile key={item.key}>
      <a href={item.link}>{item.title}</a>
      <section dangerouslySetInnerHTML={{ __html: item.content }}></section>
    </StyledFeedTile>
  );
};

export default FeedTile;
