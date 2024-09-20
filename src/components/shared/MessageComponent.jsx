import { Box, Typography } from "@mui/material";
import moment from "moment";
import React, { memo } from "react";
import { userColor } from "../../constants/color";
import { fileFormat } from "../../lib/features";
import RenderAttachement from "./RenderAttachement";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();
  return (
    <motion.div
      initial={{ opacity: 0, x:"-100%" }}
      whileInView={{ opacity: 1, x:0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "wheat",
        borderRadius: "9px",
        padding: "0.5rem",
      }}
    >
      {!sameSender && (
        <Typography
          color={userColor}
          fontWeight={"600"}
          variant="caption"
          padding={"0.1rem"}
        >
          {sender?.name}
        </Typography>
      )}
      {content && (
        <Typography
          variant="body1"
          sx={{
            color: "black",
            width: "fit-content",
          }}
        >
          {content}
        </Typography>
      )}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const fileType = fileFormat(url);
          return (
            <Box key={index}>
              <a href={url} target="_blank" download style={{ color: "black" }}>
                {/* <RenderAttachement file={fileType} url={url} /> */}
                {RenderAttachement({ file: fileType, url })}
              </a>
            </Box>
          );
        })}

      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
