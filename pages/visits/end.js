import React, { useEffect } from "react";
import Layout from "../../src/components/Layout";
import ActionLinkSection from "../../src/components/ActionLinkSection";
import ActionLink from "../../src/components/ActionLink";
import AnchorLink from "../../src/components/AnchorLink";
import InsetText from "../../src/components/InsetText";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import featureIsEnabled from "../../src/helpers/featureFlag";
import { v4 as uuidv4 } from "uuid";

const EndOfVisit = ({ wardId, callId, supportUrl, correlationId }) => {
  useEffect(() => {
    console.log(correlationId);
  }, []);
  return (
    <Layout title="Your virtual visit has completed" isBookService={false}>
      <div className="nhsuk-grid-row">
        {wardId && (
          <div className="nhsuk-grid-column-two-thirds">
            <div
              className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
              style={{ textAlign: "center" }}
            >
              <h1 className="nhsuk-panel__title">
                Your virtual visit has completed
              </h1>

              <div className="nhsuk-panel__body">
                <p>
                  Thank you for using the virtual visit service. Please hand the
                  iPad back to a NHS staff member.
                </p>
              </div>
            </div>
            <h2>What happens next</h2>

            <ActionLink href={`/wards/book-a-visit?rebookCallId=${callId}`}>
              Rebook another virtual visit
            </ActionLink>

            <p>
              <AnchorLink href="/wards/visits">
                Return to virtual visits
              </AnchorLink>
            </p>
          </div>
        )}
        {!wardId && (
          <div className="nhsuk-grid-column-two-thirds">
            <div
              className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
              style={{ textAlign: "center" }}
            >
              <h1 className="nhsuk-panel__title">
                Your virtual visit has completed
              </h1>

              <p className="nhsuk-u-margin-bottom-0">
                Thank you for using the virtual visit service.
              </p>
            </div>

            <InsetText>
              Your personal data will be removed within 24 hours.
            </InsetText>

            <ActionLinkSection
              heading="What happens next"
              link={supportUrl}
              linkText="Get support from this hospital"
            />

            {featureIsEnabled("UR_QUESTION") && <UrQuestion />}
          </div>
        )}
      </div>
    </Layout>
  );
};

function UrQuestion(/*prop*/) {
  return (
    <div className="nhsuk-form-group">
      <fieldset className="nhsuk-fieldset">
        <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--l">
          <h1 className="nhsuk-fieldset__heading">
            If this service was no longer available would you be
            dissappointed/upset?
          </h1>
        </legend>

        <div className="nhsuk-radios">
          <div className="nhsuk-radios__item">
            <input
              className="nhsuk-radios__input"
              id="ur-question-radio-yes"
              name="ur-question-radio"
              type="radio"
              value="yes"
            />
            <label
              className="nhsuk-label nhsuk-radios__label"
              htmlFor="ur-question-radio-yes"
            >
              Yes
            </label>
          </div>

          <div className="nhsuk-radios__item">
            <input
              className="nhsuk-radios__input"
              id="ur-question-radio-no"
              name="ur-question-radio"
              type="radio"
              value="no"
            />
            <label
              className="nhsuk-label nhsuk-radios__label"
              htmlFor="ur-question-radio-no"
            >
              No
            </label>
          </div>
        </div>
        <button className="nhsuk-button" type="submit">
          Submit feedback
        </button>
      </fieldset>
    </div>
  );
}

export const getServerSideProps = propsWithContainer(
  async ({ req: { headers }, container, query }) => {
    const userIsAuthenticated = container.getUserIsAuthenticated();
    //We'll need to have the submit button be able to send a request to the events logging thing
    //We'll then need to have it move on to another page
    //What if we stuck another part into the workflow between the end and this page?

    const token = await userIsAuthenticated(headers.cookie);
    const correlationId = `${uuidv4()}-visit-ended`;

    const {
      supportUrl,
      error: supportUrlError,
    } = await container.getRetrieveSupportUrlByCallId()(query.callId);

    let urQuestionUrl = null;

    if (featureIsEnabled("UR_QUESTION")) {
      urQuestionUrl = (await container.getRetrieveUrQuestionUrl()())
        .urQuestionUrl;
    }

    const error = supportUrlError;

    if (error) console.error(error);

    return {
      props: {
        wardId: token?.ward || null,
        callId: query.callId,
        supportUrl,
        correlationId,
        urQuestionUrl,
      },
    };
  }
);

export default EndOfVisit;
