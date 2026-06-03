import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Dispatch, SetStateAction, useState, useRef } from 'react';
import { PartialStudyCreate } from '../types/study';
import { ErrorObject } from 'ajv';
import { StudyExistsQuery, StudyExistsQueryVariables, StudyExistsDocument } from '../graphql/study/study';
import { useProject } from '../context/Project.context';
import { useTranslation } from 'react-i18next';
import { useApolloClient } from '@apollo/client';
import { useSnackbar } from '../context/Snackbar.context';

export interface NewStudyFormProps {
  newStudy: PartialStudyCreate | null;
  setNewStudy: Dispatch<SetStateAction<PartialStudyCreate | null>>;
}

export const NewStudyJsonForm: React.FC<NewStudyFormProps> = (props) => {
  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      description: {
        type: 'string'
      },
      instructions: {
        type: 'string'
      },
      tagsPerEntry: {
        type: 'number',
        default: 1
      },
      studyConfig: {
        type: 'object',
        properties: {
          disableSameUserEntryTagging: {
            type: 'boolean',
            default: false
          },
          sortByEntryID: {
            type: 'boolean',
            default: false
          },
          disableClear: {
            type: 'boolean',
            default: false
          },
          showPriorCue: {
            type: 'boolean',
            default: false
          }
        }
      }
    },
    required: ['name', 'description', 'instructions', 'tagsPerEntry']
  };

  const uischema = {
    type: 'Group',
    label: t('components.newStudy.formTitle'),
    elements: [
      {
        type: 'Control',
        label: t('common.name'),
        scope: '#/properties/name'
      },
      {
        type: 'Control',
        label: t('common.description'),
        scope: '#/properties/description'
      },
      {
        type: 'Control',
        label: t('common.instruction'),
        scope: '#/properties/instructions'
      },
      {
        type: 'Control',
        label: t('components.newStudy.tagsDescription'),
        scope: '#/properties/tagsPerEntry'
      },
      {
        type: 'Control',
        label: t('components.newStudy.disableSameUserTagging'),
        scope: '#/properties/studyConfig/properties/disableSameUserEntryTagging'
      },
      {
        type: 'Control',
        label: t('components.newStudy.sortByEntryID'),
        scope: '#/properties/studyConfig/properties/sortByEntryID'
      },
      {
        type: 'Control',
        label: t('components.newStudy.disableClear'),
        scope: '#/properties/studyConfig/properties/disableClear'
      },
      {
        type: 'Control',
        label: t('components.newStudy.showPriorCue'),
        scope: '#/properties/studyConfig/properties/showPriorCue'
      }
    ]
  };

  const { project } = useProject();
  const [additionalErrors, setAdditionalErrors] = useState<ErrorObject[]>([]);
  const client = useApolloClient();

  const initialData = {
    tagsPerEntry: schema.properties.tagsPerEntry.default,
    ...props.newStudy
  };
  const [data, setData] = useState<any>(initialData);
  const stateRef = useRef<{ data: any }>();
  stateRef.current = { data };

  const handleChange = async (data: any, errors: ErrorObject[] | undefined) => {
    setData(data);

    // If there is any issue with the data, set the study to null
    if (errors && errors.length > 0) {
      props.setNewStudy(null);
    }

    if (!data || !data.name) {
      return;
    }

    // No errors in the format of the data, check if the study name is unique
    const exists = await client.query<StudyExistsQuery, StudyExistsQueryVariables>({
      query: StudyExistsDocument,
      variables: {
        name: data.name,
        project: project!._id
      }
    });

    // Study with the name already exists, add the error
    if (exists.data.studyExists) {
      setAdditionalErrors([
        {
          instancePath: '/name',
          keyword: 'uniqueStudyName',
          message: 'A study with this name already exists',
          schemaPath: '#/properties/name/name',
          params: { keyword: 'uniqueStudyName' }
        }
      ]);
      props.setNewStudy(null);
      return;
    } else if (exists.error) {
      pushSnackbarMessage(t('errors.studyExists'), 'error');
      props.setNewStudy(null);
      return;
    }

    // No errors
    props.setNewStudy(data);
  };

  return (
    <>
      {project && (
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data, errors }) => handleChange(data, errors)}
          additionalErrors={additionalErrors}
        />
      )}
    </>
  );
};
