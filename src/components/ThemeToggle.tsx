import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/providers/ThemeProvider';

const ThemeToggle = () => {
  const { mode, setMode } = useTheme();

  const themes = [
    {
      name: 'Light',
      value: 'light',
      icon: SunIcon,
    },
    {
      name: 'Dark',
      value: 'dark',
      icon: MoonIcon,
    },
    {
      name: 'System',
      value: 'system',
      icon: ComputerDesktopIcon,
    },
  ] as const;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        aria-label="Toggle theme"
      >
        {mode === 'light' ? (
          <SunIcon className="h-5 w-5" aria-hidden="true" />
        ) : mode === 'dark' ? (
          <MoonIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <ComputerDesktopIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
          <div className="py-1">
            {themes.map((theme) => (
              <Menu.Item key={theme.value}>
                {({ active }) => (
                  <button
                    onClick={() => setMode(theme.value)}
                    className={`${
                      active
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-300'
                    } ${
                      mode === theme.value ? 'font-medium' : ''
                    } flex w-full items-center px-4 py-2 text-sm`}
                  >
                    <theme.icon
                      className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500"
                      aria-hidden="true"
                    />
                    {theme.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ThemeToggle; 