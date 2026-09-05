import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '../components/layout/Header';
import { ProgressBar } from '../components/layout/ProgressBar';
import { TeamSelector } from '../components/forms/TeamSelector';
import { FileUpload } from '../components/forms/FileUpload';
import { CharacterCounter } from '../components/forms/CharacterCounter';
import { fullSubmissionSchema, type FullSubmissionData } from '../schemas/submission.schema';
import { getTeams, submitForm } from '../services/submission';
import type { Team } from '../types';

const steps = ['Instructions', 'Team Details', 'Submission', 'Review'];

export function SubmissionFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [teams, setTeams] = useState<Team[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);

  const methods = useForm<FullSubmissionData>({
    resolver: zodResolver(fullSubmissionSchema),
    mode: 'onChange',
    defaultValues: {
      teamId: '',
      leaderEmail: '',
      leaderContact: '',
      domain: '',
      problemStatement: '',
      solutionSummary: '',
    },
  });

  const { register, trigger, getValues, setValue, watch, formState: { errors } } = methods;

  useEffect(() => {
    getTeams().then(setTeams).catch(console.error);
  }, []);

  const handleNext = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      const isValid = await trigger(['teamId', 'leaderEmail', 'leaderContact']);
      if (isValid) setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      const isValid = await trigger(['domain', 'problemStatement', 'solutionSummary']);
      if (!file) {
        setSubmitError('Please upload a presentation file');
        return;
      }
      setSubmitError('');
      if (isValid) setCurrentStep(4);
      return;
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async () => {
    if (!file) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const data = getValues();
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      formData.append('file', file);

      const res = await submitForm(formData);
      navigate(`/success/${res.submissionId}`);
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-100">Instructions</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-300 space-y-4">
              <p>Welcome to the CodeMerge V2.0 submission portal.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ensure all your team members have reviewed the final presentation.</li>
                <li>Only one submission per team is allowed.</li>
                <li>Double check your contact information.</li>
                <li>File size must not exceed 10 MB.</li>
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">Team Details</h2>
              <p className="text-gray-400 mt-1">Select your team and enter leader contact information.</p>
            </div>
            
            <div className="space-y-4">
              <TeamSelector
                teams={teams}
                value={watch('teamId')}
                onChange={(val) => setValue('teamId', val, { shouldValidate: true })}
                error={errors.teamId?.message}
              />
              {watch('teamId') && (
                <p className="text-sm text-green-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {teams.find(t => t.id === watch('teamId'))?.teamName} — Please confirm this is the correct team.
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Leader Email</label>
                <input
                  type="email"
                  {...register('leaderEmail')}
                  className={`w-full bg-gray-800 border ${errors.leaderEmail ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-brand-500 outline-none`}
                  placeholder="leader@example.com"
                />
                {errors.leaderEmail && <p className="mt-1 text-sm text-red-500">{errors.leaderEmail.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Leader Contact</label>
                <input
                  type="text"
                  {...register('leaderContact')}
                  className={`w-full bg-gray-800 border ${errors.leaderContact ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-brand-500 outline-none`}
                  placeholder="9876543210"
                />
                {errors.leaderContact && <p className="mt-1 text-sm text-red-500">{errors.leaderContact.message}</p>}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-100">Submission Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Domain</label>
                <select
                  {...register('domain')}
                  className={`w-full bg-gray-800 border ${errors.domain ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-brand-500 outline-none appearance-none`}
                >
                  <option value="AI for EDTECH/FINTECH/HEALTHTECH">
AI for EDTECH/FINTECH/HEALTHTECH
</option>
<option value="AI FOR SUSTAINABILITY">
  AI FOR SUSTAINABILITY
</option>
<option value="AI + IOT">
  AI + IOT
</option>
<option value="AI FOR SAFETY & SECURITY">
  AI FOR SAFETY & SECURITY
</option>
                </select>
                {errors.domain && <p className="mt-1 text-sm text-red-500">{errors.domain.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Problem Statement</label>
                <textarea
                  {...register('problemStatement')}
                  rows={4}
                  className={`w-full bg-gray-800 border ${errors.problemStatement ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-brand-500 outline-none resize-none`}
                />
                <CharacterCounter current={watch('problemStatement')?.length || 0} max={1000} />
                {errors.problemStatement && <p className="mt-1 text-sm text-red-500">{errors.problemStatement.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Solution Summary</label>
                <p className="text-xs text-gray-500 mb-2">Briefly describe your proposed solution, including the approach, key features, and how it addresses the problem statement.</p>
                <textarea
                  {...register('solutionSummary')}
                  rows={4}
                  className={`w-full bg-gray-800 border ${errors.solutionSummary ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-gray-100 focus:ring-2 focus:ring-brand-500 outline-none resize-none`}
                />
                <CharacterCounter current={watch('solutionSummary')?.length || 0} max={750} />
                {errors.solutionSummary && <p className="mt-1 text-sm text-red-500">{errors.solutionSummary.message}</p>}
              </div>

              <FileUpload
                file={file}
                onFileSelect={(f) => { setFile(f); setSubmitError(''); }}
                error={submitError}
              />
            </div>
          </div>
        );
      case 4:
        const data = getValues();
        const team = teams.find(t => t.id === data.teamId);
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-100">Review Your Submission</h2>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-800">
              <div className="p-4 flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Team Details</p>
                  <p className="font-medium text-gray-200 mt-1">{team?.teamName}</p>
                  <p className="text-sm text-gray-400">{data.leaderEmail} • {data.leaderContact}</p>
                </div>
                <button onClick={() => setCurrentStep(2)} className="text-sm text-brand-400 hover:text-brand-300">Edit</button>
              </div>
              
              <div className="p-4 flex justify-between items-start">
                <div className="w-full pr-4">
                  <p className="text-sm text-gray-500">Domain</p>
                  <p className="font-medium text-gray-200 mt-1">{data.domain}</p>
                  
                  <p className="text-sm text-gray-500 mt-4">Problem Statement</p>
                  <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{data.problemStatement}</p>
                  
                  <p className="text-sm text-gray-500 mt-4">Solution Summary</p>
                  <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{data.solutionSummary}</p>
                </div>
                <button onClick={() => setCurrentStep(3)} className="text-sm text-brand-400 hover:text-brand-300 flex-shrink-0">Edit</button>
              </div>

              <div className="p-4 flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Presentation File</p>
                  <p className="font-medium text-gray-200 mt-1">{file?.name}</p>
                  <p className="text-sm text-gray-400">{file ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : ''}</p>
                </div>
                <button onClick={() => setCurrentStep(3)} className="text-sm text-brand-400 hover:text-brand-300">Edit</button>
              </div>
            </div>

            <div className="flex items-start mt-6">
              <input
                type="checkbox"
                id="confirm"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-700 bg-gray-800 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="confirm" className="ml-3 text-sm text-gray-300 cursor-pointer">
                I confirm that all information provided is correct and this is my team's final submission.
              </label>
            </div>

            {submitError && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                {submitError}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl w-full mx-auto p-6">
        <ProgressBar currentStep={currentStep} steps={steps} />
        
        <FormProvider {...methods}>
          <div className="mt-8 mb-20">
            {renderStep()}
          </div>
        </FormProvider>

        <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 p-4">
          <div className="max-w-2xl mx-auto flex justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                ← Back
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={!confirmChecked || isSubmitting}
                className="px-6 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Final Presentation'
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
