/* global describe, it, expect */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import Duration from './Duration';

const DATE_FIXTURES = [
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-07T09:00:00.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-07T09:00:05.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-07T09:15:07.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-07T10:45:16.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-07T13:59:03.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-08T16:03:21.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-05-21T01:22:12.000Z" },
  { from: "2016-05-07T09:00:00.000Z", to: "2016-07-10T04:34:17.000Z" }
];

describe('Duration', () => {
  const componentList = Object.keys(Duration);

  it('stateless Components are accessible', () => {
    expect(componentList).toMatchSnapshot();
  });

  componentList.forEach((componentName) => {
    describe(`Duration.${componentName}`, () => {
      const DurationComponent = Duration[componentName];

      it('renders as expected', () => {
        DATE_FIXTURES.forEach((fixtureData) => {
          const component = ReactTestRenderer.create(
            <DurationComponent {...fixtureData} updateFrequency={0} />
          );

          const tree = component.toJSON();
          expect(tree).toMatchSnapshot();
        });
      });

      xdescribe('updateFrequency', () => {
        // TODO: Need to be able to instrument updating and interactions
        it('sets an interval if supplied with a frequency greater than zero', () => {
          const component = (<DurationComponent from="2016-05-07T09:00:00.000Z" to="2016-05-07T09:00:00.000Z" updateFrequency={10} />);
          const rendered = ReactTestRenderer.create(component);

          expect(rendered.toJSON()).toMatchSnapshot();
        });

        it('sets no interval if supplied with a frequency of zero', () => {
          const rendered = ReactTestRenderer.create(
            <DurationComponent from="2016-05-07T09:00:00.000Z" to="2016-05-07T09:00:00.000Z" updateFrequency={0} />
          );

          expect(rendered.toJSON()).toMatchSnapshot();
        });
      });
    });
  });
});
