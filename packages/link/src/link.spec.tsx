import { render } from "@react-email/render";
import { Link } from "./index";

describe("<Link> component", () => {
  it("renders children correctly", async () => {
    const testMessage = "Test message";
    const html = await render(<Link href="https://example.com">{testMessage}</Link>);
    expect(html).toContain(testMessage);
  });

  it("passes style and other props correctly", async () => {
    const style = { color: "red" };
    const html = await render(
      <Link data-testid="link-test" href="https://example.com" style={style}>
        Test
      </Link>,
    );
    expect(html).toContain("color:red");
    expect(html).toContain('data-testid="link-test"');
  });

  it("opens in a new tab", async () => {
    const html = await render(<Link href="https://example.com">Test</Link>);
    expect(html).toContain(`target="_blank"`);
  });

  it("renders correctly", async () => {
    const actualOutput = await render(
      <Link href="https://example.com">Example</Link>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      '"<!DOCTYPE html PUBLIC \\"-//W3C//DTD XHTML 1.0 Transitional//EN\\" \\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\\"><a href=\\"https://example.com\\" style=\\"color:#067df7;text-decoration:none\\" target=\\"_blank\\">Example</a>"',
    );
  });
});
