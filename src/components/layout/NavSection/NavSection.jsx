import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, List, Collapse, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(2),
    color: theme.palette.text.secondary,
    borderRadius: '8px',
    marginBottom: theme.spacing(1),
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest
    }),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
      color: theme.palette.primary.main,
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main
      }
    }
  })
);

const ListItemIconStyle = styled(ListItemIcon)(({ theme }) => ({
  width: 28,
  height: 28,
  color: theme.palette.text.secondary,
  transition: theme.transitions.create('color', {
    duration: theme.transitions.duration.shortest
  })
}));

function NavItem({ item, active }) {
  const theme = useTheme();
  const isActiveRoot = active(item.path);
  const { title, path, icon, info, children } = item;
  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const activeRootStyle = {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.light, 0.2),
    fontWeight: 'bold',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    }
  };

  const activeSubStyle = {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    }
  };

  if (children) {
    return (
      <>
        <ListItemStyle onClick={handleOpen} sx={isActiveRoot ? activeRootStyle : {}}>
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          <ListItemText primary={title} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {open ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
          </Box>
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((subItem) => {
              const isActiveSub = active(subItem.path);

              return (
                <ListItemStyle
                  key={subItem.title}
                  component={RouterLink}
                  to={subItem.path}
                  sx={{
                    paddingLeft: theme.spacing(5),
                    ...(isActiveSub && activeSubStyle)
                  }}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 6,
                        height: 6,
                        display: 'flex',
                        borderRadius: '50%',
                        bgcolor: isActiveSub ? 'primary.main' : 'text.disabled',
                        transition: theme.transitions.create('background-color', {
                          duration: theme.transitions.duration.shortest
                        })
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={subItem.title} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle component={RouterLink} to={path} sx={isActiveRoot ? activeRootStyle : {}}>
      <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
      <ListItemText disableTypography primary={title} />
      {info && info}
    </ListItemStyle>
  );
}

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  active: PropTypes.func.isRequired
};

export default function NavSection({ navConfig, isOpenSidebarDesktop, ...other }) {
  const { pathname } = useLocation();

  const match = (path) => path === pathname || `${path}/form` === pathname;

  return (
    <Box {...other}>
      <List disablePadding>
        {navConfig.map((item) => (
          <NavItem key={item.title} item={item} active={match} />
        ))}
      </List>
    </Box>
  );
}

NavSection.propTypes = {
  navConfig: PropTypes.array.isRequired,
  isOpenSidebarDesktop: PropTypes.bool // Asegúrate de que esto esté definido si se utiliza
};
