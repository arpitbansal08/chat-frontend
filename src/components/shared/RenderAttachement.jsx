import { FileOpen as FileOpenIcon } from "@mui/icons-material";
import React from "react";
import { transform as transformImage } from "../../lib/features";

const RenderAttachement = ({ file, url }) => {
  switch (file) {
    case "video":
      return (
        <video
          src={url}
          preload="none"
          controls
          width={"200px"}
          height={"240px"}
        />
      );
    case "audio":
      return <audio src={url} controls />;

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="Attachement"
          width={"fit-content"}
          height={"150px"}
          style={{ objectFit: "contain" }}

        />
      );
    default:
      return <FileOpenIcon />;
  }
};

export default RenderAttachement;
