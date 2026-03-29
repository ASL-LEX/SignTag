import { Typography, Button, Box, Stepper, Step, StepLabel } from '@mui/material';
import { TagFormBuilder } from '../../components/tagbuilder/TagFormBuilder.component';
import { NewStudyJsonForm } from '../../components/NewStudyJsonForm.component';
import { TagTrainingComponent } from '../../components/TagTraining.component';
import { useState, useEffect } from 'react';
import { StudyCreate, TagSchema } from '../../graphql/graphql';
import { PartialStudyCreate } from '../../types/study';
import { CreateStudyDocument, CreateStudyMutation, CreateStudyMutationVariables } from '../../graphql/study/study';
import { useProject } from '../../context/Project.context';
import { useStudy } from '../../context/Study.context';
import { useApolloClient } from '@apollo/client';
import {
  CreateTagsDocument,
  CreateTrainingSetDocument,
  CreateCatchTrialsDocument,
  CreateTagsMutationVariables,
  CreateTagsMutation,
  CreateTrainingSetMutation,
  CreateTrainingSetMutationVariables,
  CreateCatchTrialsMutation,
  CreateCatchTrialsMutationVariables
} from '../../graphql/tag/tag';
import { useTranslation } from 'react-i18next';
import { TagFieldFragmentSchema, TagField } from '../../components/tagbuilder/TagProvider';
import { useSnackbar } from '../../context/Snackbar.context';

export const NewStudy: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepLimit, setStepLimit] = useState(0);
  const [partialNewStudy, setPartialNewStudy] = useState<PartialStudyCreate | null>(null);
  const [tagSchema, setTagSchema] = useState<TagSchema | null>(null);
  const { project } = useProject();
  const { updateStudies } = useStudy();
  const [trainingSet, setTrainingSet] = useState<string[]>([]);
  const [taggingSet, setTaggingSet] = useState<string[]>([]);
  const [catchTrialSet, setCatchTrialSet] = useState<string[]>([]);
  const apolloClient = useApolloClient();
  // The different fields that make up the tag schema
  const [tagFields, setTagFields] = useState<TagField[]>([]);

  // Fragments of the final tag schema
  const [tagSchemaFragments, setTagSchemaFragments] = useState<(TagFieldFragmentSchema | null)[]>([]);

  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();

  // Handles mantaining which step the user is on and the step limit
  useEffect(() => {
    if (!partialNewStudy) {
      setStepLimit(0);
      return;
    }

    if (!tagSchema) {
      setStepLimit(1);
      return;
    }

    // TODO: Future work will be done to add in the entry selection step
    setStepLimit(3);
  }, [partialNewStudy, tagSchema]);

  const handleNext = async () => {
    if (activeStep === stepLimit) {
      return;
    }
    if (activeStep === steps.length - 1) {
      // Make sure the required fields are present
      if (!partialNewStudy || !tagSchema) {
        console.error('Reached submission with invalid data');
        return;
      }
      // Make sure a project is selected
      if (!project) {
        console.error('Reached submission with no project selected');
        return;
      }

      const study: StudyCreate = {
        ...partialNewStudy,
        project: project._id,
        tagSchema: tagSchema
      };

      // Make the new study
      const result = await apolloClient.mutate<CreateStudyMutation, CreateStudyMutationVariables>({
        mutation: CreateStudyDocument,
        variables: { study: study }
      });

      if (result.errors || !result.data) {
        pushSnackbarMessage(t('errors.studyCreate'), 'error');
        console.error(result.errors);
        return;
      }

      // Filter taggingSet to remove IDs that are also in catchTrialSet
      const filteredTaggingSet = taggingSet.filter((id) => !catchTrialSet.includes(id));

      // Create the corresponding tags
      await apolloClient.mutate<CreateTagsMutation, CreateTagsMutationVariables>({
        mutation: CreateTagsDocument,
        variables: { study: result.data.createStudy._id, entries: filteredTaggingSet }
      });

      // Create the corresponding Catch Trial tags
      await apolloClient.mutate<CreateCatchTrialsMutation, CreateCatchTrialsMutationVariables>({
        mutation: CreateCatchTrialsDocument,
        variables: { study: result.data.createStudy._id, entries: catchTrialSet }
      });

      // Create the training set
      await apolloClient.mutate<CreateTrainingSetMutation, CreateTrainingSetMutationVariables>({
        mutation: CreateTrainingSetDocument,
        variables: {
          study: result.data.createStudy._id,
          entries: trainingSet
        }
      });
      updateStudies();
    }
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      return;
    }
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = ['Study Identification', 'Construct Tagging Interface', 'Select Tag Training Items'];

  const getSectionComponent = () => {
    switch (activeStep) {
      case 0:
        return <NewStudyJsonForm newStudy={partialNewStudy} setNewStudy={setPartialNewStudy} />;
      case 1:
        return (
          <TagFormBuilder
            tagSchema={tagSchema}
            setTagSchema={setTagSchema}
            tagFields={tagFields}
            setTagFields={setTagFields}
            tagSchemaFragments={tagSchemaFragments}
            setTagSchemaFragments={setTagSchemaFragments}
          />
        );
      case 2:
        return (
          <TagTrainingComponent
            setTaggingSet={setTaggingSet}
            setTrainingSet={setTrainingSet}
            setCatchTrialSet={setCatchTrialSet}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Typography variant="h5">{t('components.newStudy.createStudy')}</Typography>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const getName = () => {
            switch (label) {
              case steps[0]:
                return t('components.newStudy.steps.studyIdentification');
              case steps[1]:
                return t('components.newStudy.steps.constructTagging');
              case steps[2]:
                return t('components.newStudy.steps.selectItems');
              default:
                throw new Error(`Unknown study creation step: ${label}`);
            }
          };

          return (
            <Step key={label}>
              <StepLabel>{getName()}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>{t('components.newStudy.completed')}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>{t('components.newStudy.startOver')}</Button>
          </Box>
        </>
      ) : (
        <>
          {getSectionComponent()}
          <Box sx={{ marginTop: '30px', display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              {t('common.back')}
            </Button>
            <Button variant="outlined" disabled={activeStep === stepLimit} onClick={handleNext}>
              {activeStep === steps.length - 1 ? t('common.finish') : t('common.next')}
            </Button>
          </Box>
        </>
      )}
    </>
  );
};
