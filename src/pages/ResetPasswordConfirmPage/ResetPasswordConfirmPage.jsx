import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { reset_password_confirm } from "../../store/auth";
import CustomizeInput from "../../utils/Input/CustomizeInput";
const ResetPasswordConfirmPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid, token } = useParams();

  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });
  const { new_password, re_new_password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(reset_password_confirm(uid, token, new_password, re_new_password));
    setRequestSent(true);
  };

  useEffect(() => {
    requestSent && navigate("/");
  }, [requestSent, navigate]);

  return (
<div className="py-24 lg:py-10 pb-10">
<div className="contain">
  <div className="w-full lg:w-[75%] flex items-center flex-col sm:flex-row justify-center py-10 mx-auto">
    <form onSubmit={(e) => handleSubmit(e)} className="flex items-start flex-col sm:flex-row justify-start gap-8 w-full">
      <div className="flex items-start justify-start flex-col gap-4 w-full sm:flex-1">
        <h1 className="text-2xl text-darkColor font-semibold">Chnage Password</h1>
           <CustomizeInput
            showLabel={false}
            htmlFor="new_password"
            label="Enter your password"
            labelClassName="text-sm font-medium text-darkColor"
            type="text"
            name="new_password"
            value={new_password}
            onChange={handleChange}
            id="new_password"
            placeholder="Enter your new password"
            className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
          />
                <CustomizeInput
            showLabel={false}
            htmlFor="re_new_password"
            label="Confirm New Password"
            labelClassName="text-sm font-medium text-darkColor"
            type="text"
            name="re_new_password"
            value={re_new_password}
            onChange={handleChange}
            id="re_new_password"
            placeholder="Confirm New Password"
            className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
          />
        <button
          type="submit"
          className="w-full bg-primary/80 hover:bg-primary cursor-pointer outline-none text-white rounded py-3 transition-all duration-300 mt-4 hidden sm:block"
        >
          <p className="flex items-center justify-center gap-2">Reset Password</p>
        </button>


</div>
    </form>


  </div>
</div>
</div>
  );
};

export default ResetPasswordConfirmPage;
