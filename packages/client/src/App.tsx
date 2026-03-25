import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { ThemeProvider } from './theme/ThemeProvider';
import { NavBar } from './components/NavigationBar.component';
import { NewProject } from './pages/projects/NewProject';
import { ProjectControl } from './pages/projects/ProjectControl';
import { SuccessPage } from './pages/SuccessPage';
import { NewStudy } from './pages/studies/NewStudy';
import { ContributeLanding } from './pages/contribute/ContributeLanding';
import { TaggingInterface } from './pages/contribute/TaggingInterface';
import { StudyControl } from './pages/studies/StudyControl';
import { ProjectAccess } from './pages/datasets/ProjectAccess';
import { ProjectUserPermissions } from './pages/projects/ProjectUserPermissions';
import { StudyUserPermissions } from './pages/studies/UserPermissions';
import { TagView } from './pages/studies/TagView';
import { DatasetControls } from './pages/datasets/DatasetControls';
import { AuthProvider, useAuth } from './context/Auth.context';
import { AdminGuard } from './guards/AdminGuard';
import { CssBaseline, Box, styled, CircularProgress, Typography } from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';
import { SideBar } from './components/SideBar.component';
import { ProjectProvider } from './context/Project.context';
import { ApolloClient, ApolloProvider, InMemoryCache, concat, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { StudyProvider } from './context/Study.context';
import { ConfirmationProvider } from './context/Confirmation.context';
import { DatasetProvider } from './context/Dataset.context';
import { EntryControls } from './pages/studies/EntryControls';
import { PermissionProvider } from './context/Permission.context';
import { TagTrainingView } from './pages/studies/TagTrainingView';
import { SnackbarProvider } from './context/Snackbar.context';
import { DatasetDownloads } from './pages/datasets/DatasetDownloads';
import { StudyDownloads } from './pages/studies/StudyDownloads';
import { useTranslation } from 'react-i18next';
import * as firebase from '@firebase/app';
import { User, getAuth } from '@firebase/auth';
import { AdminLanding } from './pages/admin/AdminLanding.page';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_AUTH_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN
};

const drawerWidth = 256;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}));

type AppState = 'loading' | 'ready' | 'failed';

const App: FC = () => {
  // State of the app loading
  const [appState, setAppState] = useState<AppState>('loading');
  // Initialize firebase app right away
  firebase.initializeApp(firebaseConfig);

  const checkBackend = async () => {
    const result = await fetch(import.meta.env.VITE_HEALTH_ENDPOINT);
    try {
      if (result.ok) {
        setAppState('ready');
      } else {
        console.error('Health endpoint returned non-ok value');
        console.error(`Health endpoint status: ${result.status}`);
        console.error(`Health result ${await result.text()}`);
      }
    } catch (e) {
      console.error('Failed to call health endpoint');
      console.error(e);
      setAppState('failed');
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const render = (state: AppState) => {
    switch (appState) {
      case 'loading':
        return <AppLoading />;
      case 'ready':
        return <AppReady />;
      case 'failed':
        return <AppFailed />;
      default:
        throw Error(`Unknown state ${state}`);
    }
  };

  return (
    <ThemeProvider>
      <BrowserRouter>{render(appState)}</BrowserRouter>
    </ThemeProvider>
  );
};

/** Loading screen */
const AppLoading: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h2">{t('common.loading')}</Typography>
      <CircularProgress />
    </>
  );
};

/** Error screen */
const AppFailed: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h2">{t('home.backendFailed')}</Typography>
    </>
  );
};

/** Portion of the app that can be loaded after the backend is ready */
const AppReady: FC = () => {
  // Link for making the HTTP requests
  const httpLink = createHttpLink({ uri: import.meta.env.VITE_GRAPHQL_ENDPOINT });

  // IMPORTANT
  // This block handles more then meets the eye, by listening to
  // the change in the auth state, the whole app updates between the
  // login screen and the normal app view.
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();
  auth.onAuthStateChanged((user) => {
    setUser(user);
  });

  // Link for adding auth header to GraphQL requests
  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: user ? `Bearer ${await user.getIdToken(false)}` : '',
        organization: import.meta.env.VITE_ORGANIZATION_ID || ''
      }
    };
  });

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(authLink, httpLink)
  });

  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider user={user}>
        <ConfirmationProvider>
          <SnackbarProvider>
            <AppInternal />
          </SnackbarProvider>
        </ConfirmationProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

/** Contents of the app that can be loaded after authentication takes place */
const AppInternal: FC = () => {
  const { authenticated } = useAuth();

  const mainView: ReactNode = (
    <ProjectProvider>
      <StudyProvider>
        <DatasetProvider>
          <PermissionProvider>
            <MyRoutes />
          </PermissionProvider>
        </DatasetProvider>
      </StudyProvider>
    </ProjectProvider>
  );

  return <>{authenticated ? mainView : <UnauthenticatedView />}</>;
};

const UserViews: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  return (
    <>
      <Box>
        <NavBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      </Box>
      <Main open={drawerOpen}>
        <Box sx={{ display: 'flex' }}>
          <SideBar open={drawerOpen} drawerWidth={drawerWidth} />
          <Box sx={{ flexGrow: 1, width: '90%' }}>
            <Outlet />
          </Box>
        </Box>
      </Main>
    </>
  );
};

const UnauthenticatedView: FC = () => {
  return <MyRoutes />;
};

const MyRoutes: FC = () => {
  return (
    <Routes>
      <Route element={<AdminGuard />}>
        <Route element={<UserViews />}>
          <Route path={'/'} element={<HomePage />} />
          <Route path={'/project/new'} element={<NewProject />} />
          <Route path={'/project/controls'} element={<ProjectControl />} />
          <Route path={'/project/permissions'} element={<ProjectUserPermissions />} />
          <Route path={'/study/new'} element={<NewStudy />} />
          <Route path={'/study/controls'} element={<StudyControl />} />
          <Route path={'/study/permissions'} element={<StudyUserPermissions />} />
          <Route path={'/study/entries'} element={<EntryControls />} />
          <Route path={'/study/tags'} element={<TagView />} />
          <Route path={'/study/training'} element={<TagTrainingView />} />
          <Route path={'/study/downloads'} element={<StudyDownloads />} />
          <Route path={'/successpage'} element={<SuccessPage />} />
          <Route path={'/dataset/controls'} element={<DatasetControls />} />
          <Route path={'/dataset/projectaccess'} element={<ProjectAccess />} />
          <Route path={'/dataset/downloads'} element={<DatasetDownloads />} />
          <Route path={'/contribute/landing'} element={<ContributeLanding />} />
          <Route path={'/contribute/tagging'} element={<TaggingInterface />} />
        </Route>
        <Route path={'/admin/*'} element={<AdminLanding />} />
      </Route>
    </Routes>
  );
};

export default App;
