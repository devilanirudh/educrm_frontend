import React from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.css";

interface SurveyViewerProps {
  formJson: any;
}

const SurveyViewer: React.FC<SurveyViewerProps> = ({ formJson }) => {
  const survey = new Model(formJson);

  survey.onComplete.add((sender) => {
    console.log("Form Results:", sender.data);
    alert("Form submitted: " + JSON.stringify(sender.data));
  });

  return <Survey model={survey} />;
};

export default SurveyViewer;