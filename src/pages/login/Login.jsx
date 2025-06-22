
import "./Login.scss"
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../store/auth";
import CustomizeInput from "../../utils/Input/CustomizeInput";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    isAuthenticated && navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <div className="py-24 lg:py-10 pb-10">
    <div className="contain">
      <div className="w-full lg:w-[75%] flex items-center  flex-col sm:flex-row justify-center py-10 mx-auto px-60">
        <form onSubmit={(e) => handleSubmit(e)} className="flex items-start flex-col sm:flex-row justify-start gap-8 w-full">
          <div className="flex items-start justify-start flex-col gap-4 w-full sm:flex-1">
            <h1 className="text-2xl text-darkColor font-semibold">Sign In</h1>
            <CustomizeInput
                showLabel={false}
                htmlFor="email"
                label="Email address"
                labelClassName="text-sm font-medium text-darkColor"
                type="text"
                name="email"
                value={email}
                onChange={handleChange}
                id="email"
                placeholder="Email address"
                className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
              />
               <CustomizeInput
                showLabel={false}
                htmlFor="password"
                label="Enter your password"
                labelClassName="text-sm font-medium text-darkColor"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                id="password"
                placeholder="Enter your password"
                className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
              />
            <button
              type="submit"
              className="w-full bg-primary/80 hover:bg-primary cursor-pointer outline-none text-white rounded py-3 transition-all duration-300 mt-4 hidden sm:block"
            >
              <p className="flex items-center justify-center gap-2">Login</p>
            </button>

          <div className="w-full cursor-pointer outline-none text-black rounded py-3 transition-all duration-300 mt-4 hidden sm:block">
<p className="flex items-center justify-center gap-2">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
</div>
<div className="w-full cursor-pointer outline-none text-black rounded py-3 transition-all duration-300 mt-4 hidden sm:block">
<p className="flex items-center justify-center gap-2">
Forgot your password? <Link to="/resetPassword">Reset Password</Link>
      </p>
</div>
</div>
        </form>


      </div>
    </div>
  </div>
  );
};

export default Login;