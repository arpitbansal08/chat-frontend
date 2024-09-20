import { Grid, Skeleton, Stack } from "@mui/material";
import React from "react";
import { BouncingSkeleton } from "../styles/StyledComponents";
const LayoutLoader = () => {
  return (
    <Grid container height={"100vh"} spacing={"1rem"}>
      <Grid
        item
        sm={4}
        md={3}
        sx={{ display: { xs: "none", sm: "block" } }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
      <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
        <Stack spacing={"1rem"}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={"100px"} />
          ))}
        </Stack>
      </Grid>
      <Grid
        item
        md={4}
        lg={3}
        sx={{
          display: { xs: "none", md: "block" },
        }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
    </Grid>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.5rem"}
      direction={"row"}
      padding={"0.5rem"}
      justifyContent={"center"}
    >
      <BouncingSkeleton
        variant="circular"
        height={15}
        width={15}
        sx={{ animationDelay: "0.1s" }}
      />
      <BouncingSkeleton
        variant="circular"
        height={15}
        width={15}
        sx={{ animationDelay: "0.2s" }}
      />
      <BouncingSkeleton
        variant="circular"
        height={15}
        width={15}
        sx={{ animationDelay: "0.4s" }}
      />
      <BouncingSkeleton
        variant="circular"
        height={15}
        width={15}
        sx={{ animationDelay: "0.6s" }}
      />
    </Stack>
  );
};
export { LayoutLoader, TypingLoader };
