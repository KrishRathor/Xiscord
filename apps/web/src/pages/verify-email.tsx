import { emailCode } from "@/atoms/emailCode";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [email, setEmail] = useState<string>("");
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const codeFromBackend = useRecoilValue(emailCode);
  const router = useRouter();

  const handleChange = (index: number, e: any) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < inputRefs.length - 1) {
      //@ts-ignore
      inputRefs[index + 1].current.focus();
    }
  };

  const verify = trpc.email.verifyEmail.useMutation({
    onSuccess: (data) => {
      toast("Email Verified");
      router.push("/login");
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let code = "";
    otp.map((item) => (code += item));

    if (code === JSON.stringify(codeFromBackend)) {
      const email = router.query.e;
      email && typeof email === "string" ? setEmail(email) : "";
      if (email && typeof email === "string") {
        await verify.mutate({
          email: email,
          correct: true,
        });
      }
    } else {
      toast("Incorrect code!");
    }
  };

  return (
    <div>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-black py-12">
        <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>We have sent a code to your email {email}</p>
              </div>
            </div>

            <div>
              <form action="" method="post">
                <div className="flex flex-col space-y-16">
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                    {inputRefs.map((ref, index) => (
                      <div key={index} className="w-16 h-16">
                        <input
                          //@ts-ignore
                          ref={ref}
                          className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border text-black border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                          type="text"
                          name={`otp-${index}`}
                          maxLength={1}
                          value={otp[index]}
                          onChange={(e) => {
                            handleChange(index, e);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-5">
                    <div>
                      <button
                        className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                        onClick={handleSubmit}
                      >
                        Verify Account
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                      <p>Didn't recieve code?</p>{" "}
                      <a
                        className="flex flex-row items-center text-blue-600"
                        href="http://"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Resend
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default VerifyEmail;
