import { useState, ChangeEvent, useEffect } from "react";
import "../css/createanewpin.css";
// import CloseIcon from "@mui/icons-material/Close";
// import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  // listAll,
  StorageReference,
} from "firebase/storage";

import { storageFirebase } from "../firebase";
import axios from "axios";
import privateAxios from "../axiosIntercepter/privateAxios";
import { UserTs } from "../interface/userTc";

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

// interface CreateANewPinProps {
//   // Add props here if needed
// }

interface FormValues {
  link: string;
  title: string;
  description: string;
  tag: string;
  userId: string;
}

function CreateANewPin() {
  const initialValue: FormValues = {
    link: "",
    title: "",
    description: "",
    tag: "",
    userId: "",
  };

  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formValue, setFormValue] = useState<FormValues>(initialValue);
  const [userLogin, setUserLogin] = useState<UserTs | null>(null);
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

  const loadUserLogin = async () => {
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    if (userLocal !== null && Object.keys(userLocal).length !== 0) {
      privateAxios
        .get("http://localhost:3333/users/detail/" + userLocal.id)
        .then((response) => {
          console.log("user", response.data);
          setUserLogin(response.data);
        })
        .catch((error) => {
          console.log(error);
          setUserLogin(null);
          handleClick("error", `Có lỗi xảy ra!`);
        });
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    loadUserLogin();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const result = event.target.result;
          if (typeof result === "string") {
            setPreviewImage(result);
          }
        }
      };
      reader.readAsDataURL(file);
      setImageUpload(e.target.files[0]);
    }
  };

  const uploadFile = async (): Promise<void> => {
    if (imageUpload == null) return;

    const imageRef: StorageReference = ref(
      storageFirebase,
      `image/${imageUpload.name}`
    );

    uploadBytes(imageRef, imageUpload).then(() => {
      getDownloadURL(imageRef).then((url: string) => {
        console.log(url);
        let userLocalJson = localStorage.getItem("userLocal");
        let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;

        try {
          let res = axios.post("http://localhost:3333/pin", {
            link: url,
            title: formValue.title,
            description: formValue.description,
            tag: formValue.tag,
            userId: userLocal.id,
            status: 0,
          });
          console.log(res);
          handleClick("success", `Thêm ghim mới thành công!`);
        } catch (error) {
          console.log(error);
        }
      });
    });
  };

  const handleInputChangetext = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log(formValue);
    setFormValue({ ...formValue, [name]: value });
  };

  return (
    <>
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
      <WrapperCreate>
        <ContentCreateWrapper>
          <HeaderContentWrapper>
            <div>{/* <CloseIcon /> */}</div>
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              Tải nội dung lên để tạo Ghim
            </div>
            <div>{/* <QuestionMarkIcon /> */}</div>
          </HeaderContentWrapper>
          <ContentCreate>
            <ImageWrapper>
              <img src={previewImage || ""} alt="" />
              <input
                className="hidden"
                type="file"
                name="aNewPin"
                id="upload"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleInputChange(e);
                }}
              />
            </ImageWrapper>
            <div className="mt-5">
              <div>
                <label
                  className="border-none outline-none px-8 hover:bg-slate-700 py-2 bg-[#bcbcbc] mr-5 rounded-[20px]"
                  htmlFor="upload"
                >
                  Chọn ảnh
                </label>
              </div>
              <div className="ttl">
                Tiêu đề
                <div>
                  <input
                    type="text"
                    value={formValue.title}
                    placeholder="Tiêu đề"
                    name="title"
                    onChange={handleInputChangetext}
                  />
                </div>
              </div>
              <div className="ttl">
                Mô tả
                <div>
                  <input
                    type="text"
                    value={formValue.description}
                    placeholder="Mô tả"
                    name="description"
                    onChange={handleInputChangetext}
                  />
                </div>
              </div>
              <div className="ttl">
                Tag: Mỗi thẻ tag cách nhau bởi dấu phẩy.
                <div>
                  <input
                    value={formValue.tag}
                    type="text"
                    placeholder="Tag"
                    name="tag"
                    onChange={handleInputChangetext}
                  />
                </div>
              </div>
              <button onClick={uploadFile}>Thêm Ghim mới</button>
            </div>
          </ContentCreate>
        </ContentCreateWrapper>
      </WrapperCreate>
    </>
  );
}

export default CreateANewPin;

const WrapperCreate = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  background-color: #767676;
  display: flex;
  justify-content: center;
  algin-items: center;
`;

const ContentCreateWrapper = styled.div`
  width: 70%;
  border-radius: 40px;
  overflow-y: auto;
  background-color: white;
  color: black;
`;

const HeaderContentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ContentCreate = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .ttl {
    margin-top: 20px;
  }
  .ttl div {
    border: 1px solid black;
    border-radius: 20px;
    overflow: hidden;
    width: 300px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ttl div input {
    width: 100%;
    border: none;
    outline: none;
    margin-left: 10px;
  }

  button {
    border: none;
    outline: none;
    background-color: red;
    color: white;
    margin: 10px 20px;
    border-radius: 20px;
    padding: 10px 20px;
  }
  button:hover {
    background-color: rgb(95, 3, 3);
  }
`;
const ImageWrapper = styled.div`
  margin-top: 20px;
  margin-left: 20px;
  width: 50%;
  overflow: hidden;
  display: flex;

  img {
    width: 70%;
    border-radius: 20px;
    overflow: hidden;
    margin-right: 20px;
  }
`;
