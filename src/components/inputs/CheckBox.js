// components/inputs/CheckBox.jsx
import { FaCheck } from "react-icons/fa";

export const CheckBoxList = ({ items = [], onChange, className = "" }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-sm text-[var(--text-muted)] italic py-2">
        No options available
      </div>
    );
  }

  return (
    <div>
      <ul className={`w-full text-sm font-medium ${className}`}>
        {items.map((item, index) => (
          <li
            key={item.id || item.size || item.label || `checkbox-${index}`}
            className="w-full"
          >
            <div className="flex items-center ps-3 py-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors cursor-pointer">
              <div className="check-wrapper">
                <input
                  id={item.id || item.size || `checkbox-${index}`}
                  type="checkbox"
                  checked={item.checked || false}
                  onChange={() => onChange(item, index)}
                  style={{ display: "none" }}
                  aria-checked={item.checked || false}
                />
                <label
                  htmlFor={item.id || item.size || `checkbox-${index}`}
                  aria-label="Toggle checkbox"
                >
                  <div
                    className={`box ${
                      item.checked ? "checked" : ""
                    } flex items-center justify-center`}
                  >
                    {item.checked && (
                      <FaCheck className="check-icon" size={12} />
                    )}
                  </div>
                </label>
              </div>
              <label
                htmlFor={item.id || item.size || `checkbox-${index}`}
                className="w-full py-1 ms-3 text-sm font-medium text-[var(--text-primary)] cursor-pointer select-none"
              >
                {item.label || item.size || `Option ${index + 1}`}
              </label>
            </div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .check-wrapper {
          display: flex;
          align-items: center;
        }

        .check-wrapper input {
          display: none;
        }

        .check-wrapper input:checked + label .box {
          animation: animOnTransform 0.5s 1 forwards;
          background: rgba(0, 0, 0, 0.5);
        }

        .check-wrapper input:checked + label .box .check-icon {
          transform: translate(-50%, -50%) scale(1);
          transition-duration: 200ms;
          transition-delay: 200ms;
          opacity: 1;
        }

        .check-wrapper label {
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .check-wrapper label .box {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 5px;
          position: relative;
          width: 22px;
          height: 22px;
          transition: background 300ms ease;
        }

        .check-wrapper label .box:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        .check-wrapper label .box .check-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          font-size: 12px;
          color: white;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s ease-in-out;
          transform: translate(-50%, -50%) scale(4);
        }

        @keyframes animOnTransform {
          40% {
            transform: scale(1.5, 0.5);
          }
          50% {
            transform: scale(0.5, 1.5);
          }
          60% {
            transform: scale(1.3, 0.6);
          }
          70% {
            transform: scale(0.8, 1.2);
          }
          100% {
            transform: scale(1, 1);
          }
        }
      `}</style>
    </div>
  );
};

// For single checkbox usage
export const CheckBox = ({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="check-wrapper">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{ display: "none" }}
          aria-checked={checked}
        />
        <label htmlFor={id} aria-label="Toggle checkbox">
          <div
            className={`box ${
              checked ? "checked" : ""
            } flex items-center justify-center`}
          >
            {checked && <FaCheck className="check-icon" size={12} />}
          </div>
        </label>
      </div>
      {label && (
        <label
          htmlFor={id}
          className="ms-2 text-sm font-medium text-[var(--text-primary)] cursor-pointer select-none"
        >
          {label}
        </label>
      )}

      <style jsx>{`
        .check-wrapper {
          display: flex;
          align-items: center;
        }

        .check-wrapper input {
          display: none;
        }

        .check-wrapper input:checked + label .box {
          animation: animOnTransform 0.5s 1 forwards;
          background: rgba(0, 0, 0, 0.5);
        }

        .check-wrapper input:checked + label .box .check-icon {
          transform: translate(-50%, -50%) scale(1);
          transition-duration: 200ms;
          transition-delay: 200ms;
          opacity: 1;
        }

        .check-wrapper label {
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .check-wrapper label .box {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 5px;
          position: relative;
          width: 22px;
          height: 22px;
          transition: background 300ms ease;
        }

        .check-wrapper label .box:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        .check-wrapper label .box .check-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          font-size: 12px;
          color: white;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s ease-in-out;
          transform: translate(-50%, -50%) scale(4);
        }

        @keyframes animOnTransform {
          40% {
            transform: scale(1.5, 0.5);
          }
          50% {
            transform: scale(0.5, 1.5);
          }
          60% {
            transform: scale(1.3, 0.6);
          }
          70% {
            transform: scale(0.8, 1.2);
          }
          100% {
            transform: scale(1, 1);
          }
        }
      `}</style>
    </div>
  );
};
