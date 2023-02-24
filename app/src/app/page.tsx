"use client";

import { Button } from "@mui/material";
import { Inter } from "@next/font/google";

export default function Home() {
  return (
    <main>
      <p>hello world.</p>
      <Button variant="contained" sx={{ bgcolor: "primary.main" }}>
        Text
      </Button>
    </main>
  );
}
