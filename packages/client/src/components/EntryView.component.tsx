import { Box, Stack } from '@mui/material';
import { VideoViewProps, VideoEntryView } from './VideoView.component';
import { AssignTagMutation } from '../graphql/tag/tag';

export interface EntryViewProps extends Omit<VideoViewProps, 'url'> {
  entry: NonNullable<AssignTagMutation['assignTag']>['entry'];
  showCue?: boolean;
}

export const EntryView: React.FC<EntryViewProps> = (props) => {

  if (props.showCue) {
    const originalCue = props.entry.signlabRecording?.tag.entry;
    return (
      <Stack>
        {originalCue ? getEntryView({...props, entry: originalCue }) : <></>}
        {getEntryView({...props})}
      </Stack>
    );
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
