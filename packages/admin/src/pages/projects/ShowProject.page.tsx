import { Show, SimpleShowLayout, TextField } from "react-admin";


export const ShowProject: React.FC = () => {

  return (
    <Show>
      <SimpleShowLayout>
        <TextField source='name' />
        <TextField source='description' />
      </SimpleShowLayout>
    </Show>
  );
};
