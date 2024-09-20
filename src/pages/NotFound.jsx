import React from "react";
import { Error as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <Container maxWidth="lg" sx={{ height: "100vh" }}>
      <Stack alignItems={"center"} spacing={"1rem"} height="100%">
        <ErrorIcon sx={{ fontSize: "10rem", color: "red" }} />
        <Typography variant="h4" align="center">
          404
        </Typography>
        <Typography variant="h6" align="center">
          Page Not Found
        </Typography>
        <Link to="/">Go Back to Home</Link>
      </Stack>
    </Container>
  );
};

export default NotFound;
