import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./rider"), {
  ssr: false
});

export default () => (
  <div>
    <DynamicComponentWithNoSSR />
  </div>
);
