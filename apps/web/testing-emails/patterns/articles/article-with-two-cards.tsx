/* eslint-disable react/no-unescaped-entities */
import { Column, Img, Row, Section, Text } from "@react-email/components";

export const title = "With two cards";

export const articleWithTwoCards = (
  /* start pattern code */
  <Section>
    <Row>
      <Text className="m-0 text-xl font-semibold text-gray-900">
        Elevate Outdoor Living
      </Text>
      <Text className="mt-2 text-base text-gray-500">
        Take your outdoor space to new heights with our premium outdoor
        furniture, designed to elevate your alfresco experience.
      </Text>
    </Row>
    <Row className="mt-4">
      <Column className="w-[50%] align-baseline pr-2 box-border" colSpan={1}>
        <Img
          className="w-full rounded-lg object-cover"
          height="180"
          src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Text className="text-base font-semibold text-indigo-600">
          What's new
        </Text>
        <Text className="m-0 text-xl font-semibold text-gray-900">
          Multifunctional Marvels
        </Text>
        <Text className="mb-0 mt-2 text-base text-gray-500">
          Discover the innovative world of multifunctional furniture, where
          style meets practicality, offering creative solutions for maximizing
          space and enhancing functionality in your home
        </Text>
      </Column>
      <Column className="w-[50%] align-baseline pl-2 box-border" colSpan={1}>
        <Img
          className="w-full rounded-lg object-cover"
          height="180"
          src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Text className="text-base font-semibold text-indigo-600">
          What's new
        </Text>
        <Text className="m-0 text-xl font-semibold text-gray-900">
          Timeless Classics
        </Text>
        <Text className="mb-0 mt-2 text-base text-gray-500">
          Step into the world of timeless classics as we explore iconic
          furniture pieces that have stood the test of time, adding enduring
          elegance and sophistication to any interior
        </Text>
      </Column>
    </Row>
  </Section>
  /* end pattern code */
);

export default articleWithTwoCards;
