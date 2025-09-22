// // "use client";

// // import React from "react";
// // import {
// //   AppBar,
// //   Toolbar,
// //   Typography,
// //   IconButton,
// //   Box,
// //   useMediaQuery,
// //   useTheme,
// // } from "@mui/material";
// // import {
// //   Menu as MenuIcon,
// //   Add as AddIcon,
// //   Code as CodeIcon,
// //   Settings as SettingsIcon,
// // } from "@mui/icons-material";

// // interface HeaderProps {
// //   onToggleSidebar: () => void;
// //   onToggleCodePreview: () => void;
// //   onNewChat: () => void;
// // }

// // export default function Header({
// //   onToggleSidebar,
// //   onToggleCodePreview,
// //   onNewChat,
// // }: HeaderProps) {
// //   const theme = useTheme();
// //   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

// //   return (
// //     <AppBar
// //       position="static"
// //       elevation={0}
// //       sx={{
// //         backgroundColor: "background.paper",
// //         borderBottom: 1,
// //         borderColor: "divider",
// //         color: "text.primary",
// //       }}
// //     >
// //       <Toolbar sx={{ minHeight: "64px !important" }}>
// //         <IconButton
// //           edge="start"
// //           onClick={onToggleSidebar}
// //           sx={{ mr: 2 }}
// //           aria-label="toggle sidebar"
// //         >
// //           <MenuIcon />
// //         </IconButton>

// //         <Typography
// //           variant="h6"
// //           component="h1"
// //           sx={{
// //             flexGrow: 1,
// //             fontWeight: 600,
// //             background: "linear-gradient(45deg, #2563eb, #7c3aed)",
// //             backgroundClip: "text",
// //             WebkitBackgroundClip: "text",
// //             WebkitTextFillColor: "transparent",
// //           }}
// //         >
// //           AI Frontend Helper
// //         </Typography>

// //         <Box sx={{ display: "flex", gap: 1 }}>
// //           <IconButton
// //             onClick={onNewChat}
// //             size="small"
// //             sx={{
// //               backgroundColor: "primary.main",
// //               color: "white",
// //               "&:hover": {
// //                 backgroundColor: "primary.dark",
// //               },
// //             }}
// //             aria-label="new chat"
// //           >
// //             <AddIcon fontSize="small" />
// //           </IconButton>

// //           {!isMobile && (
// //             <IconButton
// //               onClick={onToggleCodePreview}
// //               size="small"
// //               aria-label="toggle code preview"
// //             >
// //               <CodeIcon fontSize="small" />
// //             </IconButton>
// //           )}

// //           <IconButton size="small" aria-label="settings">
// //             <SettingsIcon fontSize="small" />
// //           </IconButton>
// //         </Box>
// //       </Toolbar>
// //     </AppBar>
// //   );
// // }

// "use client";

// import React from "react";
// import {
// AppBar,
// Toolbar,
// Typography,
// IconButton,
// Box,
// useMediaQuery,
// } from "@mui/material";
// import {
// Menu as MenuIcon,
// Add as AddIcon,
// Code as CodeIcon,
// Settings as SettingsIcon,
// } from "@mui/icons-material";

// interface HeaderProps {
// onToggleSidebar: () => void;
// onToggleCodePreview: () => void;
// onNewChat: () => void;
// }

// export default function Header({
// onToggleSidebar,
// onToggleCodePreview,
// onNewChat,
// }: HeaderProps) {
// const isMobile = useMediaQuery("(max-width:900px)");

// return (
//     <AppBar
//     position="static"
//     elevation={0}
//     sx={{
//         backgroundColor: "background.paper",
//         borderBottom: 1,
//         borderColor: "divider",
//         color: "text.primary",
//     }}
//     >
//     <Toolbar sx={{ minHeight: "64px !important" }}>
//         <IconButton
//         edge="start"
//         onClick={onToggleSidebar}
//         sx={{ mr: 2 }}
//         aria-label="toggle sidebar"
//         >
//         <MenuIcon />
//         </IconButton>

//         <Typography
//         variant="h6"
//         component="h1"
//         sx={{
//             flexGrow: 1,
//             fontWeight: 600,
//             background: "linear-gradient(45deg, #2563eb, #7c3aed)",
//             backgroundClip: "text",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//         }}
//         >
//         AI Frontend Helper
//         </Typography>

//         <Box sx={{ display: "flex", gap: 1 }}>
//         <IconButton
//             onClick={onNewChat}
//             size="small"
//             sx={{
//             backgroundColor: "primary.main",
//             color: "white",
//             "&:hover": {
//                 backgroundColor: "primary.dark",
//             },
//             }}
//             aria-label="new chat"
//         >
//             <AddIcon fontSize="small" />
//         </IconButton>

//         {!isMobile && (
//             <IconButton
//             onClick={onToggleCodePreview}
//             size="small"
//             aria-label="toggle code preview"
//             >
//             <CodeIcon fontSize="small" />
//             </IconButton>
//         )}

//         <IconButton size="small" aria-label="settings">
//             <SettingsIcon fontSize="small" />
//         </IconButton>
//         </Box>
//     </Toolbar>
//     </AppBar>
// );
// }

"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleCodePreview: () => void;
  onNewChat: () => void;
}

export default function Header({
  onToggleSidebar,
  onToggleCodePreview,
  onNewChat,
}: HeaderProps) {
  // Fixed: Use media query without theme object to avoid serialization issues
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ minHeight: "64px !important" }}>
        <IconButton
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
          aria-label="toggle sidebar"
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            background: "linear-gradient(45deg, #2563eb, #7c3aed)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI Frontend Helper
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={onNewChat}
            size="small"
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            aria-label="new chat"
          >
            <AddIcon fontSize="small" />
          </IconButton>

          {!isMobile && (
            <IconButton
              onClick={onToggleCodePreview}
              size="small"
              aria-label="toggle code preview"
            >
              <CodeIcon fontSize="small" />
            </IconButton>
          )}

          <IconButton size="small" aria-label="settings">
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
