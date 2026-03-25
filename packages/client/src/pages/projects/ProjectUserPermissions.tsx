import { Switch, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { useProject } from '../../context/Project.context';
import { ProjectPermissionModel, Project } from '../../graphql/graphql';
import { useGetProjectPermissionsQuery } from '../../graphql/permission/permission';
import { useAuth } from '../../context/Auth.context';
import { useGrantProjectPermissionsMutation } from '../../graphql/permission/permission';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../context/Snackbar.context';
import { User } from '@firebase/auth';

export const ProjectUserPermissions: React.FC = () => {
  const { project } = useProject();
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h3">{t('menu.userPermissions')}</Typography>
      {project && <UserPermissionTable project={project} />}
    </>
  );
};

interface EditAdminSwitchProps {
  permission: ProjectPermissionModel;
  currentUser: User;
  project: Project;
  refetch: () => void;
}

const EditAdminSwitch: React.FC<EditAdminSwitchProps> = (props) => {
  const [grantProjectPermissions, grantProjectPermissionsResults] = useGrantProjectPermissionsMutation();
  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    grantProjectPermissions({
      variables: {
        project: props.project._id,
        user: props.permission.user.uid,
        isAdmin: event.target.checked
      }
    });
  };

  useEffect(() => {
    if (grantProjectPermissionsResults.data) {
      props.refetch();
    } else if (grantProjectPermissionsResults.error) {
      pushSnackbarMessage(t('errors.projectAdminUpdate'), 'error');
      console.error(grantProjectPermissionsResults.error);
    }
  }, [grantProjectPermissionsResults]);

  return (
    <Switch
      checked={props.permission.isProjectAdmin}
      onChange={handleChange}
      disabled={!props.permission.editable || props.permission.user.uid === props.currentUser.uid}
    />
  );
};

const UserPermissionTable: React.FC<{ project: Project }> = ({ project }) => {
  const { data, refetch, error } = useGetProjectPermissionsQuery({
    variables: {
      project: project._id
    }
  });

  const [rows, setRows] = useState<ProjectPermissionModel[]>([]);
  const { user } = useAuth();
  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();

  useEffect(() => {
    if (data?.getProjectPermissions) {
      setRows(data.getProjectPermissions);
    } else if (error) {
      pushSnackbarMessage(t('errors.projectAdminUpdate'), 'error');
      console.error(error);
    }
  }, [data, error]);

  const columns: GridColDef[] = [
    /* For now, only email is populated, this will change in the future
    {
      field: 'name',
      headerName: 'Name',
      valueGetter: (params) => params.row.user.fullname,
      flex: 1.25,
      editable: false,
    },
    {
      field: 'username',
      headerName: 'Username',
      valueGetter: (params) => params.row.user.username,
      flex: 1.75,
      editable: false
    },
    */
    {
      field: 'email',
      headerName: t('common.email'),
      valueGetter: (_value, row) => row.user.email,
      flex: 1.75,
      editable: false
    },
    {
      field: 'projectAdmin',
      type: 'boolean',
      headerName: t('components.projectUserPermissions.projectAdmin'),
      valueGetter: (_value, row) => row.hasRole,
      renderCell: (params: GridRenderCellParams) => {
        return <EditAdminSwitch permission={params.row} currentUser={user!} project={project} refetch={refetch} />;
      },
      editable: false,
      flex: 1
    }
  ];

  return (
    <DataGrid
      getRowHeight={() => 'auto'}
      rows={rows}
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
      disableRowSelectionOnClick
    />
  );
};
