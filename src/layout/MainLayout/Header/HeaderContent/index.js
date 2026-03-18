import { Box, useMediaQuery } from '@mui/material';

import ThemeMode from './ThemeMode';

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      {/* <Notification /> */}
      <ThemeMode />
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
