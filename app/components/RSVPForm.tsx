import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { config } from "../configs";
import { useState, useTransition } from "react";

interface RSVPFormData {
  firstName: string;
  lastName: string;
  peopleAmount: number;
  isAccepted: boolean;
}

export const RSVPForm = () => {
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RSVPFormData>();

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  // Rate limiting
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  const MAX_SUBMISSIONS_PER_WINDOW = 3; // Max 3 submissions per minute

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const onSubmit = async (data: RSVPFormData) => {
    // Rate limiting check
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime;

    if (timeSinceLastSubmission < RATE_LIMIT_WINDOW) {
      if (submissionCount >= MAX_SUBMISSIONS_PER_WINDOW) {
        startTransition(() => {
          setStatus("error");
          setTimeout(() => {
            startTransition(() => {
              setStatus("idle");
            });
          }, 3000);
        });
        console.warn(
          "Rate limit exceeded. Please wait before submitting again."
        );
        return;
      }
      setSubmissionCount((prev) => prev + 1);
    } else {
      setSubmissionCount(1);
      setLastSubmissionTime(now);
    }

    startTransition(() => {
      setStatus("submitting");
    });

    const formData = {
      first_name: data.firstName,
      last_name: data.lastName,
      people_amount: data.peopleAmount,
      is_accepted: data.isAccepted,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer || "direct",
    };

    try {
      console.log("Submitting RSVP data:", formData);
      console.log("Sending to URL:", config.appScriptUrl);

      // ใช้ no-cors mode เป็นหลัก เนื่องจาก Google Apps Script ไม่รองรับ CORS
      await fetch(config.appScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("Request sent successfully with no-cors mode");

      // เมื่อใช้ no-cors mode เราไม่สามารถอ่าน response ได้
      // แต่ถ้า request ไม่ throw error แสดงว่าส่งสำเร็จ

      // รอสักครู่เพื่อให้ Apps Script ประมวลผลเสร็จ
      setTimeout(() => {
        startTransition(() => {
          setStatus("success");
          reset();
          // ซ่อน success message หลัง 2 วินาที
          setTimeout(() => {
            startTransition(() => {
              setStatus("idle");
            });
          }, 2000);
        });
      }, 1500);
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      startTransition(() => {
        setStatus("error");
        // ซ่อน error message หลัง 2 วินาที
        setTimeout(() => {
          startTransition(() => {
            setStatus("idle");
          });
        }, 2000);
      });
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-[#8B7355]"
      variants={fadeInUp}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-light tracking-wide text-[#8B7355] mb-2">
            First Name *
          </label>
          <input
            {...register("firstName", {
              required: "First name is required",
              minLength: {
                value: 1,
                message: "First name must be at least 1 character",
              },
              maxLength: {
                value: 50,
                message: "First name must be less than 50 characters",
              },
              pattern: {
                value: /^[a-zA-Zก-๙\s]+$/,
                message: "First name contains invalid characters",
              },
            })}
            className="w-full bg-white/50 border border-[#8B7355] rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-all duration-300"
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-light tracking-wide text-[#8B7355] mb-2">
            Last Name *
          </label>
          <input
            {...register("lastName", {
              required: "Last name is required",
              minLength: {
                value: 1,
                message: "Last name must be at least 1 character",
              },
              maxLength: {
                value: 50,
                message: "Last name must be less than 50 characters",
              },
              pattern: {
                value: /^[a-zA-Zก-๙\s]+$/,
                message: "Last name contains invalid characters",
              },
            })}
            className="w-full bg-white/50 border border-[#8B7355] rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-all duration-300"
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-light tracking-wide text-[#8B7355] mb-2">
          Number of Guests *
        </label>
        <input
          type="number"
          min="1"
          max="10"
          {...register("peopleAmount", {
            required: "Number of guests is required",
            min: { value: 1, message: "At least 1 guest is required" },
            max: { value: 10, message: "Maximum 10 guests allowed" },
          })}
          className="w-full bg-white/50 border border-[#8B7355] rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-all duration-300"
          placeholder="How many people will attend?"
        />
        {errors.peopleAmount && (
          <p className="text-rose-500 text-sm mt-1">
            {errors.peopleAmount.message}
          </p>
        )}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-light tracking-wide text-[#8B7355] mb-4">
          Will you be attending? *
        </label>
        <div className="flex space-x-8">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="true"
              {...register("isAccepted", {
                required: "Please select your attendance",
              })}
              className="sr-only peer"
            />
            <div className="w-5 h-5 rounded-full border-2 border-[#8B7355] mr-3 flex items-center justify-center peer-checked:border-[#8B7355] peer-checked:bg-[#8B7355]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8B7355] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-gray-700 font-light">
              Yes, I'll be there!
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="false"
              {...register("isAccepted", {
                required: "Please select your attendance",
              })}
              className="sr-only peer"
            />
            <div className="w-5 h-5 rounded-full border-2 border-[#8B7355] mr-3 flex items-center justify-center peer-checked:border-[#8B7355] peer-checked:bg-[#8B7355]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8B7355] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-gray-700 font-light">
              Sorry, can't make it
            </span>
          </label>
        </div>
        {errors.isAccepted && (
          <p className="text-rose-500 text-sm mt-2">
            {errors.isAccepted.message}
          </p>
        )}
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">
              Success! Your RSVP has been submitted.
            </span>
          </div>
          <p className="text-sm text-green-600 mt-2">
            Thank you for confirming your attendance!
          </p>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Submission Failed</span>
          </div>
          <p className="text-sm text-red-600 mt-2">
            {submissionCount >= MAX_SUBMISSIONS_PER_WINDOW
              ? "Too many submission attempts. Please wait a minute before trying again."
              : "There was an error submitting your RSVP. Please try again."}
          </p>
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={status === "submitting" || isPending}
        className={`w-full py-4 rounded-xl font-light text-lg tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
          status === "submitting" || isPending
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-[#8B7355] hover:bg-[#6B5B47] text-white"
        }`}
        whileHover={
          status !== "submitting" && !isPending ? { scale: 1.02 } : {}
        }
        whileTap={status !== "submitting" && !isPending ? { scale: 0.98 } : {}}
      >
        {status === "submitting" || isPending ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </>
        ) : (
          "Submit RSVP"
        )}
      </motion.button>
    </motion.form>
  );
};
