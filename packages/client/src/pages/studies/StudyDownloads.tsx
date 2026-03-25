import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { StudyDownloadRequest, DownloadStatus } from '../../graphql/graphql';
import { useStudy } from '../../context/Study.context';
import { useGetStudyDownloadsLazyQuery } from '../../graphql/study/study';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import { Download, HourglassTop, DownloadDone } from '@mui/icons-material';

export const StudyDownloads: React.FC = () => {
  const [studyDownloadRequests, setStudyDownloadRequest] = useState<StudyDownloadRequest[]>([]);
  const { study } = useStudy();
  const { t } = useTranslation();

  const [getDownloadsQuery, getDownloadsResults] = useGetStudyDownloadsLazyQuery();

  useEffect(() => {
    if (!study) {
      setStudyDownloadRequest([]);
      return;
    }

    getDownloadsQuery({
      variables: {
        study: study._id
      }
    });
  }, [study]);

  useEffect(() => {
    if (getDownloadsResults.data) {
      setStudyDownloadRequest(getDownloadsResults.data.getStudyDownloads);
    }
  }, [getDownloadsResults.data]);

  const columns: GridColDef[] = [
    {
      field: 'studyName',
      headerName: t('common.study'),
      width: 200,
      valueGetter: (_value, row) => row.study.name
    },
    {
      field: 'date',
      width: 200,
      headerName: t('components.datasetDownload.requestDate'),
      valueGetter: (_value, row) => t('common.dateFormat', { date: Date.parse(row.date) })
    },
    {
      field: 'status',
      width: 200,
      headerName: t('common.status'),
      renderCell: (params) => params.value && <StatusView status={params.value} />
    },
    {
      field: 'entryZip',
      width: 200,
      headerName: t('components.datasetDownload.entryDownload'),
      renderCell: (params) =>
        params.value &&
        params.row.status == DownloadStatus.Ready && (
          <IconButton href={params.value}>
            <Download />
          </IconButton>
        )
    },
    {
      field: 'userCSV',
      width: 200,
      headerName: t('components.studyDownload.downloadUsers'),
      renderCell: (params) =>
        params.value &&
        params.row.status == DownloadStatus.Ready && (
          <IconButton href={params.value}>
            <Download />
          </IconButton>
        )
    },
    {
      field: 'tagCSV',
      width: 200,
      headerName: t('components.studyDownload.csv'),
      renderCell: (params) =>
        params.value &&
        params.row.status == DownloadStatus.Ready && (
          <IconButton href={params.value}>
            <Download />
          </IconButton>
        )
    },
    {
      field: 'taggedEntries',
      width: 200,
      headerName: t('components.studyDownload.taggedEntries'),
      renderCell: (params) =>
        params.value &&
        params.row.status == DownloadStatus.Ready && (
          <IconButton href={params.value}>
            <Download />
          </IconButton>
        )
    }
  ];

  return <DataGrid rows={studyDownloadRequests} columns={columns} getRowId={(row) => row._id} />;
};

interface StatusViewProps {
  status: DownloadStatus;
}

const StatusView: React.FC<StatusViewProps> = ({ status }) => {
  switch (status) {
    case DownloadStatus.Ready:
      return <DownloadDone />;
    case DownloadStatus.InProgress:
      return <HourglassTop />;
  }
};
