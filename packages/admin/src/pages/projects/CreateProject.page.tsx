import { Create, required, SimpleForm, TextInput } from 'react-admin';

export const CreateProject: React.FC = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" validate={[required()]} />
        <TextInput source="description" validate={[required()]} />
      </SimpleForm>
    </Create>
  );
};
