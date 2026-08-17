import { Admin, Resource } from 'react-admin';
import { ConfigProvider } from './contexts/Config.provider';
import { useConfig } from './contexts/Config.context';
import { createMongoIdDataProvider } from './dataProviders/MongoIdDataProvider';
import { ListProjects } from './pages/projects/ListProjects.page';
import { ShowProject } from './pages/projects/ShowProject.page';
import { CreateProject } from './pages/projects/CreateProject.page';
import { ListStudies } from './pages/studies/ListStudies.page';
import { ShowStudy } from './pages/studies/ShowStudy.page';
import { CreateStudy } from './pages/studies/CreateStudy.page';

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <ConfigWrappedInner />
    </ConfigProvider>
  );
};

const ConfigWrappedInner: React.FC = () => {
  // Setup React Admin data provider
  const config = useConfig();
  const dataProvider = createMongoIdDataProvider(config.backend.apiBase);
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="projects" list={ListProjects} show={ShowProject} create={CreateProject} />
      <Resource name="studies" list={ListStudies} show={ShowStudy} create={CreateStudy} />
    </Admin>
  );
};

export default App;
