export const convertTemperature = (tempCelsius: number, unit: 'celsius' | 'fahrenheit'): number => {
    if (unit === 'fahrenheit') {
        return (tempCelsius * 9 / 5) + 32;
    }
    return tempCelsius;
};

export const formatTemperature = (tempCelsius: number, unit: 'celsius' | 'fahrenheit'): string => {
    const converted = convertTemperature(tempCelsius, unit);
    return `${Math.round(converted)}°${unit === 'celsius' ? 'C' : 'F'}`;
};

export const convertDistance = (distKm: number, unit: 'kilometers' | 'miles'): number => {
    if (unit === 'miles') {
        return distKm * 0.621371;
    }
    return distKm;
};

export const formatDistance = (distKm: number, unit: 'kilometers' | 'miles'): string => {
    const converted = convertDistance(distKm, unit);
    return `${converted.toFixed(1)} ${unit === 'kilometers' ? 'km' : 'mi'}`;
};

export const convertArea = (areaHa: number, unit: 'hectares' | 'acres'): number => {
    if (unit === 'acres') {
        return areaHa * 2.47105;
    }
    return areaHa;
};

export const formatArea = (areaHa: number, unit: 'hectares' | 'acres'): string => {
    const converted = convertArea(areaHa, unit);
    return `${converted.toFixed(2)} ${unit === 'hectares' ? 'ha' : 'ac'}`;
};

export const convertRainfall = (rainMm: number, unit: 'millimeters' | 'inches'): number => {
    if (unit === 'inches') {
        return rainMm / 25.4;
    }
    return rainMm;
};

export const formatRainfall = (rainMm: number, unit: 'millimeters' | 'inches'): string => {
    const converted = convertRainfall(rainMm, unit);
    return `${converted.toFixed(1)} ${unit === 'millimeters' ? 'mm' : 'in'}`;
};
