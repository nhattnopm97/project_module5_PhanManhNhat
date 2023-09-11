import { useState } from "react";
import * as React from "react";
// import Alert from "@mui/material/Alert";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function OutlinedAlerts() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<any>("success");
  const [message, setMessage] = useState("Thành công");
  const handleClick = (a: string, b: string) => {
    setType(a);
    setMessage(b);
    setOpen(true);
  };
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <Stack className="" spacing={2} sx={{ width: "100%" }}>
      {/* <Button
          variant="outlined"
          onClick={() => handleClick("success", "oke ae")}
        >
          Open success snackbar
        </Button> */}
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </Stack>
  );
}
