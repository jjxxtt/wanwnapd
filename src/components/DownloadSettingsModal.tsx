import React, { useEffect, useState } from 'react';
import { GridDownloadOptions } from '../types/downloadTypes';

const gridLineColorOptions = [
  { name: '柔灰', value: '#555555' },
  { name: '樱粉', value: '#F472B6' },
  { name: '天空蓝', value: '#38BDF8' },
  { name: '薄荷绿', value: '#10B981' },
  { name: '葡萄紫', value: '#8B5CF6' },
  { name: '蜜橙', value: '#F59E0B' },
];

interface DownloadSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: GridDownloadOptions;
  onOptionsChange: (options: GridDownloadOptions) => void;
  onDownload: (opts?: GridDownloadOptions) => void;
}

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative h-7 w-12 rounded-full transition-colors ${
      checked ? 'bg-pink-500' : 'bg-gray-200 dark:bg-gray-700'
    }`}
  >
    <span
      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-1'
      }`}
    />
  </button>
);

const DownloadSettingsModal: React.FC<DownloadSettingsModalProps> = ({
  isOpen,
  onClose,
  options,
  onOptionsChange,
  onDownload
}) => {
  const [tempOptions, setTempOptions] = useState<GridDownloadOptions>({...options});

  useEffect(() => {
    if (isOpen) setTempOptions({...options});
  }, [isOpen, options]);

  if (!isOpen) return null;

  const handleOptionChange = (key: keyof GridDownloadOptions, value: string | number | boolean) => {
    setTempOptions((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onOptionsChange(tempOptions);
    onDownload(tempOptions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-2xl dark:border-pink-400/20 dark:bg-gray-950">
        <div className="flex items-center justify-between border-b border-pink-100 px-5 py-4 dark:border-pink-400/20">
          <div>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">下载设置</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">默认设置已经适合快速出图，只在需要微调时改这里。</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="flex items-center justify-between rounded-xl bg-pink-50 px-4 py-3 dark:bg-pink-950/20">
            <div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">网格线</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">便于按格摆豆</div>
            </div>
            <Toggle checked={tempOptions.showGrid} onChange={(checked) => handleOptionChange('showGrid', checked)} />
          </div>

          {tempOptions.showGrid && (
            <div className="rounded-xl border border-pink-100 p-4 dark:border-pink-400/20">
              <div className="flex items-center gap-3">
                <span className="w-20 text-sm font-semibold text-gray-700 dark:text-gray-200">间隔</span>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={tempOptions.gridInterval}
                  onChange={(e) => handleOptionChange('gridInterval', parseInt(e.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-pink-500 dark:bg-gray-700"
                />
                <span className="w-8 text-right font-mono text-sm text-gray-800 dark:text-gray-100">{tempOptions.gridInterval}</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="w-20 text-sm font-semibold text-gray-700 dark:text-gray-200">颜色</span>
                <div className="flex flex-wrap gap-2">
                  {gridLineColorOptions.map(colorOpt => (
                    <button
                      key={colorOpt.value}
                      type="button"
                      onClick={() => handleOptionChange('gridLineColor', colorOpt.value)}
                      className={`h-8 w-8 rounded-full border transition ${
                        tempOptions.gridLineColor === colorOpt.value
                          ? 'border-pink-500 ring-2 ring-pink-400 ring-offset-2 dark:ring-offset-gray-950'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      style={{ backgroundColor: colorOpt.value }}
                      title={colorOpt.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">坐标数字</span>
              <Toggle checked={tempOptions.showCoordinates} onChange={(checked) => handleOptionChange('showCoordinates', checked)} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">格内色号</span>
              <Toggle checked={tempOptions.showCellNumbers} onChange={(checked) => handleOptionChange('showCellNumbers', checked)} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">豆数统计</span>
              <Toggle checked={tempOptions.includeStats} onChange={(checked) => handleOptionChange('includeStats', checked)} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">导出源数据</span>
              <Toggle checked={tempOptions.exportCsv} onChange={(checked) => handleOptionChange('exportCsv', checked)} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-pink-100 px-5 py-4 dark:border-pink-400/20">
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-100 transition hover:from-pink-600 hover:to-violet-600"
          >
            下载图纸
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadSettingsModal;
export { gridLineColorOptions };
