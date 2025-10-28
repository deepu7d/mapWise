import type { Destination } from "@repo/types";
type formData = {
  name: string;
  roomId?: string;
  destination?: Destination;
};
type formSubmitProps = {
  data: formData;
  sessionId: string;
};

export const handleFormSubmit = async (props: formSubmitProps) => {
  setIsLoading(true);
  try {
    const userPosition = await getCurrentLocations();
    let response;

    try {
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/room/join/${data.roomId}`,
        {
          username: data.name,
          position: userPosition,
        }
      );

      if (response && response.data) {
        const sessionData: sessionData = response.data;
        sessionStorage.setItem("session-cookie", JSON.stringify(sessionData));
        toast.success("Redirecting to room...");
        router.push(`playground/${sessionData.roomId}`);
      } else {
        console.error("Failed to get a valid response from the server.");
      }
    } catch (axiosError) {
      // Handle axios errors
      let errorMessage = "An error occurred. Please try again.";

      if (axios.isAxiosError(axiosError)) {
        errorMessage = axiosError.response?.data?.message || axiosError.message;
      } else if (axiosError instanceof Error) {
        errorMessage = axiosError.message;
      }

      toast.error(errorMessage);
      console.error("An error occurred during API request:", axiosError);
    }
  } catch (geoError) {
    // Handle geolocation errors
    let errorMessage =
      "Failed to get your location. Please enable location services.";

    if (geoError instanceof GeolocationPositionError) {
      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          errorMessage =
            "Location permission denied. Please enable location access.";
          break;
        case geoError.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case geoError.TIMEOUT:
          errorMessage = "Location request timed out. Please try again.";
          break;
      }
    } else if (geoError instanceof Error) {
      errorMessage = geoError.message;
    }

    toast.error(errorMessage);
    console.error("Geolocation error:", geoError);
  } finally {
    setIsLoading(false);
  }
};
