import { AppBar, Toolbar, Typography } from '@mui/material';
import { FC, Dispatch, SetStateAction } from 'react';
import { IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';

export interface NavBarProps {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export const NavBar: FC<NavBarProps> = ({ drawerOpen, setDrawerOpen }) => {
  return (
    <AppBar>
      <Toolbar sx={{ backgroundColor: 'white' }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 4, ml: 2 }}
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          <Menu sx={{ color: 'black' }} />
        </IconButton>
        <Typography
          sx={{
            flexGrow: 1,
            textAlign: 'left',
            paddingRight: '1rem',
            color: 'black'
          }}
        >
          SignTag
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
