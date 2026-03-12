"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MenuIcon from "@mui/icons-material/Menu";
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

  const handleLogout = () => {
    logout();
    router.replace("/login");
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
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            CH
          </Box>
          {sidebarOpen ? (
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ whiteSpace: "nowrap" }}
            >
              Control Hub
            </Typography>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ lineHeight: 1.1 }}
              >
                Control
              </Typography>
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ lineHeight: 1.1 }}
              >
                Hub
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
            <Button variant="outlined" fullWidth onClick={handleLogout}>
              Logout
            </Button>
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
            "linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.94))",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => setSidebarOpen((prev) => !prev)}
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>
              Control Hub
            </Typography>
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
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                px: 2,
                "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

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
