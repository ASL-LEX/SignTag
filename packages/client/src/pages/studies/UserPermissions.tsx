import { Switch, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useStudy } from '../../context/Study.context';
import { Study, StudyPermissionModel } from '../../graphql/graphql';
import { useAuth } from '../../context/Auth.context';
import {
  GetStudyPermissionsDocument,
  GetStudyPermissionsQuery,
  useGetStudyPermissionsQuery,
  useGrantStudyAdminMutation,
  useGrantContributorMutation,
  useGrantTrainedContributorMutation
} from '../../graphql/permission/permission';
import { useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as firebaseauth from '@firebase/auth';
import { useSnackbar } from '../../context/Snackbar.context';

export const StudyUserPermissions: React.FC = () => {
  const { study } = useStudy();
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h3">{t('menu.userPermissions')}</Typography>
      {study && <UserPermissionTable study={study} />}
    </>
  );
};

type PermissionChanges = Partial<Omit<StudyPermissionModel, 'user'>>;

interface EditSwitchProps {
  study: Study;
  permission: StudyPermissionModel;
  currentUser: firebaseauth.User;
  /** Applies changes to the cached permissions for the given user */
  updatePermission: (uid: string, changes: PermissionChanges) => void;
  refetch: () => void;
}

/**
 * Optimistically applies the change, then runs the mutation. If the mutation
 * fails the original values are restored and an error is shown.
 */
const useOptimisticToggle = (props: EditSwitchProps) => {
  const { pushSnackbarMessage } = useSnackbar();
  const { t } = useTranslation();

  return async (changes: PermissionChanges, mutate: () => Promise<unknown>) => {
    const uid = props.permission.user.uid;
    const previous = Object.fromEntries(
      Object.keys(changes).map((key) => [key, props.permission[key as keyof PermissionChanges]])
    ) as PermissionChanges;

    props.updatePermission(uid, changes);
    try {
      await mutate();
      return true;
    } catch (_error) {
      props.updatePermission(uid, previous);
      pushSnackbarMessage(t('errors.projectAdminUpdate'), 'error');
      return false;
    }
  };
};

const EditStudyAdminSwitch: React.FC<EditSwitchProps> = (props) => {
  const [grantStudyAdmin, { loading }] = useGrantStudyAdminMutation();
  const toggle = useOptimisticToggle(props);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isAdmin = event.target.checked;
    const mutate = () =>
      grantStudyAdmin({
        variables: {
          study: props.study._id,
          user: props.permission.user.uid,
          isAdmin
        }
      });

    if (isAdmin) {
      // Study admins are contributors through the role hierarchy, and that cannot be removed separately
      await toggle({ isStudyAdmin: true, isContributor: true, isContributorEditable: false }, mutate);
      return;
    }

    // Removing study admin leaves any direct contributor role in place, which the client
    // cannot see, so reload the permissions to get the correct contributor state
    const succeeded = await toggle({ isStudyAdmin: false, isContributorEditable: true }, mutate);
    if (succeeded) {
      props.refetch();
    }
  };

  return (
    <Switch
      checked={props.permission.isStudyAdmin}
      disabled={
        loading || !props.permission.isStudyAdminEditable || props.permission.user.uid === props.currentUser.uid
      }
      onChange={handleChange}
    />
  );
};

const EditContributorSwitch: React.FC<EditSwitchProps> = (props) => {
  const [grantContributor, { loading }] = useGrantContributorMutation();
  const toggle = useOptimisticToggle(props);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isContributor = event.target.checked;
    toggle({ isContributor }, () =>
      grantContributor({
        variables: {
          study: props.study._id,
          user: props.permission.user.uid,
          isContributor
        }
      })
    );
  };

  return (
    <Switch
      checked={props.permission.isContributor}
      disabled={
        loading || !props.permission.isContributorEditable || props.permission.user.uid === props.currentUser.uid
      }
      onChange={handleChange}
    />
  );
};

const EditTrainedSwitch: React.FC<EditSwitchProps> = (props) => {
  const [grantTrainedContributor, { loading }] = useGrantTrainedContributorMutation();
  const toggle = useOptimisticToggle(props);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isTrained = event.target.checked;
    toggle({ isTrained }, () =>
      grantTrainedContributor({
        variables: {
          study: props.study._id,
          user: props.permission.user.uid,
          isTrained
        }
      })
    );
  };

  return (
    <Switch
      checked={props.permission.isTrained}
      disabled={loading || !props.permission.isTrainedEditable}
      onChange={handleChange}
    />
  );
};

interface TagViewButtonProps {
  permission: StudyPermissionModel;
  study: Study;
}

const TagViewButton: React.FC<TagViewButtonProps> = (props) => {
  const { t } = useTranslation();
  const navigation = useNavigate();

  const onClick = () => {
    navigation('/study/training', {
      state: {
        user: props.permission.user,
        study: props.study
      }
    });
  };

  return (
    <Button variant="contained" onClick={onClick}>
      {t('components.userPermissions.trainingView')}
    </Button>
  );
};

const UserPermissionTable: React.FC<{ study: Study }> = ({ study }) => {
  const { user } = useAuth();

  const { data, refetch } = useGetStudyPermissionsQuery({
    variables: {
      study: study._id
    }
  });
  const apolloClient = useApolloClient();

  const permissions = data?.getStudyPermissions ?? [];
  const { t } = useTranslation();

  // Edits the cached query result directly so toggles do not need to refetch the permissions
  const updatePermission = (uid: string, changes: PermissionChanges) => {
    apolloClient.cache.updateQuery<GetStudyPermissionsQuery>(
      { query: GetStudyPermissionsDocument, variables: { study: study._id } },
      (cached) =>
        cached && {
          getStudyPermissions: cached.getStudyPermissions.map((permission) =>
            permission.user.uid === uid ? { ...permission, ...changes } : permission
          )
        }
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: t('common.email'),
      valueGetter: (_value, row) => row.user.email,
      flex: 1.75,
      editable: false
    },
    {
      field: 'studyAdmin',
      type: 'boolean',
      headerName: t('components.userPermissions.studyAdmin'),
      valueGetter: (_value, row) => row.isStudyAdmin,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <EditStudyAdminSwitch
            permission={params.row}
            currentUser={user!}
            study={study}
            updatePermission={updatePermission}
            refetch={refetch}
          />
        );
      },
      editable: false,
      flex: 1
    },
    {
      field: 'contributor',
      headerName: t('components.userPermissions.contributor'),
      valueGetter: (_value, row) => row.isContributor,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <EditContributorSwitch
            permission={params.row}
            currentUser={user!}
            study={study}
            updatePermission={updatePermission}
            refetch={refetch}
          />
        );
      },
      editable: false,
      flex: 1
    },
    {
      field: 'trained',
      headerName: t('components.userPermissions.trained'),
      valueGetter: (_value, row) => row.isTrained,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <EditTrainedSwitch
            permission={params.row}
            currentUser={user!}
            study={study}
            updatePermission={updatePermission}
            refetch={refetch}
          />
        );
      },
      editable: false,
      flex: 1
    },
    {
      field: 'traingData',
      headerName: t('components.userPermissions.trainingView'),
      renderCell: (params: GridRenderCellParams) => {
        return <TagViewButton permission={params.row} study={study} />;
      },
      flex: 1
    }
  ];
  return (
    <DataGrid
      getRowHeight={() => 'auto'}
      rows={permissions}
      columns={columns}
      getRowId={(row) => row.user.uid}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 25
          }
        }
      }}
      pageSizeOptions={[5, 10, 25]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
};
