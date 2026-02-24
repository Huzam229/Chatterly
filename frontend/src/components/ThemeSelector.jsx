import React from "react";
import useThemeStore from "../store/useThemeStore";
import { PaletteIcon } from "lucide-react";
import { THEMES } from "../constants/index.js";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    <div className="dropdown dropdown-end ">
      {/* DropDown Trigger */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-5" />
      </button>
      <div
        tabIndex={0}
        className="dropdown-content p-1 mt-2 shadow-2xl bg-base-200 backdrop-blur-lg 
      rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto"
      >
        <div className="space-y-1">
          {THEMES.map((themeOpt) => (
            <button
              key={theme.name}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 
                    transition-colors ${
                      theme === themeOpt.name
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-base-content/5"
                    }`}
              onClick={() => setTheme(themeOpt.name)}
            >
              <PaletteIcon className="size-4" />
              <span className="font-medium">{themeOpt.name}</span>
              {/* Theme Preview Colors */}
              <div className="ml-auto flex gap-1">
                {themeOpt.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
