import {
    GoogleMap,
    useJsApiLoader,
    StandaloneSearchBox,
    MarkerF,
} from "@react-google-maps/api";
import {useState, useEffect, useMemo, useRef} from "react";
import {Button, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import {getGeocode} from "use-places-autocomplete";
import {CircularProgress} from "@mui/material";
import Typography from "@mui/material/Typography";
//address: All data from the address (street, number, zipCode, city, country, latitude, longitude)
//setAddress: Function to set the address object
//onlyView: Boolean to decide whether the map is only for viewing or for editing
const Maps = ({address, setAddress, onlyView, width, height, isStudyGroup}) => {
    const [libraries] = useState(["places"]);
    const {isLoaded} = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [map, setMap] = useState(null);
    //Base coordinates for the map (Coords from TUM Campus Garching)
    const [latitude, setLatitude] = useState(48.2656488);
    const [longitude, setLongitude] = useState(11.6705176);

    const formatAddressToString = (address) => {
        return `${address.street} ${address.number}, ${address.zipCode} ${address.city}, ${address.country}`;
    };

    //Default address string --> Needed for the textfield in the map when submitting the location address
    const [addressString, setAddressString] = useState(
        "Boltzmannstraße 15, 85748 Garching bei München, Deutschland"
    );

    const center = useMemo(() => {
        return {lat: latitude, lng: longitude};
    }, [latitude, longitude]);

    useEffect(() => {
        map?.panTo({lat: latitude, lng: longitude});
        if (address) {
            setAddressString(formatAddressToString(address));
        }
        setLongitude(address.longitude);
        setLatitude(address.latitude);

    }, [address, latitude, longitude, map, onlyView]);

    const inputRef = useRef();

    //Function to set the address components (From the search via textfield or marker) to the address object
    function setAddressComponentsToAddress(addressComponents, lat, lng) {
        try {
            let streetNumber;
            if (addressComponents.find((component) => component.types.includes("street_number"))) {
                streetNumber = addressComponents.find((component) =>
                    component.types.includes("street_number")
                ).long_name;
            } else {
                streetNumber = "";
            }
            const street = addressComponents.find((component) =>
                component.types.includes("route")
            ).long_name;
            const city = addressComponents.find((component) =>
                component.types.includes("locality")
            ).long_name;
            const zipCode = addressComponents.find((component) =>
                component.types.includes("postal_code")
            ).long_name;
            const country = addressComponents.find((component) =>
                component.types.includes("country")
            ).long_name;

            setAddress({
                country: country,
                city: city,
                zipCode: zipCode,
                street: street,
                number: streetNumber,
                latitude: lat,
                longitude: lng,
            });
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    //For Marker drag event
    const changeCoordinates = async (coord) => {
        const {latLng} = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();

        setLatitude(lat);
        setLongitude(lng);

        // Reverse geocode the coordinates to get the address
        //Important for the marker to show the address after dragging
        const results = await getGeocode({location: {lat, lng}});
        setAddressComponentsToAddress(results[0].address_components, lat, lng);
        setAddressString(results[0].formatted_address);
    };

    //For textfield search (StandaloneSearchBox)
    const handlePlaceChanged = () => {
        const [place] = inputRef.current.getPlaces();
        if (place) {
            setLatitude(place.geometry.location.lat());
            setLongitude(place.geometry.location.lng());
            setAddressComponentsToAddress(
                place.address_components,
                place.geometry.location.lat(),
                place.geometry.location.lng()
            );
            setAddressString(place.formatted_address);
        }
    };

    //New tab for the Routes in Google Maps from user location to the address
    const handleClickOpen = () => {
        //window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressString)}&travelmode=transit`, "_blank");
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}&travelmode=transit`,
            "_blank"
        );
    };


    const standAloneSearchBox = () => {
        return (<Stack direction={"row"}>
            <StandaloneSearchBox
                onLoad={(ref) => (inputRef.current = ref)}
                onPlacesChanged={handlePlaceChanged}
            >
                <Box width={"80vh"} height={"10vh"}>
                    <TextField
                        type={"text"}
                        placeholder={"Enter a location"}
                        value={addressString}
                        fullWidth={true}
                        onChange={(event) => setAddressString(event.target.value)}
                    />
                </Box>
            </StandaloneSearchBox>
        </Stack>)
    }


    return (
        <>

            {isLoaded ? (
                <Stack spacing={2} alignItems={"center"}>
                    {onlyView && addressString && (
                        <Stack alignItems={"center"} spacing={1}>
                            <Typography>Location</Typography>
                            <Typography>{addressString}</Typography>
                        </Stack>
                    )}
                    <GoogleMap
                        mapContainerClassName="map-container"
                        center={center}
                        zoom={15}
                        onLoad={(map) => setMap(map)}
                        options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                        }}
                    >
                        <Box width={width} height={height}/>
                        <MarkerF
                            draggable={!onlyView}
                            onDragEnd={(e) => changeCoordinates(e)}
                            position={{lat: latitude, lng: longitude}}
                        />
                    </GoogleMap>
                    {!onlyView ? (
                        standAloneSearchBox()
                    ) : (
                        <Button
                            component="button"
                            onClick={() => {
                                handleClickOpen();
                            }}
                            size={"large"}
                            sx={{border: 1}}
                        >
                            Open in Google Maps
                        </Button>
                    )}

                </Stack>
            ) : (
                <CircularProgress/>
            )}

        </>
    );
};

Maps.propTypes = {
    address: PropTypes.object.isRequired,
    setAddress: PropTypes.func,
    onlyView: PropTypes.bool.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
};
export default Maps;
