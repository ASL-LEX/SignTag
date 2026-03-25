import { Admin, Resource } from "react-admin";
import simpleRestProvider from 'ra-data-simple-rest';
import { ProjectsList } from "../../components/admin/projects/ProjectsList.component";


export const AdminLanding: React.FC = () => {
  const dataProvider = simpleRestProvider('http://localhost:3000/api/admin');

  return (
    <Admin basename="/admin" dataProvider={dataProvider}>
      <Resource name="projects" list={ProjectsList} />
    </Admin>
  );
}
