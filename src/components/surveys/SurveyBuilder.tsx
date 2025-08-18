import React, { useState } from "react";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-creator-core/survey-creator-core.css";
import "survey-core/defaultV2.css";

interface SurveyBuilderProps {
  initialJson: any;
  onSave: (json: any) => void;
}

const creatorOptions = {
    showLogicTab: true,
};

const SurveyBuilder: React.FC<SurveyBuilderProps> = ({ initialJson, onSave }) => {
  const [creator] = useState(() => {
    const c = new SurveyCreator(creatorOptions);
    c.JSON = initialJson;
    c.saveSurveyFunc = (saveNo: number, callback: (saveNo: number, success: boolean) => void) => {
      onSave(c.JSON);
      console.log("Saved Survey JSON:", c.JSON);
      callback(saveNo, true); // Indicate success
    };
    return c;
  });

  return (
    <div style={{ height: "calc(100vh - 220px)", width: "100%" }}>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
};

export default SurveyBuilder;