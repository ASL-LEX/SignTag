import {
  AutocompleteInput,
  BooleanInput,
  Create,
  NumberInput,
  ReferenceInput,
  required,
  TabbedForm,
  TextInput
} from 'react-admin';
import { JSONFormsInput } from '../../components/formbuilder/JSONFormsInput.component';

export const CreateStudy: React.FC = () => {
  return (
    <Create>
      <TabbedForm>
        <TabbedForm.Tab label="Configuration">
          <TextInput source="name" validate={[required()]} />
          <TextInput source="description" validate={[required()]} />
          <TextInput source="instructions" validate={[required()]} multiline />
          <ReferenceInput source="project" reference="projects">
            <AutocompleteInput optionText="name" validate={[required()]} />
          </ReferenceInput>
          <NumberInput source="tagsPerEntry" validate={[required()]} />
          <BooleanInput source="studyConfig.disableSameUserEntryTagging" label="Disable Same User Entry Tagging" />
          <BooleanInput source="studyConfig.sortByEntryID" label="Sort By Entry ID" />
          <BooleanInput source="studyConfig.disableClear" label="Disable Clear" />
          <BooleanInput source="studyConfig.showPriorCue" label="Show Prior Cue" />
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Tag Schema">
          <JSONFormsInput source='tagSchema' />
        </TabbedForm.Tab>
      </TabbedForm>
    </Create>
  );
};
