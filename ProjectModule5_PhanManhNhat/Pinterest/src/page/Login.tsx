import { useEffect, useState } from "react";
import "../css/login.css";
import PinterestIcon from "@mui/icons-material/Pinterest";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { loginRedux } from "../redux/userReducer";
import { ToastContainer, toast } from "react-toastify";

interface FormValue {
  email: string;
  password: string;
}

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPsw, setShowPsw] = useState<boolean>(false);
  const [notifyErr, setNotifyErr] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [message, setMessage] = useState<string>("");
  const initialValue: FormValue = {
    email: "",
    password: "",
  };
  const [formValue, setFormValue] = useState<FormValue>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValue({ ...formValue, [name]: value });
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let notify: { email?: string; password?: string } = {};
    let flag = true;
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (formValue.email === "") {
      notify.email = "Vui lòng nhập email.";
      flag = false;
    } else if (!regex.test(formValue.email)) {
      notify.email = "Email không đúng định dạng.";
      flag = false;
    }

    if (formValue.password === "") {
      notify.password = "Vui lòng tạo mật khẩu";
      flag = false;
    } else if (
      formValue.password.length < 6 ||
      formValue.password.length > 18
    ) {
      notify.password = "Độ dài ký tự chỉ trong khoảng 6 đến 18 ký tự";
      flag = false;
    }

    if (!flag) {
      setNotifyErr(notify);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3333/users/login",
        formValue
      );
      setLoginSuccess(true);
      setNotifyErr({});
      dispatch(loginRedux(res.data));
      setMessage("");
      window.scrollTo(0, 0);
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setLoginSuccess(false);
        console.log(err);
        window.scrollTo(0, 0);
        setMessage(err.response?.data?.message || "");
      } else {
        console.log("aaa");
      }
    }
  };

  const a = () => {
    toast("Đăng nhập thành công", {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: "foo-bar",
    });
  };

  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  return (
    <div className="signupWrapper login">
      <ToastContainer />
      <div className="formWrapper">
        <div className="iconRegisterWrapper">
          <PinterestIcon
            style={{ color: "red", fontSize: "32px", cursor: "pointer" }}
          />
        </div>
        <div className="titleRegister">
          <h2>Chào mừng tới Pinterest</h2>
          <h2 className="font-bold flex justify-center">Đăng nhập</h2>
          {loginSuccess && (
            <h2 style={{ color: "green" }}>Đăng nhập thành công!</h2>
          )}
          {message !== "" ? <h2 className="text-red-600">{message}</h2> : <></>}
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
                />
              ) : (
                <VisibilityOffIcon
                  className="password"
                  onClick={() => setShowPsw(true)}
                />
              )}
            </div>
          </div>
          <button className="submitButton bg-red-500" type="submit">
            Tiếp tục
          </button>
        </form>
        <div>
          Chưa có tài khoản?{" "}
          <Link to="/register">
            <span className="font-bold">Đăng ký!</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
