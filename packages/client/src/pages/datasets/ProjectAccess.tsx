import { Typography, Switch } from '@mui/material';
import { useProject } from '../../context/Project.context';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetDatasetProjectPermissionsLazyQuery } from '../../graphql/permission/permission';
import { useEffect, useState } from 'react';
import { DatasetProjectPermission, Project } from '../../graphql/graphql';
import { useGrantProjectDatasetAccessMutation } from '../../graphql/permission/permission';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../context/Snackbar.context';

export const ProjectAccess: React.FC = () => {
  const { project } = useProject();
  const [getDatasetProjectPermissions, datasetProjectPermissionResults] = useGetDatasetProjectPermissionsLazyQuery();
  const [projectAccess, setProjectAccess] = useState<DatasetProjectPermission[]>([]);
  const [grantProjectDatasetAccess, grantProjectDatasetAccessResults] = useGrantProjectDatasetAccessMutation();
  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();

  // For querying for the permissions
  useEffect(() => {
    if (project) {
      getDatasetProjectPermissions({ variables: { project: project._id } });
    }
  }, [project]);

  // For setting the permissions
  useEffect(() => {
    if (datasetProjectPermissionResults.data) {
      setProjectAccess(datasetProjectPermissionResults.data.getDatasetProjectPermissions);
    } else if (datasetProjectPermissionResults.error) {
      pushSnackbarMessage(t('errors.datasetPermissionUpdate'), 'error');
      console.error(datasetProjectPermissionResults.error);
    }
  }, [datasetProjectPermissionResults]);

  // For updating the permissions
  useEffect(() => {
    if (grantProjectDatasetAccessResults.data) {
      datasetProjectPermissionResults.refetch();
    }
  }, [grantProjectDatasetAccessResults]);

  const handleAccessChange = (dataset: string, project: string, hasAccess: boolean) => {
    grantProjectDatasetAccess({ variables: { dataset, project, hasAccess } });
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('components.projectAccess.datasetName'),
      width: 200,
      valueGetter: (_value, row) => row.dataset.name
    },
    {
      field: 'description',
      headerName: t('common.description'),
      width: 200,
      valueGetter: (_value, row) => row.dataset.description
    },
    {
      field: 'access',
      headerName: t('components.projectAccess.projectHasAccess'),
      width: 200,
      renderCell: (params) => (
        <DatasetAccess permission={params.row} project={project!} changeAccess={handleAccessChange} />
      )
    }
  ];

  return (
    <>
      {project ? (
        <>
          <Typography variant="h5">
            {t('components.projectAccess.accessFor')}"{project.name}"
          </Typography>
          <DataGrid columns={columns} rows={projectAccess} getRowId={(row) => row.dataset._id} />
        </>
      ) : (
        <Typography variant="h5">{t('components.projectAccess.selectProject')}</Typography>
      )}
    </>
  );
};

interface DatasetAccessProps {
  permission: DatasetProjectPermission;
  project: Project;
  changeAccess: (dataset: string, project: string, access: boolean) => void;
}

const DatasetAccess: React.FC<DatasetAccessProps> = ({ permission, changeAccess, project }) => {
  return (
    <Switch
      checked={permission.projectHasAccess}
      onChange={(event) => changeAccess(permission.dataset._id, project._id, event.target.checked)}
    />
  );
};
