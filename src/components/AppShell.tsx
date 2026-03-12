"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type MouseEvent } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useAuth } from "@/components/AuthProvider";

const drawerWidth = 210;
const drawerCollapsed = 72;

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardOutlinedIcon },
  { label: "Products", href: "/products", icon: Inventory2OutlinedIcon },
  { label: "Orders", href: "/orders", icon: ReceiptLongOutlinedIcon },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleProfileOpen = (event: MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const activeDrawerWidth = sidebarOpen ? drawerWidth : drawerCollapsed;

  const navItemsWithState = useMemo(
    () => navItems.map((item) => ({ ...item, active: pathname === item.href })),
    [pathname],
  );

  const drawer = (
    <Box
      sx={{
        width: activeDrawerWidth,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "width 0.25s ease",
        overflowX: "hidden",
      }}
    >
      <Toolbar>
        <Stack
          direction={sidebarOpen ? "row" : "column"}
          alignItems="center"
          spacing={sidebarOpen ? 1 : 0.5}
          sx={{ width: "100%" }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: "primary.main",
              backgroundImage:
                "linear-gradient(135deg, rgba(20, 184, 166, 0.95), rgba(56, 189, 248, 0.85))",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            OA
          </Box>
          {sidebarOpen ? (
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ whiteSpace: "nowrap" }}
            >
              Ops Atlas
            </Typography>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ lineHeight: 1.1 }}
              >
                Ops
              </Typography>
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ lineHeight: 1.1 }}
              >
                Atlas
              </Typography>
            </Box>
          )}
        </Stack>
      </Toolbar>
      <Divider />
      <List>
        {navItemsWithState.map((item) => {
          const Icon = item.icon;
          return (
            <Tooltip
              key={item.href}
              title={sidebarOpen ? "" : item.label}
              placement="right"
              disableHoverListener={sidebarOpen}
            >
              <ListItemButton
                component={Link}
                href={item.href}
                selected={item.active}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    bgcolor: "rgba(15, 118, 110, 0.12)",
                    color: "primary.main",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "auto",
                    mr: sidebarOpen ? 1.5 : 0,
                    color: "inherit",
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    opacity: sidebarOpen ? 1 : 0,
                    transition: "opacity 0.2s ease",
                  }}
                />
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
      <Box sx={{ px: 2, mt: "auto", pb: 2 }}>
        <Divider sx={{ mb: 2 }} />
        {sidebarOpen ? (
          <Button variant="outlined" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Tooltip title="Logout" placement="right">
            <IconButton
              onClick={handleLogout}
              sx={{
                width: "100%",
                borderRadius: 2,
                border: "1px solid rgba(148, 163, 184, 0.5)",
              }}
            >
              <LogoutOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background:
            "linear-gradient(135deg, rgba(12, 18, 32, 0.98), rgba(30, 41, 59, 0.94))",
          boxShadow: "0 22px 50px rgba(15, 23, 42, 0.25)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            px: { xs: 1, sm: 2 },
            minHeight: { xs: 64, sm: 68 },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: -0.5 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setSidebarOpen((prev) => !prev)}
              sx={{
                display: { xs: "none", md: "inline-flex" },
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  backgroundImage:
                    "linear-gradient(135deg, rgba(20, 184, 166, 0.95), rgba(56, 189, 248, 0.85))",
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                }}
              >
                OA
              </Box>
              <Stack spacing={0.2}>
                <Typography variant="h6" fontWeight={700}>
                  Ops Atlas
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(226,232,240,0.7)", letterSpacing: "0.08em" }}
                >
                  REALTIME COMMAND
                </Typography>
              </Stack>
            </Stack>
            <Box
              sx={{
                display: { xs: "none", md: "inline-flex" },
                alignItems: "center",
                gap: 1,
                ml: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.2)",
                bgcolor: "rgba(20, 184, 166, 0.18)",
                color: "#e2e8f0",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                  boxShadow: "0 0 8px rgba(34, 197, 94, 0.8)",
                }}
              />
              LIVE SYSTEMS
            </Box>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color="inherit"
                size="small"
              >
                {item.label}
              </Button>
            ))}
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography
              variant="body2"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {user?.name ?? "User"}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleProfileOpen}
              sx={{
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                bgcolor: "rgba(255,255,255,0.06)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
              }}
            >
              <AccountCircleOutlinedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleProfileClose();
            router.push("/profile");
          }}
        >
          <ListItemIcon>
            <PersonOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileClose();
            handleLogout();
          }}
        >
          <ListItemIcon>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: activeDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: activeDrawerWidth,
            boxSizing: "border-box",
            transition: "width 0.25s ease",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { md: `${activeDrawerWidth}px` },
          transition: "margin-left 0.25s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
