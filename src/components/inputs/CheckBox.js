export const CheckBoxList = ({ items = [], onChange }) => {
  return (
    <div>
      <h3 className="mb-4 font-semibold text-">Select available variants</h3>
      <ul className="items-center w-full text-sm font-medium bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 ">
        {items.map((item, index) => (
          <li
            key={item.id || index}
            className={`w-full ${
              index < items.length - 1
                ? "border-b sm:border-b-0 sm:border-r"
                : ""
            } border-gray-200 dark:border-gray-600`}
          >
            <div className="flex items-center ps-3">
              <input
                id={`${item.id || `checkbox-${index}`}`}
                type="checkbox"
                value={item.value}
                checked={item.checked}
                onChange={() => onChange(item)}
                className="w-4 h-4 text-blue-600 border-gray-300  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2  dark:border-gray-500 rounded-full"
              />
              <label
                htmlFor={`${item.id || `checkbox-${index}`}`}
                className="w-full py-3 ms-2 text-sm font-medium"
              >
                {item.label}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
