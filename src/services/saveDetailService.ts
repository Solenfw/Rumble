import { supabase } from "./supabaseClient";
import { fetchEarthquakeDetails } from "./earthquakeAPI";
import { EarthquakeDetailProps } from "@types";

export const handleSaveEarthquake = async (detailUrl: string, currentUserId: string) => {
    try {
        const earthquake: EarthquakeDetailProps = await fetchEarthquakeDetails(detailUrl);
        
        // check if earthquake already exists in the database
        const { data: existing, error: fetchError } = await supabase
            .from("earthquakes")
            .select("id")
            .eq("id", earthquake.id)
            .single();
        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Error checking existing earthquake:", fetchError);
            return { success: false, error: fetchError };
        }
        if (existing) {
            console.log("Earthquake already exists in the database:", existing);
            return { success: true, data: existing, message: "Earthquake already saved" };
        }


        // Prepare the data to match Supabase table schema
        const insertData = {
            id:         earthquake.id,
            user_id:    currentUserId,
            mag:        earthquake.properties.mag,
            mag_type:   earthquake.properties.magType,
            place:      earthquake.properties.place,
            time:       new Date(earthquake.properties.time).toISOString(),
            updated:    new Date(earthquake.properties.updated).toISOString(),
            status:     earthquake.properties.status,
            alert:      earthquake.properties.alert,
            tsunami:    earthquake.properties.tsunami,
            sig:        earthquake.properties.sig,
            felt:       earthquake.properties.felt,
            cdi:        earthquake.properties.cdi,
            mmi:        earthquake.properties.mmi,
            url:        earthquake.properties.url,

            longitude:  earthquake.geometry.coordinates[0],
            latitude:   earthquake.geometry.coordinates[1],
            depth:      earthquake.geometry.coordinates[2],

            raw:        earthquake,  
        };
        const { data, error } = await supabase
            .from("earthquakes")
            .insert([insertData]);
        if (error) {
            console.error("Error saving earthquake:", error);
            return { success: false, error };
        } else {
            console.log("Earthquake saved successfully:", data);
            return { success: true, data };
        }
    } catch (err) {
        console.error("Error in handleSaveEarthquake:", err);
        return { success: false, error: err };
    }
};

// Utility to fetch all saved earthquakes
export const fetchSavedEarthquakes = async () => {
    const { data, error } = await supabase.from("earthquakes").select("*");
    if (error) throw error;
    return data;
};