import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

export function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 -z-10 rounded"></div>
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          
          let circleClasses = "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium bg-gray-950 transition-colors ";
          if (isCompleted) {
            circleClasses += "border-green-500 text-green-500";
          } else if (isActive) {
            circleClasses += "border-brand-500 text-brand-500 shadow-[0_0_10px_rgba(46,125,255,0.3)]";
          } else {
            circleClasses += "border-gray-700 text-gray-500";
          }

          return (
            <div key={step} className="flex flex-col items-center gap-2 relative bg-gray-950 px-2">
              <div className={circleClasses}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className={`hidden sm:block text-xs font-medium ${isActive ? 'text-gray-100' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
