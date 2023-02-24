"use client";

import {
  Box,
  createTheme,
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
} from "@mui/material";
import "./globals.css";
import Header from "./header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menus = ["menu1", "menu2"];
  const theme = createTheme({
    spacing: 8,
  });

  return (
    <html lang="ja">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <ThemeProvider theme={theme}>
          <Box
            className="app"
            sx={{
              display: "flex",
              flexDirection: "column",
              widht: "100vw",
              height: "100vh",
            }}
          >
            {/* header */}
            <Box className="header">
              <Header />
            </Box>
            {/* header 以下のコンテンツ */}
            <Box
              className="main"
              sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}
            >
              {/* sidebar */}
              <Box className="sidebar" sx={{ width: "200px", boxShadow: 5 }}>
                <List>
                  {menus.map((key, index) => (
                    <ListItem key={key}>
                      <ListItemText primary={key} />
                    </ListItem>
                  ))}
                </List>
              </Box>
              {/* content */}
              <Box className="content" sx={{ p: 2 }}>
                {children}
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
