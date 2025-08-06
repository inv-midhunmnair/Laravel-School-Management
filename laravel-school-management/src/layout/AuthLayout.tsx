import type { ReactNode } from "react";
import { Container, Paper } from "@mui/material";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 10,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
      </Paper>
    </Container>
  );
};

export default AuthLayout;
