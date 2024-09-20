import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallbacks }) => {
      if (isError) {
        if (fallbacks) {
          fallbacks();
        } else {
          toast.error(error?.data?.message || fallbacks);
        }
      }
    });
  }, [errors]);
};

const useAsyncMutation = (mutationHook) => {
  const [loading, setisloading] = useState(false);
  const [data, setData] = useState(null);
  const [mutate] = mutationHook();
  const executeMutation = async (toastMessage, ...args) => {
    setisloading(true);
    const toastId = toast.loading(toastMessage || "Updating data...");
    try {
      const res = await mutate(...args);
      if (res.data) {
        setData(res.data);
        toast.success(res.data.message || "Data updated successfully", {
          id: toastId,
        });
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (e) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setisloading(false);
    }
  };
  return [executeMutation, loading, data];
};
const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};
export { useAsyncMutation, useErrors, useSocketEvents };
