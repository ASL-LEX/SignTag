import { BooleanField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const ShowStudy: React.FC = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="name" />
        <TextField source="description" />
        <BooleanField source="studyConfig.disableSameUserEntryTagging" label="Disable Same User Entry Tagging" />
        <BooleanField source="studyConfig.sortByEntryID" label="Sort By Entry ID" />
        <BooleanField source="studyConfig.disableClear" label="Disable Clear" />
        <BooleanField source="studyConfig.showPriorCue" label="Show Prior Cue" />
      </SimpleShowLayout>
    </Show>
  );
};
