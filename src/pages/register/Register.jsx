import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { signup } from "../../store/auth";
import "./Register.scss"
import "../../index.css";
import CustomizeInput from "../../utils/Input/CustomizeInput";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accountCreated, setAccountCreated] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
    phone: "",
    image: null,
    isTailor: false,
    cnic: "",
    gender: "",
  });
  const { gender, cnic, isTailor, image, phone, first_name, last_name, email, password, re_password } = formData;
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const [errors, setErrors] = useState({});

  const validatePassword = () => {
    const { first_name, last_name, password, re_password } = formData;
    let errors = {};

    // Split first_name into words and check if any word is in the password
    const firstNameParts = first_name.split(' ');
    for (let part of firstNameParts) {
      if (password.toLowerCase().includes(part.toLowerCase())) {
        errors.password = 'Password should not contain your name.';
        break;
      }
    }

    // Split last_name into words and check if any word is in the password
    const lastNameParts = last_name.split(' ');
    for (let part of lastNameParts) {
      if (password.toLowerCase().includes(part.toLowerCase())) {
        errors.password = 'Password should not contain your name.';
        break;
      }
    }

    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (password !== re_password) {
      errors.re_password = 'Passwords do not match.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePassword();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await dispatch(signup(gender, cnic, isTailor, image, phone, first_name, last_name, email, password, re_password));
        setAccountCreated(true);
        setFormSubmitted(true);
        console.log('Form submitted successfully!');
      } catch (error) {
        setBackendError("User already registered");
      }
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      setErrors({ email: "Email already in use" });
    }

  }, [isAuthenticated, navigate, error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="py-24 lg:py-10 pb-10">
      <div className="contain">
        <div className="w-full lg:w-[75%] flex items-center flex-col sm:flex-row justify-center py-10 mx-auto">
          {formSubmitted ? (  // Conditionally render success message
            <div className="text-center text-green-500">
              <h2>Form Submitted Successfully!</h2>
              <p>Thank you for registering.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-start flex-col sm:flex-row justify-start gap-8 w-full">
              <div className="flex items-start justify-start flex-col gap-4 w-full sm:flex-1">
                <h1 className="text-2xl text-darkColor font-semibold">Create an Account</h1>
                <CustomizeInput
                  showLabel={false}
                  htmlFor="first_name"
                  label="First Name"
                  labelClassName="text-sm font-medium text-darkColor"
                  type="text"
                  name="first_name"
                  value={first_name}
                  onChange={handleChange}
                  id="first_name"
                  required
                  placeholder="Please Write Your First Name"
                  className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
                />
                {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}

                <CustomizeInput
                  showLabel={false}
                  htmlFor="last_name"
                  label="Last Name"
                  labelClassName="text-sm font-medium text-darkColor"
                  type="text"
                  name="last_name"
                  value={last_name}
                  onChange={handleChange}
                  id="last_name"
                  placeholder="Please Write Your Last Name"
                  className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
                />
                {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}

                <CustomizeInput
                  showLabel={false}
                  htmlFor="email"
                  label="Email Address"
                  labelClassName="text-sm font-medium text-darkColor"
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  id="email"
                  placeholder="Email Address"
                  className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                <CustomizeInput
                  showLabel={false}
                  htmlFor="password"
                  label="Password"
                  labelClassName="text-sm font-medium text-darkColor"
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  id="password"
                  placeholder="********"
                  required
                  className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                <CustomizeInput
                  showLabel={false}
                  htmlFor="re_password"
                  label="Confirm Password"
                  labelClassName="text-sm font-medium text-darkColor"
                  type="password"
                  name="re_password"
                  value={re_password}
                  onChange={handleChange}
                  id="re_password"
                  placeholder="********"
                  required
                  className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
                />
                {errors.re_password && <p className="text-red-500 text-sm">{errors.re_password}</p>}

                <button
                  type="submit"
                  className="w-full bg-primary/80 hover:bg-primary cursor-pointer outline-none text-white rounded py-3 transition-all duration-300 mt-4 hidden sm:block"
                >
                  <p className="flex items-center justify-center gap-2">Register</p>
                </button>
              </div>
              <div className="flex items-start justify-start flex-col gap-4 w-full sm:flex-1">
                <h1 className="text-2xl text-darkColor font-semibold">I want to be a Tailor</h1>
                <div className="w-full mt-8">
                  <label className="flex items-center justify-start w-full relative gap-4">
                    <span className="text-[#5D6771] text-[15px] leading-5 font-medium flex items-center justify-center select-none">
                      Activate the Tailor account
                    </span>
                    <span className="flex items-center justify-center select-none action">
                      <input
                        type="checkbox"
                        className="appearance-none"
                        value={!isTailor}
                        onChange={handleChange}
                        name="isTailor"
                      />
                      <i className="bg-[#c5c7c9] relative w-11 h-6 rounded-xl transition-all duration-200 before:content-[''] before:absolute before:top-[2px] before:left-[2.8px] before:w-5 before:h-5 before:bg-white before:rounded-full before:shadow-newLongShadow before:transition-all before:duration-300 cursor-pointer"></i>
                    </span>
                  </label>
                </div>
                <CustomizeInput
                  showLabel={false}
                  containerClass="my-2"
                  htmlFor="phone"
                  label="Phone Number"
                  labelClassName="text-sm font-medium text-darkColor"
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  id="phone"
                  placeholder="phone"
                  className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

                <CustomizeInput
                  showLabel={false}
                  containerClass="my-2"
                  htmlFor="cnic"
                  label="CNIC Number"
                  labelClassName="text-sm font-medium text-darkColor"
                  type="text"
                  name="cnic"
                  value={cnic}
                  onChange={handleChange}
                  id="cnic"
                  placeholder="Enter Your CNIC Number"
                  className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
                />
                {errors.cnic && <p className="text-red-500 text-sm">{errors.cnic}</p>}

                <CustomizeInput
                  showLabel={false}
                  htmlFor="gender"
                  label="Gender"
                  labelClassName="text-sm font-medium text-darkColor"
                  type="text"
                  name="gender"
                  value={gender}
                  onChange={handleChange}
                  id="gender"
                  placeholder="gender"
                  className="bg-white  border border-[#C7CBD1] w-full h-[40px] rounded px-4 focus:border-[1.5px] focus:border-primary outline-none text-sm"
                />
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

                <CustomizeInput
                  showLabel={false}
                  htmlFor="img"
                  label="Profile Picture"
                  labelClassName="text-sm font-medium text-darkColor"
                  type="file"
                  name="img"
                  accept="image/*"
                  // onChange={handleImageChange}
                  id="img"
                  className="hidden"
                />
                <div className="w-full cursor-pointer outline-none text-black rounded py-3 transition-all duration-300 mt-4 hidden sm:block">
                  <p className="flex items-center justify-center gap-2">
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </div>
              </div>
            </form>
          )}
          {backendError && (
            <div className="text-center text-red-500 mt-4">
              <h2>Registration Failed</h2>
              <p>{backendError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Register;