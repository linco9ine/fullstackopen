import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Alert } from "@mui/material";

const Notification = () => {
  const msg = useSelector((state) => state.notification.msg);
  const whatIsIt = useSelector((state) => state.notification.whatIsIt);
  let status = "error";

  if (!msg) return null;

  if (whatIsIt === "message") {
    status = "success";
  }

  return <Alert severity={status}>{msg}</Alert>;
};

export default Notification;
