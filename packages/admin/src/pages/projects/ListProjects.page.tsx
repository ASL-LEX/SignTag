import { Datagrid, List, TextField } from "react-admin";

export const ListProjects: React.FC = () => {
  return (
    <List>
      <Datagrid>
        <TextField source='name' />
        <TextField source='description' />
      </Datagrid>
    </List>
  );
};
