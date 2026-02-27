import React, { memo, useRef, useState, useEffect } from "react";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import JoditEditor from "jodit-react";
import Radio from "../atoms/Radio";
import CustomSelect from "../atoms/Select";
import type { InputType } from "../../types/common";

interface LabeledInputProps {
  name: string;
  label?: string;
  type: InputType;
  value?: any;
  onChange?: (e: { target: { name: string; value: any } }) => void;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
  options?: { label: string; value: string }[];
  error?: string;
  previewEnabled?: boolean;
  withEditor?: boolean;
}

const LabeledInput: React.FC<LabeledInputProps> = memo(
  ({
    name,
    label,
    type,
    value,
    onChange,
    placeholder,
    required,
    readonly,
    disabled,
    "aria-label": ariaLabel,
    className,
    error,
    previewEnabled,
    withEditor,
    options
  }) => {
    
    const BACKEND_URL = "http://localhost:5000";
    const defaultImage = "/preview-image.jpg"; 

    const [preview, setPreview] = useState<string>(defaultImage);
    const [fileError, setFileError] = useState<string | null>(null);
    const editorRef = useRef(null);

    // ✅ Image preview setter 
    useEffect(() => {
      if (value) {
        if (typeof value === "string" && value.trim() !== "") {
          // Path munnadi http iruntha athaiye use pannum, illana backend URL sethukum
          const fullImageUrl = value.startsWith("http")
            ? value
            : `${BACKEND_URL}${value}`;
          setPreview(fullImageUrl);
        } else if (value instanceof File) {
          // Puthusa upload panna local preview kaatum
          const objectUrl = URL.createObjectURL(value);
          setPreview(objectUrl);
          return () => URL.revokeObjectURL(objectUrl);
        }
      } else {
        setPreview(defaultImage);
      }
    }, [value]);

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (type === "file" && e.target instanceof HTMLInputElement) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
          setFileError("Only image files are allowed (jpg, png, jpeg)");
          setPreview(defaultImage);
          return;
        }

        setFileError(null);
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);

        onChange?.({
          target: {
            name,
            value: file,
          },
        });
        return;
      }
      onChange?.(e as any);
    };

    const handleEditorChange = (content: string) => {
      onChange?.({
        target: {
          name,
          value: content,
        },
      });
    };

    return (
      <div className={`flex flex-col ${className || ""}`}>
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {type === "file" ? (
          <>
            <Input
              id={name}
              name={name}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              disabled={disabled}
            />

            {previewEnabled && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded border bg-gray-100"
                  onError={(e) => {
                    // URL thappa iruntha default image-ah switch pannum
                    (e.target as HTMLImageElement).src = defaultImage;
                  }}
                />
              </div>
            )}

            {fileError && (
              <p className="mt-1 text-sm text-red-500">{fileError}</p>
            )}
          </>
        ) : type === "textarea" ? (
          withEditor ? (
            <JoditEditor
              ref={editorRef}
              value={value || ""}
              config={{ readonly: readonly || false, height: 300 }}
              onBlur={(newContent) => handleEditorChange(newContent)}
            />
          ) : (
            <TextArea
              id={name}
              name={name}
              value={value || ""}
              onChange={handleInputChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              error={error}
            />
          )
        ) : type === "checkbox" ? (
          <div
            onClick={() =>
              !disabled &&
              onChange?.({ target: { name, value: !Boolean(value) } })
            }
            className={`relative w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ${Boolean(value) ? "bg-green-500" : "bg-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${Boolean(value) ? "translate-x-6" : ""
                }`}
            />
          </div>
        ) : type === "radio" ? (
          <Radio
            name={name}
            selectedValue={value || ""}
            onChange={handleInputChange}
            disabled={disabled}
            label={ariaLabel}
            options={options}
          />
        ) : type === "select" ? (
          <CustomSelect
            options={options}
            value={options.find((opt) => opt.value === value) || null}
            onChange={(selected) => {
              onChange?.({
                target: {
                  name,
                  value: (selected as any)?.value || "",
                },
              });
            }}
            placeholder={`Select ${label}`}
            className={error ? "react-select-error" : ""}
          />
        ) : (
          <Input
            id={name}
            name={name}
            type={type}
            value={value || ""}
            onChange={handleInputChange}
            readOnly={readonly}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            aria-label={ariaLabel}
            className={error ? 'border-red-500' : ''}
          />
        )}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

LabeledInput.displayName = "LabeledInput";
export default LabeledInput;
