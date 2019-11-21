import styled from "styled-components";

const ListContainer = styled.ul`
  list-style: none;
  list-style-image: none;
  padding: 0;

  li:before {
    font-family: "Material Icons";
    content: "visibility";
    color: #1dbf73;
    padding-right: 12px;
  }
`;

const FeedUrls = ({ requestedFeeds }) => (
  <ListContainer>
    {requestedFeeds.map((feed, _i) => (
      <li key={_i}>{feed}</li>
    ))}
  </ListContainer>
);

export default FeedUrls;
