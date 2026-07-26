import React, { createContext, useContext, useState } from "react";

const RouterContext = createContext();

export function RouterProvider({ children }) {
    const [page, setPage] = useState("login");
    const [params, setParams] = useState({});

    const navigate = (newPage, newParams = {}) => {
        setPage(newPage);
        setParams(newParams);
    };

    return (
        <RouterContext.Provider value={{ page, params, navigate }}>
            {children}
        </RouterContext.Provider>
    );
}

export const useRouter = () => useContext(RouterContext);
