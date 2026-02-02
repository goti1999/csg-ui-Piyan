function mergeDispoRow(row) {
    const merged = {};

    for (const key in row) {
        // Wenn es ein d_-Feld ist, prüfen ob es auch ein c_-Feld dazu gibt
        if (key.startsWith("d_")) {
            const baseKey = key.slice(2);
            const dValue = row[key];
            const cKey = "c_" + baseKey;
            const cValue = row[cKey];

            // c-Wert bevorzugen, wenn er nicht null ist
            merged[baseKey] = cValue !== null && cValue !== undefined ? cValue : dValue;
        } else if (!key.startsWith("c_")) {
            // Sonstige Felder übernehmen (z.B. MBL_No, error_count)
            merged[key] = row[key];
        }
    }

    return merged;
}

mergedData = data.map(mergeDispoRow);

return {{mergedData}};