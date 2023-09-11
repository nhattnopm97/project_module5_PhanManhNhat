// import axios from "axios";
import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../css/setting.css";
import privateAxios from "../axiosIntercepter/privateAxios";
import { UserTs } from "../interface/userTc";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  // listAll,
  StorageReference,
} from "firebase/storage";
import { storageFirebase } from "../firebase";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { User, loginRedux } from "../redux/userReducer";

function SettingProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [userLogin, setUserLogin] = useState<UserTs | null>(null);
  const [formValue, setFormValue] = useState<UserTs | null>(null);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    null
  );
  const navigate = useNavigate();

  const loadUserLogin = async () => {
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    if (userLocal !== null) {
      privateAxios
        .get("http://localhost:3333/users/detail/" + userLocal.id)
        .then((response) => {
          console.log("user", response.data);
          setUserLogin(response.data);
          setFormValue(response.data);
        })
        .catch((error) => {
          console.log(error);
          setUserLogin(null);
          alert("Error: " + error.message);
        });
    } else {
      navigate("/login");
    }
  };

  const handleInputChangetext = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    console.log(name, value);
    console.log(formValue);

    const updatedFormValue: UserTs = {
      ...(formValue || {}),
      [name]: value,
      token: formValue?.token || "",
    };

    setFormValue(updatedFormValue);
    setIsUpdating(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageUpload(event.target.files[0]);
      setIsUpdating(true);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (imageUpload === null) {
      try {
        let res = await privateAxios.put(
          "http://localhost:3333/users",
          formValue
        );
        console.log(res);
        alert("Update successfully!");
        navigate(`/profile/${userLogin?.id}`);
      } catch (error) {
        console.log(error);
      }
    } else {
      const imageRef: StorageReference = ref(
        storageFirebase,
        `avatar/${imageUpload.name}`
      );
      uploadBytes(imageRef, imageUpload).then(() => {
        getDownloadURL(imageRef).then(async (url: string) => {
          console.log(url);
          formValue && (formValue.avatar = url);
          console.log(formValue);
          try {
            let res = await privateAxios.put(
              "http://localhost:3333/users",
              formValue
            );
            console.log(res);
            let userLocalJson = localStorage.getItem("userLocal");
            let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
            let user: User = { ...res.data, message: "" };
            user.token = userLocal.token;

            dispatch(loginRedux(user));
            alert("Them anh mowi thanh cong");
            navigate(`/profile/${userLogin?.id}`);
          } catch (error) {
            console.log(error);
          }
        });
      });
    }
  };

  useEffect(() => {
    loadUserLogin();
  }, []);

  const handleReturn = () => {
    userLogin && setFormValue({ ...userLogin });
    setPreviewImage(null);
    setIsUpdating(false);
  };

  return (
    <div>
      <div className="profileContainer">
        <div className="choosenContainer">
          <div>
            <div className="itemInChoosen activeClick">
              <u>Hồ sơ công khai</u>
            </div>
          </div>
          <div>
            <div className="itemInChoosen">Thông tin cá nhân</div>
          </div>
          <div>
            <div className="itemInChoosen">Quản lý tài khoản</div>
          </div>
        </div>
        <div className="informationProfile">
          <h2>Hồ sơ công khai</h2>
          <span>Người truy cập hồ sơ của bạn sẽ thấy thông tin sau</span>
          <div className="itemInformation">
            <div>Ảnh</div>
            <div className="avatarSetting">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                <img
                  width="100px"
                  src={
                    formValue?.avatar === null
                      ? "https://e7.pngegg.com/pngimages/146/551/png-clipart-user-login-mobile-phones-password-user-miscellaneous-blue.png"
                      : formValue?.avatar
                  }
                  alt=""
                />
              </div>
              <div className="flex items-center justify-center w-40 h-24 border-none outline-none py-[10px] px-[20px] rounded-[20px] ml-3">
                <label
                  className="border-none outline-none px-8 hover:bg-slate-700 py-2 bg-[#bcbcbc] mr-5 rounded-[20px]"
                  htmlFor="avatar"
                >
                  Thay đổi
                </label>
                <input
                  id="avatar"
                  type="file"
                  name="avatar"
                  style={{ opacity: 0 }}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                <img
                  width="100px"
                  src={
                    previewImage === null
                      ? ""
                      : typeof previewImage === "string"
                      ? previewImage
                      : URL.createObjectURL(new Blob([previewImage]))
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
          {/* <div className="nameWrapper">
            <div>
              <div>Tên</div>
              <div className="inputNameWrapper">
                <input type="text" value={formValue?.ten} />
              </div>
            </div>
            <div>
              <div>Họ</div>
              <div className="inputNameWrapper">
                <input type="text" value={formValue?.ho} />
              </div>
            </div>
          </div> */}
          <div className="introduce">
            <span>Giới thiệu</span>
            <div>
              <textarea
                rows={3}
                name="description"
                maxLength={300}
                value={formValue?.description}
                onChange={handleInputChangetext}
              />
            </div>
          </div>
          <div className="websiteWrapper">
            <span>Trang web</span>
            <div>
              <input
                type="text"
                name="url"
                maxLength={300}
                value={formValue?.url}
                onChange={handleInputChangetext}
              />
            </div>
          </div>
          <div className="userNameWrapper">
            <span>Tên người dùng</span>
            <div>
              <input
                maxLength={30}
                type="text"
                name="name"
                value={formValue?.name}
                onChange={handleInputChangetext}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="settingAndSave">
        <button onClick={handleReturn}>Thiết lập lại</button>
        {isUpdating === true ? (
          <div onClick={handleSubmit} className="updating">
            Lưu
          </div>
        ) : (
          <button>Lưu</button>
        )}
      </div>
    </div>
  );
}

export default SettingProfile;
