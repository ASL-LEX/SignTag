import { Admin, Resource } from 'react-admin';
import { ConfigProvider } from './contexts/Config.provider';
import { useConfig } from './contexts/Config.context';
import { createMongoIdDataProvider } from './dataProviders/MongoIdDataProvider';
import { ListProjects } from './pages/projects/ListProjects.page';
import { ShowProject } from './pages/projects/ShowProject.page';
import { CreateProject } from './pages/projects/CreateProject.page';

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
    </Admin>
  );
};

export default App;
