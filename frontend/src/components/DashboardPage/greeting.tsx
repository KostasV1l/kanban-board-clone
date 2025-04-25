"use client";

import React, { useEffect } from "react";

export const Greeting = () => {
    let userName = "Shad";

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) {
            userName = storedName;
        }
    }, []);

    return (
        <section className="flex flex-col rounded-lg shadow-md p-6 mb-3 bg-gradient-to-r from-primary/40 to-primary/95">
            <h1 className="text-xl font-primary font-bold mb-4">Welcome back, {userName}!</h1>
            <p className="font-semibold text-sm mb-2">Here you can manage your tasks and projects.</p>
            <p className="font-semibold text-sm">You have X active boards.</p>
        </section>
    );
};

export default Greeting;
