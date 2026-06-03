import { Box, Grid, Typography } from '@mui/material';
import { VideoViewProps, VideoEntryView } from './VideoView.component';
import { AssignTagMutation } from '../graphql/tag/tag';
import { useTranslation } from 'react-i18next';

export interface EntryViewProps extends Omit<VideoViewProps, 'url'> {
  entry: NonNullable<AssignTagMutation['assignTag']>['entry'];
  showCue?: boolean;
}

export const EntryView: React.FC<EntryViewProps> = (props) => {
  if (props.showCue) {
    return <ShowWithCue {...props} />
  }
  return getEntryView(props);
};

const getEntryView = (props: EntryViewProps) => {
  if (props.entry.contentType.startsWith('video/')) {
    return <VideoEntryView {...props} url={props.entry.signedUrl} />;
  }
  if (props.entry.contentType.startsWith('image/')) {
    return <ImageEntryView {...props} />;
  }
  console.error('Unknown entry type');
  return <p>Placeholder</p>;
};

const ImageEntryView: React.FC<EntryViewProps> = (props) => {
  return (
    <Box sx={{ maxWidth: props.width }}>
      <img src={props.entry.signedUrl} width="100%" />
    </Box>
  );
};

const ShowWithCue: React.FC<EntryViewProps> = (props) => {
  const { t } = useTranslation();
  const originalCue = props.entry.signlabRecording?.tag.entry;

  return (
    <Grid container>
      <Grid item xs={2}>
        <Typography variant='body1'>{t('components.tagView.originalCue')}</Typography>
      </Grid>
      <Grid item xs={10}>
        {originalCue ? getEntryView({...props, entry: originalCue }) : <></>}
      </Grid>
      <Grid item xs={2}>
        <Typography variant='body1'>{t('components.tagView.responseToCue')}</Typography>
      </Grid>
      <Grid item xs={10}>
        {getEntryView({...props})}
      </Grid>
    </Grid>
  );
}
