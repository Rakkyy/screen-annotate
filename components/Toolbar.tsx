"use client";

interface ToolbarProps {
  currentTool: "select" | "arrow" | "rectangle" | "text";
  onToolChange: (tool: "select" | "arrow" | "rectangle" | "text") => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  onUndo: () => void;
  canUndo: boolean;
  onSave: () => void;
  onDownload: () => void;
}

const PRESET_COLORS = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#000000", // Black
  "#FFFFFF", // White
];

export function Toolbar({
  currentTool,
  onToolChange,
  currentColor,
  onColorChange,
  onUndo,
  canUndo,
  onSave,
  onDownload,
}: ToolbarProps) {
  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left: Tools */}
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mr-4">
              Tools
            </h2>

            <ToolButton
              active={currentTool === "select"}
              onClick={() => onToolChange("select")}
              title="Select"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              }
            />

            <ToolButton
              active={currentTool === "arrow"}
              onClick={() => onToolChange("arrow")}
              title="Arrow"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              }
            />

            <ToolButton
              active={currentTool === "rectangle"}
              onClick={() => onToolChange("rectangle")}
              title="Rectangle"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                </svg>
              }
            />

            <ToolButton
              active={currentTool === "text"}
              onClick={() => onToolChange("text")}
              title="Text"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              }
            />
          </div>

          {/* Middle: Color Picker */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Color
            </span>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    currentColor === color
                      ? "border-gray-900 dark:border-white ring-2 ring-offset-2 ring-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <input
                type="color"
                value={currentColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                title="Custom color"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <ActionButton
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              }
            />

            <ActionButton
              onClick={onDownload}
              title="Download"
              variant="secondary"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            />

            <ActionButton
              onClick={onSave}
              title="Save & Share"
              variant="primary"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToolButtonProps {
  active: boolean;
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
}

function ToolButton({ active, onClick, title, icon }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-3 rounded-lg transition-all hover:scale-105 ${
        active
          ? "bg-indigo-600 text-white shadow-lg"
          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      }`}
    >
      {icon}
    </button>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "default";
}

function ActionButton({
  onClick,
  title,
  icon,
  disabled = false,
  variant = "default",
}: ActionButtonProps) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  const variantClasses = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg",
    secondary: "bg-green-600 hover:bg-green-700 text-white shadow-lg",
    default: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {icon}
      <span className="hidden sm:inline">{title}</span>
    </button>
  );
}
