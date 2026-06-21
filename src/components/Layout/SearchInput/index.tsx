import useSearchInput from '@app/hooks/useSearchInput';
import useOriginalLanguageFilter from '@app/hooks/useOriginalLanguageFilter';
import defineMessages from '@app/utils/defineMessages';
import {
  LockClosedIcon,
  LockOpenIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

const messages = defineMessages('components.Layout.SearchInput', {
  searchPlaceholder: 'Search Movies & Series',
  lockEnglish: 'English original language locked',
  unlockEnglish: 'All original languages shown',
});

const SearchInput = () => {
  const intl = useIntl();
  const router = useRouter();
  const { searchValue, setSearchValue, setIsOpen, clear } = useSearchInput();
  const { originalLanguageFilter, setOriginalLanguageFilter } =
    useOriginalLanguageFilter();
  const isEnglishLocked = originalLanguageFilter !== 'all';

  const toggleEnglishLock = () => {
    const nextOriginalLanguageFilter = isEnglishLocked ? 'all' : 'en';
    const nextQuery = { ...router.query };

    if (isEnglishLocked) {
      nextQuery.originalLanguage = 'all';
    } else {
      delete nextQuery.originalLanguage;
    }

    setOriginalLanguageFilter(nextOriginalLanguageFilter);
    router.replace(
      {
        pathname: router.pathname,
        query: nextQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className="flex flex-1 items-center gap-2">
      <button
        type="button"
        className={`inline-flex h-10 flex-shrink-0 items-center rounded-md border px-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isEnglishLocked
            ? 'border-gray-600 bg-gray-800/80 text-white hover:border-indigo-400 hover:bg-gray-700'
            : 'border-red-600 bg-gray-800/80 text-gray-300 opacity-80 hover:border-gray-500 hover:bg-gray-700 hover:text-white hover:opacity-100'
          }`}
        aria-pressed={isEnglishLocked}
        aria-label={intl.formatMessage(
          isEnglishLocked ? messages.lockEnglish : messages.unlockEnglish
        )}
        title={intl.formatMessage(
          isEnglishLocked ? messages.lockEnglish : messages.unlockEnglish
        )}
        onClick={toggleEnglishLock}
      >
        <span className="mr-1.5 overflow-hidden rounded-sm border border-gray-900/40 shadow-sm">
          <Image
            src="/images/us-uk-flag.svg"
            alt=""
            width={36}
            height={20}
            className="h-5 w-9 object-cover"
          />
        </span>
        {isEnglishLocked ? (
          <LockClosedIcon className="h-5 w-5" />
        ) : (
          <LockOpenIcon className="h-5 w-5" />
        )}
      </button>
      <div className="flex w-full">
        <label htmlFor="search_field" className="sr-only">
          Search
        </label>
        <div className="relative flex w-full items-center text-white focus-within:text-gray-200">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </div>
          <input
            id="search_field"
            style={{ paddingRight: searchValue.length > 0 ? '1.75rem' : '' }}
            className="block w-full rounded-full border border-gray-600 bg-gray-900/80 py-2 pl-10 text-white placeholder-gray-300 hover:border-gray-500 focus:border-gray-500 focus:bg-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-base"
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
            type="search"
            autoComplete="off"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              if (searchValue === '') {
                setIsOpen(false);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
          {searchValue.length > 0 && (
            <button
              className="absolute inset-y-0 right-2 m-auto h-7 w-7 border-none p-1 text-gray-400 outline-none transition hover:text-white focus:border-none focus:outline-none"
              onClick={() => clear()}
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
