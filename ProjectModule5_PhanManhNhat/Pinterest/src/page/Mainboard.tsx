import styled from "styled-components";
import "../css/MainBoard.css";
import Pin from "../insidepage/Pin";
import { useEffect, useState } from "react";
import axios from "axios";
import { PinTc } from "../interface/pinTc";
import { CollectionTs } from "../interface/collectionTc";
import { PinInClt } from "../interface/pinInCltTc";
import { UserTs } from "../interface/userTc";
import { useNavigate } from "react-router-dom";
import privateAxios from "../axiosIntercepter/privateAxios";
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

interface MainBoardProps {
  scrollable: boolean;
  state: any; // Adjust the type according to your use case
}

const MainBoard: React.FC<MainBoardProps> = (props) => {
  const navigate = useNavigate();
  const [pin, setPin] = useState<PinTc[] | null>(null);
  const [pinStorage, setPinStorage] = useState<PinTc[]>([]);
  const [collection, setCollection] = useState<CollectionTs[]>([]);
  const [pinInClt, setPinInClt] = useState<PinInClt[]>([]);
  const [userLogin, setUserLogin] = useState<UserTs | null>(null);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [timeLoad, setTimeLoad] = useState(0);
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
  useEffect(() => {
    loadcollection();
    loadUserLogin();
  }, []);

  const loadUserLogin = async () => {
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    if (userLocal !== null && Object.keys(userLocal).length !== 0) {
      setUserLogin(userLocal);
      privateAxios
        .get("http://localhost:3333/users/detail/" + userLocal.id)
        .then((response) => {
          console.log("user", response.data);
          setUserLogin(response.data);
          loadPinInCollection(response.data.id);
        })
        .catch((error) => {
          console.log(error);
          setUserLogin(null);
          handleClick("Error", `${error.message}`);
        });
    } else {
      navigate("/login");
    }
  };

  const loadPinInCollection = async (id: number) => {
    try {
      let res = await axios.get(`http://localhost:3333/pin/user/${id}`);
      console.log("loadPinInCollection", res.data);
      setPinInClt(res.data);
    } catch (error) {
      console.log(error);
      handleClick("error", "Có lỗi xảy ra!");
    }
  };

  const loadcollection = async () => {
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    try {
      let res = await axios.get(
        "http://localhost:3333/collection/" + userLocal?.id
      );
      setCollection(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = async () => {
    try {
      let res = await axios.get(`http://localhost:3333/pin`);
      res.data.sort((a: PinTc, b: PinTc) => Math.random() - 0.5);
      setPinStorage(res.data);
      let pinLoad = res.data.slice(0, 10);
      setPin(pinLoad);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = (a: boolean) => {
    console.log(a);
    let newTimeLoad = timeLoad + 1;
    let newPinLoad = pinStorage.slice(0, timeLoad * 5);
    setPin(newPinLoad);
    setTimeLoad(newTimeLoad);
  };

  const scrollView = () => {
    const mainBoardcontainer = document.getElementById("mainBoardcontainer");
    if (mainBoardcontainer) {
      if (props.scrollable) {
        // list has fixed height
        mainBoardcontainer.addEventListener("scroll", (e) => {
          const el = e.target as HTMLElement;
          if (el.scrollTop + el.clientHeight === el.scrollHeight) {
            setLoadMore(true);
          }
        });
      } else {
        // list has auto height
        window.addEventListener("scroll", () => {
          if (
            window.scrollY + window.innerHeight + 10 >
            mainBoardcontainer.clientHeight + mainBoardcontainer.offsetTop
          ) {
            setLoadMore(true);
          }
        });
      }
    }
  };

  useEffect(() => {
    scrollView();
  }, [loadMore]);

  useEffect(() => {
    const mainBoardcontainer: HTMLElement | null =
      document.getElementById("mainBoardcontainer");

    if (
      mainBoardcontainer?.clientHeight! <= window.innerHeight &&
      mainBoardcontainer?.clientHeight
    ) {
      setLoadMore(true);
    }
  }, [props.state]);

  useEffect(() => {
    getData(loadMore);
    setLoadMore(false);
  }, [loadMore]);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Wrapper>
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
      <Container className="mainBoardcontainer pl-2" id="mainBoardcontainer">
        {pin?.map((pin, i) => (
          <>
            {pin.status === 3 ? (
              <></>
            ) : (
              <Pin
                pin={pin}
                collection={collection}
                loadcollection={loadcollection}
                loadPinInCollection={loadPinInCollection}
                key={i}
                pinInClt={pinInClt}
                userLogin={userLogin}
                handleClick={handleClick}
              />
            )}
          </>
        ))}
      </Container>
    </Wrapper>
  );
};

export default MainBoard;

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 15px;
  justify-content: center;
`;

const Container = styled.div`
  column-gap: 2px;
  margin: 0 auto;
  height: 100%;
  background-color: white;
  overflow-y: auto hidden;
`;
