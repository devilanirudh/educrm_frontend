import React from 'react';
import FieldPalette from '../../components/form-builder/FieldPalette';
import Canvas from '../../components/form-builder/Canvas';
import PropertyEditor from '../../components/form-builder/PropertyEditor';
import TopBar from '../../components/form-builder/TopBar';

const ReportCardBuilderPage: React.FC = () => {
  return (
      <div className="flex flex-col h-screen bg-gray-100">
        <TopBar onSave={() => {}} isSaving={false} />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/4 p-4 overflow-y-auto bg-white border-r">
            <FieldPalette />
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <Canvas />
          </div>
          <div className="w-1/4 p-4 overflow-y-auto bg-white border-l">
            <PropertyEditor />
          </div>
        </div>
      </div>
  );
};

export default ReportCardBuilderPage;