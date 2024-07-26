import { Column, Row } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "1 row, 3 columns";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Row>
        <Column className="w-1/3">First</Column>
        <Column className="w-1/3">Second</Column>
        <Column className="w-1/3">Third</Column>
      </Row>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Row>
        <Column style={{ width: "33.333%" }}>First</Column>
        <Column style={{ width: "33.333%" }}>Second</Column>
        <Column style={{ width: "33.333%" }}>Third</Column>
      </Row>
      {/* end pattern code */}
    </Layout>
  );
};

export default Tailwind;