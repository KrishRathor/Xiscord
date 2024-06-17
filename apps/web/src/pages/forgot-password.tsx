import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailRegistered, setEmailRegistered] = useState<boolean>(false);
  const [emailCode, setEmailCode] = useState<number>();

  const router = useRouter();

  const sendMail = trpc.email.sendEmail.useMutation({
    onSuccess: data => {
      setEmailCode(_prev => data?.code);
    }
  })

  const accountExist = trpc.user.forgetPassword.useMutation({
    onSuccess: async (data) => {
      if (data.code === 404) {
        toast("Email not registered");
      } else if (data.code === 200) {
        setEmailRegistered((_prev) => true);
        await sendMail.mutate({ email: email })
      }
    },
  });

  const resetPassword = trpc.user.resetPassword.useMutation({
    onSuccess: data => {
      if (data?.code === 200) {
        toast("Password changed successfully");
        router.push('/login');
      }
    }
  })

  const handleEmail = async (e: any) => {
    e.preventDefault();
    await accountExist.mutate({
      email: email,
    });
  };

  const handlePasswordChange = async (code: string, newPassword: string, oldPassword: string) => {
    if (code === JSON.stringify(emailCode)) {
      toast("Correct code");
      setEmailRegistered(_prev => true)
      
      if (!(oldPassword === newPassword)) {
        toast("Confirm password doesn't match");
        setEmailRegistered(_prev => true);
        return;
      }

      await resetPassword.mutate({ email: email, newPassword: newPassword });
      router.push('/login');
    } else {
      toast("Wrong Code");
    }
  }

  return (
    <div>
      <div className="flex flex-col mt-8">
        <form action="">
          <label className="block mb-2 text-center font-medium text-gray-900 dark:text-white text-2xl">
            Enter your email:
          </label>
          <input
            type="email"
            id="first_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-96 m-auto"
            placeholder="John"
            required
            onChange={(e) => setEmail((_prev) => e.target.value)}
          />
          <button
            type="submit"
            onClick={handleEmail}
            className="py-2 px-4 rounded-md m-auto block mt-4 bg-blue-600 hover:bg-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
      { emailRegistered ? <ResetPassword email={email} handlePasswordChange={handlePasswordChange} /> : '' }
      <ToastContainer />
    </div>
  );
};

interface ResetPasswordProps {
  email: string;
  handlePasswordChange: (code: string, newPassword: string, oldPassword: string) => void
}

const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
  const { email, handlePasswordChange } = props;
  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');

  return (
    <div>
      <div className=" mt-8 flex items-center justify-center bg-black text-black">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center space-x-2 mb-6">
            <h1 className="text-xl font-semibold">Change Password</h1>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Verification code has been sent to your email
          </p>
          <form id="changePasswordForm" className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Email Code *
              </label>
              <input
                type="password"
                id="currentPassword"
                className="password-input form-input block w-full border border-gray-300 rounded-md shadow-sm"
                required
                onChange={(e) => setCode(_prev => e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                New Password *
              </label>
              <input
                type="password"
                id="newPassword"
                className="password-input form-input block w-full border border-gray-300 rounded-md shadow-sm"
                required
                onChange={(e) => setOldPassword(_prev => e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="password-input form-input block border w-full border-gray-300 rounded-md shadow-sm"
                required
                onChange={(e) => setNewPassword(_prev => e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
                onClick={() => handlePasswordChange(code, newPassword, oldPassword)}
              >
                Apply Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
