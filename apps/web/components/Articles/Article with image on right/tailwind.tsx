/* eslint-disable react/no-unescaped-entities */
import { Img, Link, Section, Text } from "@react-email/components";

export const component =  (
  <Section className="my-4">
    <Section
      align="left"
      className="inline-block w-full max-w-[250px] text-left align-top"
    >
      <Text className="m-0 text-base font-semibold text-indigo-600">
        What's new
      </Text>
      <Text className="m-0 mt-2 text-xl font-semibold text-gray-900">
        Versatile Comfort
      </Text>
      <Text className="mt-2 text-base text-gray-500">
        Experience ultimate comfort and versatility with our furniture
        collection, designed to adapt to your ever-changing needs.
      </Text>
      <Link className="text-indigo-600 underline" href="https://react.email">
        Read more
      </Link>
    </Section>
    <Section
      align="right"
      className="my-2 inline-block w-full max-w-[220px] align-top"
    >
      <Img
        alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
        className="rounded-lg object-cover"
        height={220}
        src="https://images.unsplash.com/photo-1611254666354-d75bfe3cadbc?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        width={220}
      />
    </Section>
  </Section>
);