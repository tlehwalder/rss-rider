import styled from "styled-components";

const ListContainer = styled.ul`
  list-style: none;
  list-style-image: none;
  padding: 0;
  margin: 1.4em 0;
`;

const VisibilityIcon = styled.span`
  &:before {
    font-family: "Material Icons";
    content: "visibility";
    color: ${props => (props.visible ? "#1dbf73" : "lightgray")};
    padding-right: 12px;
  }
`;

class RequestedFeed extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.feed);
    console.log(this.props.feed.visible);
    return (
      <li className="accordion flex border-b border-t bg-white border-r border-l p-1 pl-4 border-grey-light hover:bg-gray-100">
        <VisibilityIcon
          visible={this.props.feed.visible}
          className="cursor-pointer"
          onClick={() =>
            this.props.setFeedVisibility(
              this.props.feed.feedUrl,
              !this.props.feed.visible
            )
          }
        />
        <span key={this.props._i}>
          <span className="font-bold ">{this.props.feed.title}</span>
          {"  -  "}
          <span>{this.props.feed.feedUrl}</span>
        </span>
      </li>
    );
  }
}

const FeedUrls = ({ requestedFeeds, setFeedVisibility }) => {
  return (
    <ListContainer>
      {requestedFeeds.map((feed, _i) => (
        <RequestedFeed
          setFeedVisibility={setFeedVisibility}
          feed={feed}
          _i={_i}
        ></RequestedFeed>
      ))}
    </ListContainer>
  );
};

export default FeedUrls;
