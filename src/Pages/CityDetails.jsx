import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import { Input } from "../Components/Input";
import { Table } from "../Components/Table";
import axios from "axios";

export const CityDetails = () => {
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(3);
    const [pagination, setPagination] = useState({ currentPage: 0, totalCount: 0 });
    const [cityData, setCityData] = useState({ cities: [], isLoading: false });

    const deferredSearchValue = useDeferredValue(search);
    const searchInputRef = useRef(null);
    const totalPages = Math.ceil(pagination.totalCount / limit);

    const fetchCityDetails = async (searchValue, limit, page) => {
        setCityData((prev) => ({ ...prev, isLoading: true }));
        const offset = page * limit;

        try {
            const response = await axios(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${searchValue}&limit=${limit}&offset=${offset}`, {
                headers: {
                    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
                    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
                }
            });

            if (response.status === 200) {
                const result = response.data;
                setCityData({ cities: result.data, isLoading: false });
                setPagination((prev) => ({ ...prev, totalCount: result.metadata.totalCount }));
            }
        } catch (error) {
            console.error("Failed to fetch city details", error);
            setCityData((prev) => ({ ...prev, isLoading: false }));
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (deferredSearchValue.trim()) {
                fetchCityDetails(deferredSearchValue, limit, pagination.currentPage);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [deferredSearchValue, limit, pagination.currentPage]);

    const handleLimitChange = (e) => {
        const val = parseInt(e.target.value, 10);
        if (val >= 1 && val <= 10) {
            setLimit(val);
            setPagination((prev) => ({ ...prev, currentPage: 0 }));
        }
    };

    const handleSearch = useCallback((e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            searchInputRef.current.focus();
        }
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, currentPage: 0 }));
    }, []);

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, []);

    return (
        <div className="PageContainer">
            <h1 className="header">City Details</h1>
            <div className="container">
                <div className="searchContainer">
                    <Input
                        name="search"
                        type="text"
                        placeholder="Search places..."
                        value={search}
                        onChange={handleSearch}
                        className="searchInput"
                        ref={searchInputRef}
                    />
                    <kbd className="shortcut">Ctrl + /</kbd>
                </div>

                <div className="tableContainer">
                    <Table search={search} isLoading={cityData.isLoading} data={cityData.cities} />
                </div>

                <div className="paginationLimitContainer">
                    <div style={{ marginBottom: '10px' }} className="limitContainer">
                        <label>
                            Limit:&nbsp;
                            <input
                                type="number"
                                value={limit}
                                min={1}
                                max={10}
                                onChange={handleLimitChange}
                            />
                        </label>
                    </div>

                    {search.length > 0 && cityData.cities.length > 0 && (
                        <div className="paginationContainer">
                            <button
                                onClick={() =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        currentPage: Math.max(prev.currentPage - 1, 0)
                                    }))
                                }
                                disabled={pagination.currentPage === 0}
                            >
                                Previous
                            </button>
                            <span style={{ margin: '0 10px' }}>
                                Page {pagination.currentPage + 1} of {totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        currentPage:
                                            prev.currentPage + 1 < totalPages
                                                ? prev.currentPage + 1
                                                : prev.currentPage
                                    }))
                                }
                                disabled={pagination.currentPage + 1 >= totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
