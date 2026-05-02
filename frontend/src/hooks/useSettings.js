import { useEffect, useState } from "react";
import axios from "axios";

export default function useSettings() {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/settings")
            .then((res) => setSettings(res.data))
            .catch((err) => console.error("Failed to load settings", err));
    }, []);

    return settings;
}
