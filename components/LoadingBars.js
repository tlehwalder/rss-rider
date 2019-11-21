import React from "react";
import ReactLoading from "react-loading";
import styled from "styled-components";

const LoadingWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin: 8rem 0;
`;

const LoadingBars = ({ loading }) =>
  loading ? (
    <LoadingWrapper>
      <ReactLoading type="bars" color="#001f3f" height={200} width={70} />
    </LoadingWrapper>
  ) : null;
export default LoadingBars;
