import React from "react";
import ReactLoading from "react-loading";

const LoadingBars = ({ loading }) =>
  loading ? (
    <ReactLoading type="bars" color="#39cccc" height={200} width={70} />
  ) : null;
export default LoadingBars;
