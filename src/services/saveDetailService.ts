// src/services/saveDetailService.ts
import { supabase } from "./supabaseClient";
import { fetchEarthquakeDetails } from "./earthquakeAPI";
import { EarthquakeDetailProps } from "@types";

export const handleSaveEarthquake = async (detailUrl: string, currentUserId: string) => {
    try {
        const earthquake: EarthquakeDetailProps = await fetchEarthquakeDetails(detailUrl);
        
        const { data: existing, error: fetchError } = await supabase
            .from("earthquakes")
            .select("*") 
            .eq("id", earthquake.id)
            .single();

        if (existing && existing.user_id !== currentUserId) {
            return { success: true, data: existing, message: "Earthquake saved successfully" };
        }
        if (fetchError && fetchError.code !== "PGRST116") {
            return { success: false, message: "Failed to check existing earthquake", error: fetchError };
        }
        if (existing) {
            return { success: true, data: existing, message: "Earthquake already saved" };
        }

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
            long:       earthquake.geometry.coordinates[0],
            lat:        earthquake.geometry.coordinates[1],
            depth:      earthquake.geometry.coordinates[2],
            raw:        earthquake,  
        };

        const { data, error } = await supabase
            .from("earthquakes")
            .insert([insertData])
            .select()
            .single(); 

        if (error) {
            console.error("Error saving earthquake:", error);
            return { success: false, message: "Failed to save earthquake", error };
        } else {
            console.log("Earthquake saved successfully:", data);
            return { success: true, data, message: "Earthquake saved successfully" };
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