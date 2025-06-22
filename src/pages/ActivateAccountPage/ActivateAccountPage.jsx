import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { verify } from "../../store/auth";

const ActivateAccountPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { uid, token } = useParams();

  const [verified, setVerified] = useState(false);

  const handleVerifyAccount = () => {
    dispatch(verify(uid, token));
    setVerified(true);
  };

  useEffect(() => {
    verified && navigate("/");
  }, [verified, navigate]);

  return (
      <div className="py-24 lg:py-10 pb-10">
            <div className="contain">
                <div className="w-full lg:w-[75%] flex items-center flex-col sm:flex-row justify-center py-10 mx-auto">
                    <div className="flex items-start flex-col sm:flex-row justify-start gap-8 w-full">
                        <div className="flex items-start justify-start flex-col gap-4 w-full sm:flex-1">
                            <h1 className="text-2xl text-darkColor font-semibold">Activate your account</h1>


                            <button
                                type="button"
                                onClick={handleVerifyAccount}
                                className="w-full bg-primary/80 hover:bg-primary cursor-pointer outline-none text-white rounded py-3 transition-all duration-300 mt-4 hidden sm:block"
                            >
                                <p className="flex items-center justify-center gap-2">  Verify</p>
                            </button>


                        </div>
                    </div>


                </div>
            </div>
    </div>
  );
};

export default ActivateAccountPage;
