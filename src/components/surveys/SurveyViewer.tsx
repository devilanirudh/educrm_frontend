import React from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";

interface SurveyViewerProps {
  json: any;
}

const SurveyViewer: React.FC<SurveyViewerProps> = ({ json }) => {
  const survey = new Model(json);

  return <Survey model={survey} />;
};

export default SurveyViewer;