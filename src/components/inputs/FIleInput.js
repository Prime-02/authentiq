import { Image, Loader2 } from "lucide-react";

export const FileInput = ({
  accept,
  changed,
  type = "file",
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Label for Input */}
      <label
        className="block text-sm font-medium w-full"
        htmlFor="file_input"
      ></label>

      {/* Hidden Native File Input */}
      <input
        id="file_input"
        type={type}
        accept={accept}
        onChange={changed}
        className="hidden"
        disabled={isLoading}
      />

      {/* Custom Styled Label */}
      <label
        htmlFor="file_input"
        className={`
          w-full text-sm text-white bg-blue-500 border border-blue-500 rounded-lg 
          cursor-pointer px-3 py-1.5 text-center flex items-center gap-x-1 
          justify-center
          ${
            isLoading
              ? "opacity-50 cursor-not-allowed bg-blue-400"
              : "hover:bg-blue-600 dark:bg-blue-700 dark:border-blue-700 dark:hover:bg-blue-800"
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            <span className="hidden md:flex">Uploading...</span>
          </>
        ) : (
          <>
            <span>
              <Image />
            </span>
            <span className="hidden md:flex">Choose Image</span>
          </>
        )}
      </label>
    </div>
  );
};
