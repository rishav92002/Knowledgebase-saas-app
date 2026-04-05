"use client"

import React,{useState} from "react";






type statusType = {
    message?: string;
    isError?: boolean;
};



const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<statusType>({});


  const handleResetPassword = () => {
    try{
        

        setStatus({ message: "If an account with that email exists, a password reset link has been sent.", isError: false });
    }catch(e){
        setStatus({ message: "An error occurred while processing your request. please try again!", isError: true });
    }
    
  }
  return <div className="w-full flex flex-col items-center justify-center gap-6"> 
            <div className="w-full flex items-center justify-start text-lg font-semibold text-gray-600">{'Reset your password'}</div>
            <div className="w-full flex flex-col items-start justify-start space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2b6cee] focus:border-transparent transition"
              />
              {}
            </div>
            <div className="w-full flex items-center justify-center">
              <button
                type="button"
                className="w-full px-4 py-3 bg-[#2b6cee] text-white font-medium rounded-lg hover:bg-[#255cb0] focus:outline-none focus:ring-2 focus:ring-[#2b6cee] focus:ring-offset-2 transition"
              >
                Reset Password
              </button>
            </div>
        </div>
}


export default ForgotPassword;

 