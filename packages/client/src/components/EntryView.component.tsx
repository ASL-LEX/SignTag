import { Box } from '@mui/material';
import { Entry } from '../graphql/graphql';
import { VideoViewProps, VideoEntryView } from './VideoView.component';

export interface EntryViewProps extends Omit<VideoViewProps, 'url'> {
  entry: Entry;
  showCue: boolean;
}

export const EntryView: React.FC<EntryViewProps> = (props) => {
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
