
import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Tailwind,
} from "@react-email/components";
import { imagesWithAlternatingGrid } from "./_patterns/gallery/images-with-alternating-grid";
import { gridWith4Images } from "./_patterns/gallery/grid-with-4-images";
import tailwindConfig from "./tailwind.config";

const Gallery = () => {
  return (
    <Html>
      <Head>
        <Font
          fallbackFontFamily="Helvetica"
          fontFamily="Inter"
          fontStyle="normal"
          fontWeight={400}
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
            format: "woff2",
          }}
        />
      </Head>

      <Tailwind config={tailwindConfig}>
        <Body>
          <Container>
            {imagesWithAlternatingGrid}
            {gridWith4Images}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Gallery;
