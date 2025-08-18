import React from "react";
import { Model, StylesManager } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey.min.css";

// Apply theme globally
StylesManager.applyTheme("defaultV2");

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