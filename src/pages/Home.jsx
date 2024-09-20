import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { grayColor } from "../constants/color";
const Home = () => {
  return (
    <Box bgcolor={grayColor} height={"100%"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select a friend to chat
      </Typography>
    </Box>
  );
};

export default AppLayout()(Home);