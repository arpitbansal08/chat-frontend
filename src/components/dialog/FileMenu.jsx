import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import { setIsFileMenu, setUploadingLoader } from "../../redux/Reducer/misc";

const FileMenu = ({ anchorE1, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const imageRef = React.useRef(null);
  const audioRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const fileRef = React.useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();
  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
  };
  const selectImageRef = () => imageRef.current?.click();
  const selectAudioRef = () => audioRef.current?.click();
  const selectVideoRef = () => videoRef.current?.click();
  const selectFileRef = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5) {
      return toast.error("You can't upload more than 5 files at a time");
    }
    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key} ...`);
    closeFileMenu();

    try {
      // Fetching Here
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file) => {
        myForm.append("files", file);
      });
      const res = await sendAttachments(myForm);
      console.log(res);
      if (res.data) {
        toast.success(`${key} sent successfully`, { id: toastId });
      } else {
        toast.error("Failed to send attachments", {
          id: toastId,
        });
      }
    } catch (err) {
      toast.error(err, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };
  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
      <div style={{ width: "10rem" }}>
        <MenuList>
          <MenuItem onClick={selectImageRef}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Images")}
              ref={imageRef}
            />
          </MenuItem>

          <MenuItem onClick={selectAudioRef}>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mp3,audio/wav"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
              ref={audioRef}
            />
          </MenuItem>

          <MenuItem onClick={selectVideoRef}>
            <Tooltip title="Video">
              <VideoFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4,video/avi"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
              ref={videoRef}
            />
          </MenuItem>

          <MenuItem onClick={selectFileRef}>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
