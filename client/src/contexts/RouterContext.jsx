import { createContext, useContext, useState } from "react";

const RouterContext = createContext();

export function RouterProvider({ children }) {
    const [page, setPage] = useState("home");
    const [params, setParams] = useState({});
    const [intendedPage, setIntendedPage] = useState(null);
    const [intendedParams, setIntendedParams] = useState({});

    const navigate = (newPage, newParams = {}) => {
        setPage(newPage);
        setParams(newParams);
    };

    const requireAuth = (intended, newParams = {}) => {
        setIntendedPage(intended);
        setIntendedParams(newParams);
        setPage("login");
    };

    const goAfterLogin = () => {
        if (intendedPage) {
            setPage(intendedPage);
            setParams(intendedParams);
            setIntendedPage(null);
            setIntendedParams({});
        } else {
            setPage("home");
        }
    };

    return (
        <RouterContext.Provider
            value={{ page, params, navigate, requireAuth, goAfterLogin }}>
            {children}
        </RouterContext.Provider>
    );
}

export const useRouter = () => useContext(RouterContext);
