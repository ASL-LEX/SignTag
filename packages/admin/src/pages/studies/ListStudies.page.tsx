import { Datagrid, List, TextField } from 'react-admin';

export const ListStudies: React.FC = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="name" />
        <TextField source="description" />
      </Datagrid>
    </List>
  );
};
