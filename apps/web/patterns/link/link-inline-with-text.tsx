import { Link, Text } from "@react-email/components";
import { Layout } from "../_components/layout";

export const title = "Link inline with text";

export const Tailwind = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text>
        This is <Link href="https://react.email">React Email</Link>
      </Text>
      {/* end pattern code */}
    </Layout>
  );
};

export const InlineStyles = () => {
  return (
    <Layout>
      {/* start pattern code */}
      <Text>
        This is <Link href="https://react.email">React Email</Link>
      </Text>
      {/* end pattern code */}
    </Layout>
  );
};

export default Tailwind;