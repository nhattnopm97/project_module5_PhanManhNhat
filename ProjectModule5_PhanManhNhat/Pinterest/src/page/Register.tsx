import React, { useEffect, useState } from "react";
import "../css/register.css";
import PinterestIcon from "@mui/icons-material/Pinterest";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface FormValue {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
  role: number;
  createdate: string;
  birthday: string;
}

function Register() {
  const navigate = useNavigate();
  const [showPsw, setShowPsw] = useState(false);
  const [notifyErr, setNotifyErr] = useState<{ [key: string]: string }>({});
  const [canSubmit, setCanSubmit] = useState<boolean>(true);
  const [rgOk, setRgOk] = useState<string>("");
  const [rgNOK, setRgNOK] = useState<string>("");
  const initialValue: FormValue = {
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: 5,
    createdate: "",
    birthday: "",
  };
  const [formValue, setFormValue] = useState<FormValue>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCanSubmit(false);
    const { name, value } = event.target;
    setFormValue({ ...formValue, [name]: value });
  };

  useEffect(() => {
    if (canSubmit === true) return;
    let notify: { [key: string]: string } = {};
    let flag = true;
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let now = new Date();
    formValue.createdate =
      now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    if (formValue.email === "") {
      notify.email = "Vui lòng nhập email.";
      flag = false;
    } else if (!regex.test(formValue.email)) {
      notify.email = "Email không đúng định dạng.";
      flag = false;
    }
    if (formValue.name === "") {
      notify.name = "Vui lòng nhập tên.";
      flag = false;
    } else if (formValue.name.length < 5) {
      notify.name = "Tên tối thiểu là 5 ký tự.";
      flag = false;
    } else if (formValue.name.length > 30) {
      notify.name = "Tên quá dài, tối đa là 30 ký tự";
      flag = false;
    } else if (formValue.name.includes(" ")) {
      notify.name = "Tên không được chứa khoảng trắng";
    }
    if (formValue.password === "") {
      notify.password = "Vui lòng tạo mật khẩu";
      flag = false;
    } else if (
      formValue.password.length < 6 ||
      formValue.password.length > 18
    ) {
      notify.password = "Độ dài chỉ từ 6 đến 18 ký tự";
      flag = false;
    }
    if (formValue.repeatPassword !== formValue.password) {
      notify.repeatPassword = "Lặp lại mật khẩu không đúng";
      flag = false;
    }
    if (formValue.birthday === "") {
      notify.birthday = "Vui lòng nhập ngày sinh";
      flag = false;
    }
    if (flag === false) {
      setNotifyErr(notify);
    } else {
      setNotifyErr({});
    }
    setCanSubmit(flag);
  }, [formValue]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let notify: { [key: string]: string } = {};
    let flag = true;
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let now = new Date();
    formValue.createdate =
      now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    if (formValue.email === "") {
      notify.email = "Vui lòng nhập email.";
      flag = false;
    } else if (!regex.test(formValue.email)) {
      notify.email = "Email không đúng định dạng.";
      flag = false;
    }
    if (formValue.name === "") {
      notify.name = "Vui lòng nhập tên.";
      flag = false;
    } else if (formValue.name.length < 5) {
      notify.name = "Tên tối thiểu là 5 ký tự.";
      flag = false;
    } else if (formValue.name.length > 30) {
      notify.name = "Tên quá dài, tối đa là 30 ký tự";
      flag = false;
    } else if (formValue.name.includes(" ")) {
      notify.name = "Tên không được chứa khoảng trắng";
    }
    if (formValue.password === "") {
      notify.password = "Vui lòng tạo mật khẩu";
      flag = false;
    } else if (
      formValue.password.length < 6 ||
      formValue.password.length > 18
    ) {
      notify.password = "Độ dài chỉ trong khoảng 6 đến 18 ký tự";
      flag = false;
    }
    if (formValue.repeatPassword !== formValue.password) {
      notify.repeatPassword = "Lặp lại mật khẩu không đúng";
      flag = false;
    }
    if (formValue.birthday === "") {
      notify.birthday = "Vui lòng nhập ngày sinh";
      flag = false;
    }

    if (!flag) {
      setNotifyErr(notify);
      setCanSubmit(flag);
    }
    setNotifyErr({});
    if (canSubmit === false) return;

    try {
      console.log(formValue);
      const res = await axios.post(
        "http://localhost:3333/users/register",
        formValue
      );
      console.log(res);
      setNotifyErr({});
      setRgOk("Đăng ký thành công!");
      setRgNOK("");
      window.scrollTo(0, 0);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data);
        let notifyErr: { [key: string]: string } = {};
        notifyErr.email = err.response?.data.message;
        setRgNOK(err.response?.data.message);
        window.scrollTo(0, 0);
      } else {
        console.log("Error occurred during registration");
      }
    }
  };

  return (
    <div className="signupWrapper">
      <div className="formWrapper">
        <div className="iconRegisterWrapper">
          <PinterestIcon
            style={{ color: "red", fontSize: "32px", cursor: "pointer" }}
          />
          {/* <CloseIcon className="closeIconRegister" /> */}
        </div>
        <div className="titleRegister">
          <h2>Chào mừng tới Pinterest</h2>
          <h2 className="flex justify-center items-center font-bold">
            Đăng ký
          </h2>
          <h2 style={{ color: "green" }}>{rgOk}</h2>
          <h2 style={{ color: "red" }}>{rgNOK}</h2>
          <span>Tìm và thử ý tưởng mới</span>
        </div>
        <form action="POST" className="form" onSubmit={handleSubmit}>
          <div className="email">
            <label>Email</label>
            <p className="notifyRegister">{notifyErr.email}</p>
            <div className="wrapperInput">
              <input
                type="text"
                name="email"
                onChange={handleChange}
                placeholder="Email"
                value={formValue.email}
              />
            </div>
          </div>
          <div>
            <label>Tên</label>
            <p className="notifyRegister">{notifyErr.name}</p>
            <div className="wrapperInput">
              <input
                value={formValue.name}
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="Tên của bạn"
              />
            </div>
          </div>
          <div>
            <label>Mật khẩu</label>
            <p className="notifyRegister">{notifyErr.password}</p>
            <div className="wrapperInput psw">
              <input
                value={formValue.password}
                onChange={handleChange}
                type={showPsw ? "text" : "password"}
                name="password"
                placeholder="Tạo mật khẩu mới"
              />
              {showPsw ? (
                <RemoveRedEyeIcon
                  className="password"
                  onClick={() => setShowPsw(false)}
                ></RemoveRedEyeIcon>
              ) : (
                <VisibilityOffIcon
                  className="password"
                  onClick={() => setShowPsw(true)}
                ></VisibilityOffIcon>
              )}
            </div>
          </div>
          <div>
            <label>Nhập lại mật khẩu</label>
            <p className="notifyRegister">{notifyErr.repeatPassword}</p>
            <div className="wrapperInput psw">
              <input
                value={formValue.repeatPassword}
                onChange={handleChange}
                type={showPsw ? "text" : "password"}
                name="repeatPassword"
                placeholder="Nhập lại mật khẩu"
              />
              {showPsw ? (
                <RemoveRedEyeIcon
                  className="password"
                  onClick={() => setShowPsw(false)}
                />
              ) : (
                <VisibilityOffIcon
                  className="password"
                  onClick={() => setShowPsw(true)}
                />
              )}
            </div>
          </div>
          <div>
            <label>Ngày sinh</label>
            <p className="notifyRegister">{notifyErr.birthday}</p>
            <div className="wrapperInput psw">
              <input
                type="date"
                name="birthday"
                onChange={handleChange}
                value={formValue.birthday}
              />
            </div>
          </div>
          <button className="submitButton  bg-red-500" type="submit">
            Tiếp tục
          </button>
        </form>
        <div>
          Đã có tài khoản?{" "}
          <span>
            <Link to="/login">
              <span className="font-bold">Đăng nhập</span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
