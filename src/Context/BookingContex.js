import { createContext, useContext, useEffect, useState } from "react";

const BookingContext = createContext();
export const BookingProvider = ({ children }) => {
    const [loader, setLoader] = useState(0);

    return (
        <BookingContext.Provider value={{ loader, setLoader }}>
            {children}
        </BookingContext.Provider>
    );
};
export const useBooking = () => {
    return useContext(BookingContext);
};