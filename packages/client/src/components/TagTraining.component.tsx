import { DatasetsView } from './DatasetsView.component';
import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { useGetDatasetsByProjectLazyQuery } from '../graphql/dataset/dataset';
import { Dataset, Entry } from '../graphql/graphql';
import { GridColDef, GridColumnHeaderParams, useGridApiContext } from '@mui/x-data-grid';
import { Checkbox, Switch, Typography } from '@mui/material';
import { useProject } from '../context/Project.context';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../context/Snackbar.context';

export interface TagTrainingComponentProps {
  setTrainingSet: Dispatch<SetStateAction<string[]>>;
  setTaggingSet: Dispatch<SetStateAction<string[]>>;
  setCatchTrialSet: Dispatch<SetStateAction<string[]>>;
}

export const TagTrainingComponent: React.FC<TagTrainingComponentProps> = (props) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const { project } = useProject();
  const [getDatasetsQuery, getDatasetsResults] = useGetDatasetsByProjectLazyQuery();
  const [trainingSet, setTrainingSet] = useState<string[]>([]);
  const [taggingSet, setTaggingSet] = useState<string[]>([]);
  const [catchTrialSet, setCatchTrialSet] = useState<string[]>([]);
  const { t } = useTranslation();
  const { pushSnackbarMessage } = useSnackbar();

  useEffect(() => {
    if (project) {
      getDatasetsQuery({ variables: { project: project._id } });
    }
  }, [project]);

  const handleTrainingMassSelect = (checked: boolean, ids: Set<string>) => {
    // If checked, add all the entries for the given dataset
    if (checked) {
      const entryIDs = Array.from(ids).map((id) => id.toString());
      setTrainingSet(trainingSet.concat(entryIDs));
    }
    // If un-checked, remove all entries for the given dataset
    else {
      setTrainingSet(trainingSet.filter((id) => !ids.has(id)));
    }
  };

  const handleTaggingMassSelect = (checked: boolean, ids: Set<string>) => {
    // If checked, add all the entries for the given dataset
    if (checked) {
      const entryIDs = Array.from(ids).map((id) => id.toString());
      setTaggingSet(taggingSet.concat(entryIDs));
    }
    // If un-checked, remove all entries for the given dataset
    else {
      setTaggingSet(taggingSet.filter((id) => !ids.has(id)));
    }
  };

  const additionalColumns: GridColDef[] = [
    {
      field: 'training',
      headerName: 'Training',
      width: 200,
      sortable: false,
      valueGetter: (params) => !!trainingSet.find((id) => params.row._id == id),
      renderHeader: (_params: GridColumnHeaderParams) => {
        const grid = useGridApiContext();
        const entryIDs = new Set<string>(Array.from(grid.current.getRowModels().keys()).map((id) => id.toString()));
        return (
          <>
            <Typography variant="body2">Training</Typography>
            <Checkbox onChange={(change) => handleTrainingMassSelect(change.target.checked, entryIDs)} />
          </>
        );
      },
      renderCell: (params) => (
        <EditSetSwitch
          value={params.value}
          onLoad={(_entry) => {}}
          add={(entry) => {
            setTrainingSet([...trainingSet, entry._id]);
          }}
          remove={(entry) => {
            setTrainingSet(trainingSet.filter((entryID) => entryID != entry._id));
          }}
          entry={params.row}
        />
      )
    },
    {
      field: 'full',
      headerName: 'Available for Tagging',
      width: 250,
      sortable: false,
      valueGetter: (params) => !!taggingSet.find((id) => params.row._id == id),
      renderHeader: (_params: GridColumnHeaderParams) => {
        const grid = useGridApiContext();
        const entryIDs = new Set<string>(Array.from(grid.current.getRowModels().keys()).map((id) => id.toString()));
        return (
          <>
            <Typography variant="body2">Available for Tagging</Typography>
            <Checkbox onChange={(change) => handleTaggingMassSelect(change.target.checked, entryIDs)} />
          </>
        );
      },
      renderCell: (params) => (
        <EditSetSwitch
          value={params.value}
          onLoad={(_entry) => {}}
          add={(entry) => {
            setTaggingSet([...taggingSet, entry._id]);
          }}
          remove={(entry) => {
            setTaggingSet(taggingSet.filter((entryID) => entryID != entry._id));
          }}
          entry={params.row}
        />
      )
    },
    {
      field: 'catchTrial',
      headerName: 'Catch Trial',
      width: 200,
      renderCell: (params) => (
        <EditSetSwitch
          startingValue={catchTrialSet.includes(params.row._id)}
          onLoad={(_entry) => {}}
          add={(entry) => {
            setCatchTrialSet([...catchTrialSet, entry._id]);
          }}
          remove={(entry) => {
            setCatchTrialSet(catchTrialSet.filter((entryID) => entryID !== entry._id));
          }}
          entry={params.row}
        />
      )
    }
  ];

  useEffect(() => {
    const entries = Array.from(new Set(taggingSet));
    props.setTaggingSet(entries);
  }, [taggingSet]);

  useEffect(() => {
    const entries = Array.from(new Set(trainingSet));
    props.setTrainingSet(entries);
  }, [trainingSet]);

  useEffect(() => {
    const entries = Array.from(new Set(catchTrialSet));
    if (props.setCatchTrialSet) {
      props.setCatchTrialSet(entries);
    }
  }, [catchTrialSet]);

  useEffect(() => {
    if (getDatasetsResults.data) {
      setDatasets(getDatasetsResults.data.getDatasetsByProject);
    } else if (getDatasetsResults.error) {
      pushSnackbarMessage(t('errors.datasetsForProject'), 'error');
      console.error(getDatasetsResults.error);
    }
  }, [getDatasetsResults]);

  return (
    <>
      {!getDatasetsResults.loading && datasets.length == 0 ? (
        <Typography variant="h4">{t('components.newStudy.noDatasets')}</Typography>
      ) : (
        <DatasetsView datasets={datasets} additionalColumns={additionalColumns} />
      )}
    </>
  );
};

interface EditSwitchProps {
  value: boolean;
  add: (entry: Entry) => void;
  remove: (entry: Entry) => void;
  onLoad: (entry: Entry) => void;
  entry: Entry;
}

const EditSetSwitch: React.FC<EditSwitchProps> = (props) => {
  const [checked, setChecked] = useState(props.value);

  useEffect(() => {
    setChecked(props.value);
  }, [props.value]);

  useEffect(() => {
    props.onLoad(props.entry);
  }, [props.entry]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      props.add(props.entry);
    } else {
      props.remove(props.entry);
    }
  };

  return <Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />;
};
