import React, { useEffect, useRef } from "react";
import { SurveyCreator } from "survey-creator-react";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";

interface SurveyBuilderProps {
  initialJson: any;
  onSave: (json: any) => void;
}

const SurveyBuilder: React.FC<SurveyBuilderProps> = ({ initialJson, onSave }) => {
  const creatorRef = useRef<any>(null);

  useEffect(() => {
    const creator = new SurveyCreator({
      showLogicTab: true,
      showTranslationTab: true,
    });

    creator.JSON = initialJson;

    creator.saveSurveyFunc = (saveNo: number, callback: (no: number, success: boolean) => void) => {
      onSave(creator.JSON);
      callback(saveNo, true);
    };

    creatorRef.current = creator;
    creator.render("surveyCreatorContainer");
  }, [initialJson, onSave]);

  return <div id="surveyCreatorContainer" style={{ height: "100vh" }} />;
};

export default SurveyBuilder;