import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/Reducer/misc";
import UserItem from "../shared/UserItem";
import toast from "react-hot-toast";
const NewGroup = () => {
  const dispatch = useDispatch();
  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const { isNewGroup } = useSelector((state) => state.misc);
  const groupName = useInputValidation("");

  let isLoadingSendFriendRequest = false;
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);
  const [selectedMembers, setSelectedMembers] = useState([]);
  console.log(data);
  const errors = [{ isError, error }];
  useErrors(errors);
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2)
      return toast.error("Please select at least 3 members");
    // Creating group
    newGroup("Creating new Group ....", {
      name: groupName.value,
      members: selectedMembers,
    });
    closeHandler();
  };
  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"1rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />
        <Typography variant="body1">Members</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                isAdded={selectedMembers.includes(user._id)}
                handler={selectMemberHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"flex-end"} spacing={"1rem"}>
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
